---
title: 빌드, 테스트, 배포
weight: 4
---

## 1.Docker Image Build & Docker Hub Push
### 1)Jenkinsfile에 이미지를 빌드하는 stage를 추가하고 확인
```
stage("docker image build"){
  steps{
      sh 'docker build -t jenkinspipeline2 .'
  }
}
```
- 이미지 빌드가 안되는 경우
  - Jenkins에 Docker 관련 Plugin 을 설치

- Jenkins에서 host docker 접근 권한 부여
```
groupadd -f docker
usermod -aG docker jenkins
chown root:docker /var/run/docker.sock
```
### 2)Docker Hub에 이미지를 푸시하기 위한 준비 작업
- Docker Hub에서 토큰을 발급받기

- 이미지를 저장하기 위한 Repository를 생성
  - dragonhailstone/jenkinspipeline2
  - 업로드 되는 도커 이미지는 저장소의 이름과 동일한 이름을 가져야 합니다.


- 토큰을 Jenkins의 Credential에 저장: Jenkinsfile에 Token을 직접 사용하면 에러가 발생하고 이후에는 git에 push가 안됨 
  - Username And Password로 등록하는데 Username에 DockerHub의 계정 이름을 설정하고 Password에 토큰 값을 설정하고 ID를 정한 후 ID를 기억

### 3)Docker Login
- Jenkinsfile에 Credential ID를 변수로 등록
```
environment{
   DOCKERHUB_CREDENTIALS = credentials("jenkinspipeline2")
}
```
- ImageBuild Stage는 저장소 이름으로 변경하고 로그인 작성
```
stage("docker image build"){
  steps{
      sh 'docker build -t dragonhailstone/jenkinspipeline2 .'
  }
}

stage('docker hub login'){
  steps{
      sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
  }
}
```
### 4)Docker Image Push
- stage에 추가
```
stage('docker hub push'){
  steps{
      sh 'docker push dragonhailstone/jenkinspipeline2:latest'
  }
}
```
## 2.젠킨스가 제공하는 환경 변수
- env.VARNAME으로 사용이 가능한데 이 변수는 전역 변수
- env가 제공되는 변수
```
BUILD_ID

JOB_NAME

CHANGE_ID

CHANGE_URL

CHANGE_TARGET

CHANGE_BRANCH

BUILD_NUMBER

JENKINS_URL

BUILD_URL

JOB_URL
```
- currentBuild 라는 환경 변수는 현재 빌드에만 해당되는 지역 변수
```
number
result
currentResult
duration
keepLog
displayName
```

## 3.배포
### 1)Jenkinsfile에 컨테이너를 만드는 코드를 추가
```
         stage('deploy'){
            steps{
                sh 'docker run -d --rm -p 8765:8080 --name jenkinspipeline2 dragonhailstone/jenkinspipeline2'
            }
         }
```
### 2)인수 테스트
- Spring 루트 디렉터리에 스크립트 파일 생성 acceptance_test.sh
```sh {filename="acceptance_test.sh"}
#!/bin/bash
test $(curl IP주소:8765?a=1\&b=2) -eq 2
```
- 스크립트 파일을 실행하는 코드를 스테이지에 추가
```
         stage('acceptance_test'){
            steps{
                sleep 60
                sh 'chmod +x acceptance_test.sh && ./acceptance_test.sh'
            }
         }
```
- sleep을 사용하는 이유는 docker run -d 가 비동기 방식으로 실행되므로 연속해서 테스트 하는 명령을 사용하게 되면 컨테이너가 만들어지기 전에 테스트를 해서 실행은 제대로 되는데 테스트 단계에서 실패로 판정하는 경우가 발생할 수 있음

### 3)clean up 스테이지 추가
```
post{
   always{
       sh 'docker stop jenkinspipeline2'
   }
}
```
## 4.인수 테스트 작성
### 1)개요
- 웹 애플리케이션의 경우 curl 명령을 이용해서 인수 테스트 가능
- 기술적 측면만 보면 REST 웹 서비스를 작성한 경우 curl 호출 방식으로 모든 블랙 박스 테스트(사용자의 요구 사항에 맞게 동작하는지 기능을 테스트: 모든 경우를 전부 테스트, 경계값 분석을 해주는 것이 중요)를 구성할 수 있음
- curl 명령으로 테스트를 하는 것은 읽고 이해하기가 어려우며 유지보수에도 좋지 못함

### 2)사용자-대면 테스트 작성
- 대부분의 소프트웨어가 특정한 목적을 가지고 개발되며 대부분은 개발자가 아닌 일반 사용자에게 서비스를 제공
- 사용자가 인수 기준을 정해야 하며 이를 가지고 자동 인수 테스트를 수행하도록 해주어야 합니다.
- 이런 용도로 사용되는 프레임워크로 큐컴버, 피트니스, JBehave 등이 있음   
  사용자가 인수 기준을 정하고 개발자가 믹스쳐와 스텝을 정의해서 자동 인수 테스트가 수행되도록 함
- 인수 기준을 시나리오 형태로 작성
```
Given I have two numbers: 1 and 3
When the calculator sums them
Then I receive 3 as a result
```
- 개발자는 픽스쳐 또는 스텝 정의라고 부르는 사용자 친화적인 도메인 특화 언어(DSL) 와 프로그래밍 언어와 통합해서 테스트를 작성

### 3)cucumber
- build.gradle 파일의 dependencies에 의존성 라이브러리를 추가
```
testImplementation("io.cucumber:cucumber-java:7.2.0")
testImplementation("io.cucumber:cucumber-junit:7.2.0")
```
- 기능 사양을 실행할 수 있는 자바 바인딩을 생성: src/test/java/acceptance/StepDefinitions.java 파일로 생성

## 5.Kubernetes
### 1)쿠버네티스에서 업로드한 이미지를 파드로 배포
=>deployment.yaml 파일을 생성하고 작성
```yml {filename="deployment.yaml"}
apiVersion: apps/v1  #API 버전은 apps/v1(batch/v1, v1)

kind: Deployment

# 부가 정보를 설정
metadata:
  name: calculator-deployment
  labels:
    app: calculator

spec:
  # 동일한 이미지로 만든 파드가 3개
  replicas: 3
  # Deployment가 관리할 파드를 찾는 방법
  # 레이블로 찾는데 이름은 app:calculator
  selector:
    matchLabels:
      app: calculator
  # 실제 생성될 파드의 사양
  template:
    # 파드의 이름 설정
    metadata:
      labels:
        app: calculator
    # 각 파드가 containerd나 docker에서 만들어질 때 컨테이너 이름과 이미지 그리고 외부에 공개될 포트 번호
    spec:
      containers:
      - name: calculator
        image: dragonhailstone/jenkinspipeline2
        ports:
        - containerPort: 8080
```
- yaml 파일 실행   
`kubectl apply -f deployment.yaml`
- 파드 확인   
`kubectl get pods`

- 로그 확인   
`kubectl logs pods/파드의이름`

- kubectl 명령 확인: https://kubernetes.io/docs/reference/kubectl/

### 2)Service
- 사용자 -> Service -> Pod 를 선택해서 요청을 전송
- service.yaml 파일을 생성하고 작성
```yaml {filename="service.yaml"}
apiVersion: v1
kind: Service
metadata:
  name: calculator-service
spec:
  type: NodePort
  selector:
    app: calculator
  ports:
  - port: 8080
```
- 서비스 실행   
  `kubectl apply -f service.yaml`

- 서비스 확인   
  `kubectl get svc`   
  `kubectl describe svc 서비스이름`   
- 애플리케이션 노출: type
  - ClusterIP: 기본 설정 값으로 서비스는 내부 IP만 소유
  - NodePort: 각 클러스터 노드 마다 동일한 포트를 갖도록 서비스를 노출하는데 물리적 기기(노드)는 서비스로 전달되는 포트를 오픈하며 이렇게 되면 다른 노드에서 <노드-IP>:<노드포트>로 접근하는 것이 가능
  - LoadBalancer: 외부 로드 밸런서를 생성한 후 서비스에 별도의 외부 IP를 할당하는 것으로 클러스터를 외부로 노출해서 접근이 가능하도록 하는 것
  - Ingress: 클러스터 외부에서 클러스터 내부 서비스로 HTTP와 HTTPS 경로를 노출   
             외부에 로드밸런서를 배치하고 그 안에 ingress를 배치
   ```
   사용자 -> 인그레스 매니지드 로드 밸런서(로드밸런서) -> 인그레스 -> 서비스
   인그레스에 라우팅 규칙 명시
   외부 접근하려면 로드 밸런서가 필수
   파드내의 컨테이너는 포트로 통신
   파드와 파드는 같은 네트워크 대역으로 통신
   노드와 노드는 ClusterIP또는 NodePort로 통신
  ```
  - ExternalName: 외부 URL을 내부에서 다른 이름으로 접근할 수 있도록 하는 것

### 3)파드의 업데이트 전략
- Deployment를 만들 때 spec 항목에 strategy의 type에 설정
  - 기본은 RollingUpdate   
	  순서대로 하나를 생성하고 정상 동작하면 새로운 하나를 만들면서 과거의 하나의 삭제해 나가는 방식

### 4)캐시 전략
- 컨테이너를 사용하게 되면 컨테이너를 사용하지 않는 경우보다 응답 속도가 느리게 됩니다.   
  이런 경우 자주 사용하는 메서드에 Cache 기능을 부여해서 동일한 호출의 경우는 캐시에서 응답하도록 설정하는 것이 좋습니다.
```
인메모리DB: WAS와 DB간에 각각 메모리에 업데이트 시각을 기록해놓고 서로의 업데이트 시간이 같으면 메모리에 저장된 변수를 WAS에서 제공, WAS업데이트시간<DB업데이트시간이면 메모리갱신
캐싱: DP
```
