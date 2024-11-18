---
title: ECS
weight: 7
---
## ECS 기본
### Region, AZ
- Region > AZ(가용영역)
  - 배포를 할 때는 리전 단위로
  - 가용 영역을 쓸 때는 로드밸런서를 쓸 때

### Serverless 
- Serverless: 서버 애플리케이션을 직접 구축할 필요가 없음
  - DB + API Server
- 사용 이유: 유지 관리 오버헤드가 없음, AWS가 관리

### 롤링 업데이트
- 롤링 업데이트: A1, A2 파드를 B1, B2로 업데이트 시 흐름
  - A1, A2 -> A1, A2, B1, B2 -> B1, B2 헬스체크 -> A1, A2 제거 -> B1, B2

### CICD 흐름
```
CI: 소스코드 작성 및 수정 -> (Code Push) -> Code Repository(Test, Application Build, Image Build) ->
-> (Image Push) -> Image Registry(ECR) -> 
-> CD : (Deploy) -> Docker, Kubernetes(ECS, EKS)
```

### AWS ECS
- Cluster: Kubernetes나 Docker가 설치되는 네트워크
- Task: 배포하기 위한 manifest
- Service: kubectl apply
- LoadBalancer 알고리즘: Round Robin, 자원소모에 따라

## 1. AWS를 이용한 컨테이너 이미지 배포 CI/CD
### 1)Spring Boot Project를 만들어서 GIT 배포
```java {filename="/src/main/java/com.gmail.dragonhailstone.awscicd/FrontController.java"}
package com.gmail.dragonhailstone.awscicd;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FrontController {
    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}
```

### 2)Spring Boot Web Project를 위한 Dockerfile 생성
```Dockerfile {filename="/Dockerfile"}
FROM amazoncorretto:17
CMD ["./mvnw", "clean", "package"]
COPY ./build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```
- 애플리케이션 빌드를 수행: 이 작업을 수행하지 않으면 COPY 구문에서 에러가 발생      
  `./gradlew clean build`
- 이미지 빌드를 수행   
  `docker build -t awscicd .`


### 3)코드가 git에 push 될 때 애플리케이션을 빌드하도록 git action 파일을 추가
- .github 디렉토리를 만들고 그 안에 workflows 디렉토리를 만들고 그 안에 yaml 파일을 추가해서 작성
```yaml {filename="cicd.yaml"}
name: AWS CI CD
on:
 push:
   branches: ["main"]

jobs:
 # Spring Boot 애플리케이션을 빌드하여 도커허 브에 푸시하는 과정
 build-docker-image:
   runs-on: ubuntu-latest
   steps:
     - uses: actions/checkout@v3
     # 1. Java 17 세팅
     - name: Set up JDK 17
       uses: actions/setup-java@v3
       with:
         java-version: '17'
         distribution: 'temurin'

     # 2. Spring Boot 애플리케이션 빌드
     - name: Grant execute permission for gradlew
       run: chmod +x gradlew

       # Gradle 빌드 엑션을 이용해서 프로젝트 빌드
     - name: Build with Gradle
       uses: gradle/gradle-build-action@v2.6.0
       with:
         arguments: build
```
### 4)git hub에 레포지토리를 만들어서 코드를 푸시
- 애플리케이션 빌드가 성공하는지 확인

### 5)이미지를 만들어서 이미지 레지스트리에 푸시
- 레지스트리 종류
  - Docker Hub
  - Private Registry
  - Public Cloud 의 관리형 Registry

- AWS에 저장소를 생성(ECR 서비스에 생성)   
  `계정번호.dkr.ecr.ap-northeast-2.amazonaws.com/awscicd`
- 위에서 만든 저장소에 이미지를 푸시할 수 있는 정책을 생성(IAM 서비스에서 수행)
  - IAM에서 정책을 선택하고 [정책 생성]을 클릭하고 JSON을 선택
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
            "Resource": "arn:aws:ecr:ap-northeast-2:계정번호:repository/레포지토리"
        },
        {
            "Effect": "Allow",
            "Action": "ecr:GetAuthorizationToken",
            "Resource": "*"
        }
    ]
}
```
  - 숫자 부분은 자신의 계정 번호이고 awscicd 는 레포지토리 이름
  - 정책 이름(private_image_push)를 설정하고 [정책 생성] 클릭
- 자격 증명 공급자(외부에서 AWS를 사용하고자 할 때 설정하는 새로운 정책)를 생성
  - https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services 에서 git hub에서 사용하고자 하는 경우의 값을 복사해서 대입
  - 자격 증명 공급자에게 역할(웹 자격 증명)을 할당   
    git hub 계정, 레포지토리, 브랜치를 설정한 후 이전에 만든 이미지를 푸시할 수 있는 권한을 부여
- Git Hub에서 푸시가 될 때 로그인 되는지 확인: Git Action 파일 수정
```yml {filename="cicd.yaml"}
name: AWS CI CD
on:
 push:
   branches: ["main"]

permissions:
 id-token: write
 contents: read

jobs:
 # Spring Boot 애플리케이션을 빌드하여 도커허 브에 푸시하는 과정
 build-docker-image:
   runs-on: ubuntu-latest
   steps:
     - uses: actions/checkout@v3
     # 1. Java 17 세팅
     - name: Set up JDK 17
       uses: actions/setup-java@v3
       with:
         java-version: '17'
         distribution: 'temurin'

     # 2. Spring Boot 애플리케이션 빌드
     - name: Grant execute permission for gradlew
       run: chmod +x gradlew

       # Gradle 빌드 엑션을 이용해서 프로젝트 빌드
     - name: Build with Gradle
       uses: gradle/gradle-build-action@v2.6.0
       with:
         arguments: build

     # 3. AWS 로그인
     - name: Configure AWS Credentials
       uses: aws-actions/configure-aws-credentials@v4
       with:
         role-to-assume: arn:aws:iam::계정번호:role/awscicd
         role-session-name: sampleSessionName
         aws-region: ap-northeast-2
```
- role-to-assume 값은 aws의 role에서 생성된 것을 확인해서 작성
- 이미지를 푸시하기 위한 작업을 git action에 추가
```yml {filename="cicd.yaml"}
name: AWS CI CD
on:
  push:
    branches: ["main"]

permissions:
  id-token: write
  contents: read

env:
  ECR_REPOSITORY: awscicd

jobs:
  # Spring Boot 애플리케이션을 빌드하여 도커허 브에 푸시하는 과정
  build-docker-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # 1. Java 17 세팅
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      # Gradle 빌드 액션을 이용해서 프로젝트 빌드
      - name: Build with Gradle
        uses: gradle/gradle-build-action@v2.6.0
        with:
          arguments: build

      # 3. AWS 로그인
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::계정번호:role/awscicd
          role-session-name: sampleSessionName
          aws-region: ap-northeast-2
      
      # 4. ECR 로그인
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@62f4f872db3836360b72999f4b87f1ff13310f3a

      # 5. 이미지 빌드 및 ECR에 푸시
      - name: Build and Push Image to AWS ECR
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

```

### 6)배포된 이미지를 가지고 ECS에 배포해서 CICD 마무리
- ECS 서비스에서 Cluster 와 Task 그리고 Service를 생성   
  필요하면 Load Balancer 도 추가
  - Cluster: CICD
  - Task를 생성할 때 사용한 Container 이름: cicd
  - Task이름: awscicd
  - Service 이름: awscicd
- 태스크의 json 파일을 다운로드 받아서 프로젝트에 복사를 하고 image 부분을 제거: 이미지는 푸시한 이미지를 다운로드 받을 거라서 기존 이미지는 필요없음
- Git Action 파일을 수정해서 서비스에 배포
```yml
name: AWS CI CD
on:
  push:
    branches: ["main"]

permissions:
  id-token: write
  contents: read

env:
  ECR_REPOSITORY: awscicd
  AWS_REGION: ap-northeast-2
  ECS_SERVICE: awscicd
  ECS_CLUSTER: CICDCluster
  CONTAINER_NAME: cicd
  ECS_TASK_DEFINITION: ./task-definition.json

jobs:
  # Spring Boot 애플리케이션을 빌드하여 도커허 브에 푸시하는 과정
  build-docker-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # 1. Java 17 세팅
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      # Gradle 빌드 액션을 이용해서 프로젝트 빌드
      - name: Build with Gradle
        uses: gradle/gradle-build-action@v2.6.0
        with:
          arguments: build

      # 3. AWS 로그인
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::905418305225:role/awscicd
          role-session-name: sampleSessionName
          aws-region: ap-northeast-2
      
      # 4. ECR 로그인
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@62f4f872db3836360b72999f4b87f1ff13310f3a

      # 5.이미지 빌드 및 푸시
      - name: Build and Push Image to AWS ECR
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      # 6.task를 수정하는 작업
      - name: Fill in the new image ID in the Amazon ECS Task Definition
        id: task-def
        uses: aws-actions/amazon-ecs-render-task-definition@c804dfbdd57f713b6c079302a4c01db7017a36fc
        with:
          task-definition: ${{ env.ECS_TASK_DEFINITION }}
          container-name: ${{ env.CONTAINER_NAME }}
          image: ${{ steps.build-image.outputs.image }}

      # 7. ECS에 태스크를 배포
      - name: Deploy Amazon ECS Task Definition
        uses: aws-actions/amazon-ecs-deploy-task-definition@df9643053eda01f169e64a0e60233aacca83799a
        with:
          task-definition: ${{ steps.task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
```
- ECR에 이미지를 푸시하기 위해서 만든 Role에 ECS를 사용할 수 있는 정책을 추가
```
Source Code 수정 -> (Push) -> Git Action 수행(코드체크아웃, 애플리케이션빌드, Docker이미지 생성, Image Push)
-> Image -> Manifest 정의 -> apply 해서 배포
- Manifest 정의: task-definition.yaml 수정(이미지이름, 컨테이너이름)
- apply해서 배포: ECS에서 task-definition을 읽어서 배포
```