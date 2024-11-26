---
title: ECR ECS
weight: 4
---
## 참고
### IAM 과정
```{filename="IAM과정"}
IAM(인증)에서 USER 생성         ===>        Access Key와 Secret Access Key 발급
            ROLE 부여                       (외부로 노출되면 안됨) DB나 다른 애플리케이션에서 받아와야 함
                - S3 Full Access
                - Cloud Front(CDN) Full Access

위 방식 대신 Open ID Connect 이용 추천
aws와 github에 각각 사용할 서비스만 등록
키를 사용하면 광범위한 서비스에 액세스 가능하기 때문
```
### 패키지 설치 주의사항
- python이나 node 설치 시
  - 학습을 할 때는 패키지를 Global로 설치해도 됨
  - 배포를 할 때는 python은 가상환경을 생성하고 작업하고 node는 local에 설치
    - python은 가상환경 사용 안하면 사이즈가 너무 커짐, 파이썬은 global 경로에 설치된 패키지 전부 등록
      - 가상 환경 사용시 가상 환경의 Lib 안에 패키지가 설치됨
    - node는 global 설치 시 실행에러 발생 가능, package.json에 적지 않음
    - 패키지를 같이 업로드하면 소스 레지스트리에서 거부 => 패키지 정보를 저장하는 파일을 생성
      - requirements.txt 관용화된 파일이름 (python)
      - package.json (node)
### 빌드 주의 사항
- go는 Dockerfile 생성 시 다단계 빌드가 필요
  - 소스 코드 => 실행가능한 파일 생성 => 실행
  - 소스 코드는 실행 시 불필요, 포함 시 이미지 크기가 커짐
  - go나 c는 머신 종속적으로 실행가능 파일 만듬 => 미리 만들어서 빌드 파일 만들어 업로드가 불가
  - 실행 환경에서 빌드하고 컴파일 해야
- mysql도 과거에는 소스 코드만 제공해서 빌드를 써야 했음
  - 과거에는 모토로라 CPU와 인텔 CPU 등과 같은 여러 가지 CPU존재
- Java는 image 크기 축소 가능

## 1.Django 애플리케이션을 Docker Image로 만들어서 ECR에 업로드
### 1)프로젝트 생성
- 가상 환경 생성 및 설정
```
python3 -m venv 가상환경이름(Windows는 python)
source 가상환경이름/bin/activate(Windows는 가상환경이름/Scripts/activate: cd 가상환경이름 -> cd Scripts -> activate)

python3 -m venv venv
source ./venv/Scripts/activate
```
- 필요한 패키지 설치   
`pip install django djangorestframework`
- 프로젝트 생성   
`django-admin startproject apiserver .`
- 프로젝트 실행     
`python manage.py runserver`
  - 기본적으로 8000번 포트로 실행
- 장고 프로젝트를 외부 서버에 배포할 때 주의할 점
  - 장고 프로젝트는 고정 IP를 이용해서 배포를 할 때 runserver 다음에 IP를 설정하고 포트를 설정해서 배포하는 것이 가능
  - 기본 설정으로 배포를 하게 되면 특정 IP를 기재해서 배포를 해야 하는데 이렇게 하면 배포 명령을 매번 입력해야 함
- settings.py 파일의 기본 설정 변경
  - 장고는 외부라이브러리를 설치하거나 application을 만들면 등록을 해줘야 함
  - Time Zone
    - DB와 Application이 여러 대의 컴퓨터에서 동작할 때 동기화 중요
    - 쿠버네티스도 마스터노드와 워커 노드 시간 대역 맞추기가 첫번째
```python
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apiserver'
]

TIME_ZONE = 'Asia/Seoul'
```

### 2)사용자의 요청 처리
- apiserver 애플리케이션 디렉터리에 views.py 파일을 생성하고 요청을 처리하는 함수를 추가
```python {filename="views.py"}
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['GET'])
def index(request):
    data = {"result": "success",
            "data": [{"id":"itstudy", "name":"군계"},
                     {"id":"ggangpae1", "name":"아담"}]}
    return Response(data, status=status.HTTP_200_OK)
```
- urls.py 파일에 요청 처리 코드를 추가
```python {filename="urls.py"}
from django.contrib import admin
from django.urls import path

from .views import index
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index)
]
```

### 3)가상 환경에 설치된 패키지 목록을 텍스트 파일로 내보내기
- 루트 디렉터리에서 명령 실행
`pip freeze > requirements.txt`

### 4)도커 이미지 생성 및 실행
- 루트 디렉터리에 Dockerfile을 생성하고 작성
```
FROM --platform=linux/amd64 python:3.8-slim-buster as build

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

EXPOSE 80
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]
```
- 이미지 빌드   
`docker build -t apiserver .`
  - 이미지 빌드하다가 패키지 버전 문제로 에러가 발생할 수 있음   
    이런 경우에는 패키지 버전을 수정하던가 베이스 이미지 버전을 수정해서 해결

- 이미지를 컨테이너로 만들어서 실행   
`docker run -d --name apiserver -p 80:80 apiserver`

### 5)도커 이미지를 ECR에 Git Action을 이용해서 업로드
- Docker Hub에 업로드
  - Docker Hub에서 토큰을 발급(read-write 권한)
  - 레포지토리 생성: djangoecs
  - github에 시크릿 추가
  - git action을 위한 폴더를 루트에 생성 후 ./github/workflows/gitaction.yaml 파일을 생성하고 작성
```yml {filename="gitaction.yaml"}
name: django

on:
    push:
        branches: ["main"]
    pull_request:
        branches: ["main"]

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout
              uses: actions/checkout@v3
            
            - name: Python Setup
              uses: actions/setup-python@v4
              with:
                python-version: '3.8'
            - name: Install Dependencies
              run: |
                python -m pip install --upgrade pip
                pip install -r requirements.txt
            - name: Login to Dockerhub
              uses: docker/login-action@v1
              with:
                username: ${{ secrets.DOCKERHUB_USERNAME }}
                password: ${{ secrets.DOCKERHUB_TOKEN }}
            - name: DockerHub Upload
              env:
                NAME: ${{ secrets.DOCKERHUB_USERNAME}}
                REPO: djangoecs
                IMAGE_TAG: ${{ github.sha }}
              run: |
                docker build -t $REPO .
                docker tag $REPO:latest $NAME/$REPO:$IMAGE_TAG
                docker push $NAME/$REPO:$IMAGE_TAG
```
- Docker Image를 만들 때 고정된 태그를 붙일 수 있고 계속 변하는 태그를 사용할 수 있음   
  고정된 태그를 붙이면 Registry에서 이미지를 업데이트   
  이전에 만든 이미지는 소멸되고 새로운 이미지가 계속 업데이트   
  태그를 수정하면 이미지는 추가

  이미지가 변경되었을 때 컨테이너 또는 pod를 다시 배포하고자 하는 경우 태그가 고정인 경우는 컨테이너나 pod를 재시작하는 것만으로는 애플리케이션을 재배포 할 수 없으므로 이 경우에는 기존 이미지를 삭제하고 컨테이너나 파드를 다시 생성해야 함   
  태그가 변경되는 경우에는 컨테이너나 파드를 재생성하라고만 명령을 내리면 됨
  - ECS나 EKS가 아니더라도 여기까지 구현을 하고 EC2 서버에 도커나 쿠버네티스를 설치한 후 Git Action에 EC2 컴퓨터에 SSH로 접속을 하도록 해서 CI/CD를 구현하는 것이 가능
    - 가변 태그일 경우 이전 이미지 삭제해야
    - 고정 태그일 경우 컨테이너 중지하고 삭제 후 실행해야
      - latest tag: health check 후 종료되는 경우 이미지를 가지고 있지 않으면 돌릴 수 없음
  - 루트에 .gitignore 파일 생성
  ```{filename=".gitignore"}
  venv/
  ```
- ECR(Private Registry - 외부에 공개된 서버나 로컬 컴퓨터에 연결된 네트워크 상의 컴퓨터: 연결 가능한 상태로 만들고 생성)에 업로드
  - ECR은 AWS에서 제공하는 Docker Image Registry   
    public 과 private 설정이 모두 가능   
    별도의 Image Registry를 만들어서 관리가 어려운 경우 사용   
    public 으로 만들면 외부에서 Image를 pull 하는 것이 가능
    
    이 저장소를 외부 애플리케이션이나 Git Hub 같은 곳에서 사용하고자 하면 push 가 가능한 IAM 이나 Open ID Connect를 만들어 주어야 함
    
    외부 Application이 사용하고자 할 때는 access-key 와 secret access-key를 사용하고 git hub가 사용하고자 할 때는 Open ID Connect를 사용해야 함
```{filename="접근권한"}
access-key & secret-key-User > Role > Policy
Policy(정책):
    - 제공되는 권한: S3 Full Access(모든 버킷 접근 가능)
    - 제공되는 권한 + 제약(특정 버킷만 접근 가능)

Open ID Connect: Role
누가: github > user > repository > branch
누가 어떤 repo의 어떤 branch를 쓸지 설정
```
  - AWS의 Elastic Container Registry 서비스에 접속해서 하나의 Repository를 생성: djangoecs

  - 위의 레포지토리에 이미지를 push 할 수 있는 정책 생성   
    IAM 의 정책 탭에서 정책 생성을 클릭 > [JSON]선택 후 작업 추가 > 리소스 추가 > 정책 이름 작성 > 정책 생성 클릭
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Statement1",
			"Effect": "Allow",
			"Action": [
				"ecr:CompleteLayerUpload",
				"ecr:UploadLayerPart",
				"ecr:InitiateLayerUpload",
				"ecr:BatchCheckLayerAvailability",
				"ecr:PutImage"
			],
			"Resource": [
				"arn:aws:ecr:ap-northeast-2:AWS계정:repository/djangoecs"
			]
		},
        {
            "Effect": "Allow",
            "Action": "ecr:GetAuthorizationToken",
            "Resource": "*"
        }

	]
}
```
  - git의 repository에서 사용할 수 있는 자격 증명 공급자를 생성   
    git 공급자가 없는 경우에는 [공급자 생성]을 클릭하고 [Open ID Connect]를 선택

    작성 내용은 git 의 경우는 https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services 를 참고

    공급자 URL: https://token.actions.githubusercontent.com   
    대상: sts.amazonaws.com
  - 생성된 자격 증명 공급자를 선택하고 역할 할당: 자격 증명 공급자가 만들어진 경우 여기서부터 시작

{{% steps %}}

### 역할 할당 클릭

### 웹 자격 증명 클릭
조직에는 Git Hub의 유저 이름   
repository에 레포지토리 이름(미설정시 모든 repo 해당)   
branch에 브랜치 이름을 설정(미설정시 모든 branch 해당)

### 권한 정책 추가
앞에서 만든 권한을 선택하고 역할 이름을 생성   
django_image_push 검색 후 추가

### 역할 이름 설정

### ARN을 확인
{{% /steps %}}

  - 로그인 되는지 확인: git action의 yaml 파일 최상단 레벨에 추가
```yaml
permissions:
  id-token: write
  contents: read
```
  - 로그인 되는지 확인: git action의 yaml 파일의 steps에 추가
```yaml
            - name: AWS Role을 이용한 로그인
              uses: aws-actions/configure-aws-credentials@v4
              with:
                role-to-assume: arn:aws:iam::AWS계정:role/django_image_push
                role-session-name: sampleSessionName
                aws-region: ap-northeast-2
```
  - ECR에 업로드: git action의 yaml 파일의 steps에 추가
```yaml
            - name: ECR에 로그인
              id: login-ecr
              uses: aws-action/amazon-ecr-login@v1
            
            - name: build and push image to Amazon ECR
              id: build-image
              env:
                ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
                IMAGE_TAG: ${{ github.sha }}
              run: |
                docker build -t $ECR_REGISTRY/djangoecs:$IMAGE_TAG .
                docker push $ECR_REGISTRY/djangoecs:$IMAGE_TAG
```

## 2. ECS(Elastic Container Service)
### 개요
- 운영 중인 도커 컨테이너나 인스턴스가 몇 개 정도라면 오케스트레이션 도구 없이 운영이 가능하지만 수십 개에서 수백 개가 필요하다면 어디에 어떤 컨테이너가 실행되고 있고 어떤 문제점이 있는지 모니터링하고 관리할 수 있는 도구가 필요한데 이러한 도구가 컨테이너 오케스트레이션   
  이러한 목적으로 Docker Swarm 이나 Kubernetes 를 사용
- AWS의 ECS는 Auto Scaling Task 기반, IAM 지원, Application Load Balancer 지원, Fargate 지원 등 AWS에 맞춤화된 기능을 추가해서 편리하고 컨테이너 오케스트레이션을 활용할 수 있도록 해줌
- Task를 정의하고 서비스 관리 콘솔에서 옵션만 설정하면 됨

### 구성 요소
```{filename="참고"}
Dockerfile: 하나의 이미지
docker-compose: 1개 이상의 이미지를 가지고 컨테이너를 생성
docker에서는 실행 중인 컨테이너를 Image로 생성
```
- Cluster
  - ECS의 가장 기본적인 단위
  - Docker Container를 실행할 수 있는 가상의 공간
  - Cluster 자체는 기본적으로 컴퓨팅 자원을 포함하지 않는 논리적인 단위
  - 작업을 정의하고 서비스를 만들어 달라고 요청을 하면 그 때 컴퓨팅 자원을 연결해서 실행
- Task: Pod
  - ECS에서 컨테이너를 실행하는 최소 단위
  - 클러스터 상에서 동작하는 1개 또는 1개 이상의 컨테이너들을 지칭
  - 하나의 컨테이너로 구성 될 수도 있고 여러 개의 컨테이너로 구성될 수도 있음
- Task Definition: docker-compose와 유사
  - 실제 실행될 컨테이너를 만들기 위한 도면
  - docker 명령으로 실행할 수 있는 거의 모든 옵션이 설정 가능
  - 이 파일의 내용을 가지고 컨테이너를 생성
- Service: Deployment와 유사
  - 작업을 하나의 오케스트레이션 단위로 묶은 것
  - 이 단위로 로드 밸런서 그리고 오토 스케일링을 연결해서 애플리케이션 단위로 조절
- 컨테이너 인스턴스
  - 컨테이너를 실행할 수 있도록 해주는 객체(인스턴스, 컴퓨터 등)
  - 파게이트 서비스를 선택하면 인스턴스를 직접 생성하거나 설정할 필요가 없이 AWS에서 알아서 생성

### Fargate
- AWS Serverless Service 중 하나
- 매니지드 컨테이너 오케스트레이션 서비스인 ECS와 EKS를 기반으로 작동하는 서비스
- Docker Container를 EC2 인스턴스 없이 독립적으로 실행할 수 있게 함
- EC2 인스턴스보다 vCPU나 RAM을 세세하게 설정할 수 있음

### 배포 방법
- 태스크로 배포: 단순하게 배포하는 것으로 오토 스케일링이나 로드 밸런서를 추가할 수 없음
- 태스크를 만든 후 서비스로 배포