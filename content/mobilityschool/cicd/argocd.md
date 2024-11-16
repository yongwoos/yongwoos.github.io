---
title: ArgoCD
weight: 6
---
## 복습
- Git 저장소의 내용을 가지고 Kubernetes에 배포를 수행해주는 도구
- Git Ops: Git을 이용한 자동 배포(Git을 이용한 배포 자동화)
  1. Git Action 이용해서 Image Build 하고 Docker Hub(private registry, public cloud의 image registry 사용가능)에 배포
     - public cloud의 Image 배포 서비스(ECS)
     - Test가 문제
     - 이미지 이름은 바꾸지 않고 태그만 바꿈
  2. Git의 Web Hook과 Jenkins 연결해서 Docker Hub에 배포, ArgoCD 많이 사용
     - Git Pull Request를 이용해서 다른 배포Repository에 알림
     - 배포Repo에 있는 manifest를 kubernetes나 docker 이용해서 배포
  3. Skaffold
     - 소스 코드의 변경이 발생하면 이미지 배포와 Kubernetes 배포
  4. Ansible
     - 여러 대의 컴퓨터를 하나의 묶음으로 만들고 이 컴퓨터들에 동시에 명령을 수행시키도록 하는 것
     - 구성하는 방법
       - Public Cloud에서 구성 시 동적 Inventory 구성
       - Private Cloud에서 구성 시 SSH를 비밀번호 없이 접속하도록 구성(비밀번호 입력같이 interactive하면 자동화가 안됨, SSH인증서를 발급해 해결)
     - SSH로 접속하고 python으로 명령수행(모든 노드에 SSH, python설치 필수)
     - 역사: 수동으로 설치 -> 이미지 스냅샷(퍼블릭 클라우드에서 인스턴스 생성 시 이미지 복제할 때 사용) -> ansible로 동시에 여러개 생성
  5. Jenkins
     - polling: 클라이언트가 직접 서버 조회하는 개념
     - push: 서버가 클라이언트에 알려주는 것
       - web push는 과거 데이터 push 해주지 않음
       - 카프카는 늦게 등록하더라도 처음부터 받아오기 가능, 메모리 큐가 있기 때문에 가능
- Multi-factor authentication: 2단계 이상의 인증
- 대기업은 gitlab 플랫폼기업은 github
- 현대자동차는 SAP-HANAdb와 go 사용
- Dockerfile(java, go, node) 배포 시 다단계 빌드
  - go: source복사 -> build -> run
  - node, java: build결과복사 -> run
```
go, c, c++: OSS가 실행가능한 프로그램으로 빌드, go->oss, 실행속도가 더 빠르게 됨
- 밖에서 빌드 후 도커파일에 복사 시 배포 환경에 실행될지 알 수 없음
java, .net: jvm이 인식 가능한 형태로 빌드, java->vm->oss, react->nodejs(vm)->oss
```
## Kubernetese CD 도구
### 1)Argo CD
- Git 저장소의 내용을 가지고 Kubernetes에 배포를 수행해주는 도구
- 실습
  - Git 저장소에서 Repository 생성: https://github.com/itstudy001/argocd.git
  - Kubernetes Deployment 생성: sample-cd-deployment.yaml
```yaml {filename="sample-cd-deployment.yaml"}
apiVersion: apps/v1

kind: Deployment

metadata:
  name: sample-cd-deployment

spec:
  replicas: 3
  selector:
    matchLabels:
      app: sample-cd-app
  template:
    metadata:
      labels:
        app: sample-cd-app
    spec:
      containers:
      - name: nginx-container
        image: nginx
```
  - ClusterIP를 사용하는 서비스 생성: sample-cd-clusterip.yaml
```yaml {filename="sample-cd-clusterip.yaml"}
apiVersion: v1

kind: Service

metadata:
  name: sample-cd-clusterip

spec:
  type: ClusterIP
  ports:
  - name: "http-port"
    protocol: "TCP"
    port: 8080
    targetPort: 80
  selector:
    app: sample-cd-app
```
  - git에 push

  - argocd 배포 파일 생성: sample-cd.yaml
```yaml {filename="sample-cd.yaml"}
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: sample-cd
  namespace: argocd
spec:
  project: default

  source:
    repoURL: https://github.com/itstudy001/argocd.git
    targetRevision: main
    path: samples
    directory:
      recurse: true

  destination:
    server: https://kubernetes.default.svc
    namespace: default

  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```
  - 배포 명령 수행: `kubectl apply -f sample-cd.yaml`

- Argo CD 도 Jenkins 처럼 Web Hook을 등록할 수 있습니다.   
  Web Hook을 등록하게 되면 git hub repository에서 코드 변경이 일어나면 자동으로 다시 배포할 수 있도록 할 수 있습니다.

### 2)skaffold
- 소스 코드의 변경을 감지해서 Docker Image Build를 수행하고 Repository에 업로드를 하고 쿠버네티스 배포를 자동으로 수행해주는 구글이 만든 OSS

- 설치
```bash
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \ \
sudo install skaffold /usr/local/bin/

skaffold version
```
- go 설치

- 실습
  - main.go 파일을 생성
    ```go {filename="main.go"}
    package main

    import(
    "fmt"
    "net/http"
    )

    func handler(w http.ResponseWriter, r *http.Request){
            fmt.Fprintf(w, "Hello Go")
    }

    func main(){
            http.HandleFunc("/", handler)
            http.ListenAndServe(":8000", nil)
    }
    ```
  - 실행   
    `go run main.go`

  - 이미지를 만들기 위한 Dockerfile을 생성
    ```Dockerfile {filename="Dockerfile"}
    FROM golang:1.14-alpine3.11 as builder
    COPY ./main.go ./
    RUN go build -o /go-app ./main.go

    FROM alpine:3.11
    EXPOSE 8000
    COPY --from=builder /go-app .
    ENTRYPOINT ["./go-app"]
    ```
  - 이미지를 생성   
	`docker build -t 이미지이름 .`   
    이미지 이름을 사용할 때 테스트 할 때는 아무이름이나 관계없지만 배포를 할 때는 `서버주소/이미지이름`의 형태가 되어야 하고 hub.docker.com에 배포할 때는 `아이디/레포지토리이름` 이 되어야 합니다


  - 도커 허브에 이미지를 푸시하기 위해서 저장소를 생성: test-skaffold


  - 이미지를 푸시: 도커 로그인이 되어 있어야 하고 이미지 이름이 계정/레포지토리이름이어야 합니다.
```bash
sudo docker login -u 아이디

sudo docker build -t 아이디/저장소이름

sudo docker push 아이디/저장소이름
```
  - pod 배포를 위한 deployment 파일 생성: skaffold-deployment.yaml
```yml {filename="skaffold-deployment.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: skaffold-deployment
spec:
  replicas:3
  selector:
    matchLabels:
      app: sample-skaffold
  template:
    metadata:
      labels:
        app: sample-skaffold
    spec:
      containers:
      - name: skaffold-container
        image: dragonhailstone/test-skaffold
```

  - 스캐폴드 파일을 생성: skaffold.yaml
```yml {filename="skaffold.yaml"}
apiVersion: skaffold/v2alpha3
kind: Config
build:
  artifacts:
  - image: dragonhailstone/test-skaffold
    docker:
      dockerfile: ./Dockerfile

  tagPolicy:
    dateTime: {}

  local:
    push: true

deploy:
  kubectl:
    manifests:
    - skaffold-*
```
  - 스캐폴드 시작   
    `skaffold dev`   
    정상 수행이 되면 소스 코드를 감시하다가 소스 코드에 변경이 발생하면 도커 이미지를 빌드하고 푸시를 수행한 후 skaffold 로 시작하는 yaml 파일을 전부 실행시킵니다.

# AWS 의 ECR 과 ECS를 이용한 CI/CD 구현
## 1.Spring Project 생성 및 작성
### 1)Spring Boot Project 생성: web 과 lombok 그리고 devtools의 의존성 만 설정

### 2)프로젝트에 Controller 클래스를 추가해서 요청에 대한 응답을 생성: FrontController
```java {filename="FrontController.java"}
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class FrontController {
   @RequestMapping("/")
   public Map<String, Object> index() {
       Map<String, Object> model = new HashMap<String, Object>();
      
       model.put("result", "success");
      
       return model;
   }
}
```

### 3)80번 포트로 실행할 수 있도록 하기 위해서 application.properties 파일을 삭제하고 application.yaml 파일을 만들어서 작성
```yaml {filename="application.yaml"}
server:
 port: 80
```
### 4)애플리케이션을 실행하고 브라우저에 localhost 라고 입력

## 2.Docker Image 생성 및 도커 허브에 push
### 1)Java Project는 빌드를 수행하고 빌드한 결과물을 이미지로 생성하므로 빌드
`./gradlew clean build`
- build/libs 디렉토리에 2개의 jar 파일이 생성되는데 이 파일이 빌드 결과물
- jenkins를 이용하는 경우는 이 과정에서 compileJava를 수행하고 단위 테스트 와 코드 커버리지 그리고 정적 분석 도구 수행을 합니다.

### 2)이미지 생성을 위한 Dockerfile을 생성하고 작성
```Dockerfile {filename="Dockerfile"}
FROM amazoncorretto:17
CMD ["./mvnw", "clean", "package"]
ARG JAR_FILE=target/*.jar
COPY ./build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 3)이미지 생성 여부 확인
`docker build -t cicd .`   
`docker images`

### 4)이미지를 가지고 컨테이너를 만들어서 포트포워딩해서 확인
`docker run --name cicd -d -p 80:80 cicd`
- 포트 에러가 발생하면 윈도우즈에서 앞의 포트를 변경하거나 현재 호트를 사용 중인 애플리케이션을 중지   
  `netstat -ano`명령으로 포트를 사용 중인 애플리케이션의 pid를 확인하고 작업관리자(CTRL+ALT+DELETE 수행)에서 세부 정보를 출력한 후 pid에 해당하는 프로세스를 종료
- 브라우저에서 localhost 명령으로 결과를 확인

## 3.Git Hub Repository에 업로드
### 1)Git Hub에 Repository를 생성(cicd)

### 2)Git Hub Repository에 소스 코드 업로드

## 4. 코드가 Git Hub에 Push가 될 때 이미지를 빌드해서 Docker Hub에 푸시
### 1)Docker Hub에서 레포리토리 생성: cicd


### 2)Docker Hub에서 Access Token을 발급: dckr_pat_rFhjg5sC0E5ZIvifGow1iJrmGoE

### 3)Git Hub의 Repository에 Secret Key 생성
- DOCKERHUB_TOKEN(필수)
- DOCKERHUB_USERNAME
- DOCKERHUB_REPOSITORY

### 4)프로젝트에 .github/workflows 디렉토리에 yaml 파일을 만들고 main 브랜치에 push 가 발생한 경우 이미지를 도커 허브에 푸시하는 코드를 작성
- action에서 권한 문제가 발생하면 콘솔에서 아래 명령을 한 번 수행
`git update-index --chmod=+x gradlew`

- 작성
```yaml
name: Java and AWS ECS CICD
on:
 push:
   branches: [ "main" ]

permissions:
 contents: read

jobs:
 build-docker-image:
   #ubuntu 환경에서 수행
   runs-on: ubuntu-latest
   steps:
   #소스 코드 가져오기
   - uses: actions/checkout@v3
   #JDK 설치
   - name: Set up JDK 17
     uses: actions/setup-java@v3
     with:
       java-version: '17'
       distribution: 'temurin'
   #Spring Boot Application Build
   - name: Build with Gradle
     uses: gradle/gradle-build-action@67421db6bd0bf253fb4bd25b31ebb98943c375e1
     with:
       arguments: clean bootJar

   #Docker Hub 로그인
   - name: Login to DockerHub
     uses: docker/login-action@v1
     with:
       username: ${{ secrets.DOCKERHUB_USERNAME }}
       password: ${{ secrets.DOCKERHUB_TOKEN }}

   #이미지 업로드
   - name: build and release
     run: |
       docker build -t ${{ secrets.DOCKERHUB_REPOSITORY }} .
       docker tag ${{ secrets.DOCKERHUB_REPOSITORY }}:latest ${{ secrets.DOCKERHUB_USERNAME }}/${{ secrets.DOCKERHUB_REPOSITORY }}:latest
       docker push ${{ secrets.DOCKERHUB_USERNAME }}/${{ secrets.DOCKERHUB_REPOSITORY }}:latest
```

## 5.AWS 의 ECR(Elastic Container Repository - 관리형 Image Registry)에 이미지를 배포
[PPT참조](https://ggangpae1.tistory.com/727)
### 1)ECR 서비스에 접속해서 Repository 생성(cicd)

### 2)만들어진 Repository에 Image를 push 할 수 있는 정책을 생성(private_image_push)
- IAM 서비스로 이동
- 정책 탭을 선택하고 [정책 생성]을 누르고 JSON을 클릭한 후 작성
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:CompleteLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:InitiateLayerUpload",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage"
            ],
            "Resource": "arn:aws:ecr:ap-northeast-2:ECR레포지토리계정:repository/cicd"
        },
        {
            "Effect": "Allow",
            "Action": "ecr:GetAuthorizationToken",
            "Resource": "*"
        }
    ]
}
```
  - 빨강색 부분은 자신의 ECR Repository에서 보고 수정
- 정책 이름(private_image_push)

### 3)Git Hub에서 AWS에 로그인 할 수 있는 자격 증명 공급자를 생성
- ppt 80p 부근 참조
- 역할 할당을 이용해서 어떤 Repository 의 어떤 Branch에서 접근할 것인지 설정

- 권한 추가(수행할 역할을 추가)
  - 이전에 만든 private_image_push 와 ECS를 검색해서 full access를 추가

- git hub에서 aws로 로그인되는지 확인: git action yaml 파일 수정

```yml
name: Java and AWS ECS CICD
on:
 push:
   branches: [ "main" ]

permissions:
 id-token: write
 contents: read


jobs:
 build-docker-image:
...
   #AWS에 로그인
   #arn 값은 자격 증명 공급자에서 만든 role에서 찾아서 설정
   - name: AWS Credentials
     uses: aws-actions/configure-aws-credentials@v4
     with:
       role-to-assume: arn:aws:iam::계정:role/cicd
       role-session-name: sampleSessionName
       aws-region: ap-northeast-2
  #Docker Hub 로그인
...
```

### 4)git hub action을 수정해서 ECR에 이미지를 푸시
```{filename="이미지레지스트리와 도커엔진"}
Image Registry:
upload를 할 때 무조건 update해 덮어씌움
tag값: 시간 또는 git hash값
tag 설정 안하면 latest tag 설정

Docker Engine:
docker run 명령: local image 확인 > 없으면 Image Registry 확인 > Pull
local에 같은 이름의 이미지가 있으면 image registry에서 업데이트 됐더라도 pull하지 않음
이미지:latest가 local에 있으면 Image Registry의 이미지:latest가 업데이트 됐더라도 pull 되지 않음

mysql 이미지:
mysql:latest와 mysql:8.0 두가지 이미지가 항상 업데이트 됨 
```