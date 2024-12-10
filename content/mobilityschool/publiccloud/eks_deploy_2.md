---
title: EKS 배포2
weight: 8
---
## 1.Back End Program Source 설정
## 참고지식
### Forwarding과 Redirection
- Forwarding: 기존의 데이터를 가지고 URL을 변경하지 않고 이동
  - 새로고침 때문
- Redirection: 기존의 데이터를 가지지 않고 URL을 변경해서 이동
  - 결과만 소유
- EX: 게시판에 10개의 데이터가 있음
  - 포워딩은 게시판 데이터의 요청 가지고 있음
  - 리다이렉션은 요청을 모르고 결과만 가지고 있음
- 데이터 1개를 게시판에 추가시킬 경우
  - Forwarding은 새로고침하면 데이터 요청이 다시 수행되고 11개
  - redirection은 10개
- 대부분의 읽기 작업은 Forwarding
  - 로그인은 새로고침 시 로그인이 다시 되면 안되기 때문에 forwarding으로 구현하지 않고 redirect로 구현
- 쓰기작업: 회원가입
  - 새로고침 시 회원가입이 또 되면 안됨
  - redirection으로 구현
- 로드밸런서도 리다이렉션의 일종
- 리다이렉션 시킬 때의 종류 2가지
  - 로드밸런싱 또는 API게이트웨이

### API Gateway
- 여러 서비스(POST, GET, PUT 등)가 있으면 각각 로깅해야 -> 로깅 시 귀찮을 수 있음
- 여러 서비스를 하나로 묶어서 게이트웨이와 연결 시킴
  - 공통된 로깅은 게이트웨이에서
- 리다이렉션의 역할

### CloudFront
- 캐싱
- 엣지 로케이션에는 새로운 배포 내용이 적용이 안되므로 캐싱을 정지하고 배포해야함
### 1)BackEnd Source Code
https://github.com/itggangpae/backend-app.git

### 2)데이터베이스 설정 수정
- RDS 나 EC2 인스턴스에 외부에서 접속할 수 있는 PostgreSQL을 설치
  - 설치 정보를 기반으로 프로젝트의 application.properties를 수정

- 샘플 데이터 생성
```
테이블 생성
CREATE TABLE region
(
  region_id      	SERIAL PRIMARY KEY,
  region_name    	VARCHAR(100) NOT NULL,
  creation_timestamp TIMESTAMP	NOT NULL
);

샘플 데이터 추가
INSERT INTO region (region_name, creation_timestamp)
VALUES ('서울', current_timestamp);

INSERT INTO region (region_name, creation_timestamp)
VALUES ('강릉', current_timestamp);

INSERT INTO region (region_name, creation_timestamp)
VALUES ('대전', current_timestamp);

INSERT INTO region (region_name, creation_timestamp)
VALUES ('광주', current_timestamp);
```
### 1) 애플리케이션이 실행 가능한 지 확인
- 실행

- 브라우저에서 아래 2개의 URL 확인
  - http://localhost:8080/health - 데이터베이스 연동 여부와 상관 없이 동작
  - http://localhost:8080/ - 데이터베이스의 데이터를 읽어와서 리턴

### 4)이미지를 레지스트리에 업로드
- ECR 에 레포지토리 생성: k8s/backend-app

- 로컬에서 푸시
  - 자바 애플리케이션의 경우는 빌드: ./gradlew clean build
  - 의존성 라이브러리 다운로드 -> 컴파일 -> 테스트 -> 빌드

- Docker에서 ECR에 접근할 수 있도록 로그인
```
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com

이미지 빌드: Dockerfile을 루트에 생성해야 함
docker build -t k8s/backend-app .

이미지를 푸시할 수 있도록 태그 수정
docker tag k8s/backend-app:latest 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:latest

이미지 푸시
docker push 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:latest
```
### 5)EKS 클러스터를 생성
- 클러스터를 만들기 위한 VPC를 CloudFormation으로 생성
  - 미리 만들어 둔 base_resources_cfn.yaml 파일을 생성

- kubectl 명령으로 클러스터를 생성
  - 이전에 만든 스택의 출력 탭을 눌러서 외부에서 사용할 수 있는 WorkerSubnets 값을 복사

  - 클러스터 생성

- 만들어진 애플리케이션을 배포
  - pod, replicaset, deployment, statefulset, daemonset 등을 이용해서 배포
  - pod를 만들어서 배포하기 위해서 야믈파일 생성
```
apiVersion: v1

kind: Pod

metadata:
  name: backend-pod
  labels:
    app: backend-app

spec:
  containers:
  - name: backend-container
    image: 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:latest
    ports:
    - containerPort: 8080
```
  - pod 실행: `kubectl apply -f pod.yaml`

  - pod 확인: `kubectl get pods`

- Load Balancer를 이용해서 외부에 공개
  - service 파일을 생성하고 작성
```
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: LoadBalancer
  selector:
    app: backend-app
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
```
  - service 실행: `kubectl apply -f service.yaml`

  - 확인   
    `kubectl get svc`

- 외부 공개 여부를 확인하는 것은 External IP 나 새로 만들어진 Load Balancer의 DNS를 확인해서 브라우저에서 입력

## 2.Front End Application을 생성해서 데이터를 가져오는지 확인
- react application을 생성
```
npx create-react-app frontend
```
- ajax를 이용해서 데이터 요청

- axios 설치
```
npm install axios
```
- App.js 파일을 수정
```
import logo from './logo.svg';
import './App.css';


import axios from 'axios'

function App() {
//자신의 서버 애플리케이션 배포 된 곳을 설정  axios.get('http://a681ef08306544d88ad9546d5f0878d6-1645069734.ap-northeast-2.elb.amazonaws.com:8080/').thend(function(response){
    console.log(response)
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```
  - 실행을 하고 브라우저에서 콘솔 창을 보면 에러: CORS 에러 발생

  - 클라이언트 애플리케이션이 웹 브라우저에서 접속하는 경우에는 서버에서 CORS 설정을 해주어야 합니다.

  - Spring Boot 는 CORS 설정을 할 때 3곳에서 가능
  - 별도의 클래스를 만들어서 설정: 모든 Controller에 적용

  - Controller 클래스 위에 적용하면 Controller 클래스에서 리턴하는 데이터에만 적용

  - Controller 클래스의 메서드 위에 적용하면 그 메서드가 제공하는 데이터에만 적용

  - Controller 클래스 위에 추가
```
@CrossOrigin(origins="*", allowedHeaders = "*")
```

  - 서버 애플리케이션 다시 배포
  - 이미지 태그에 변화가 없어서 pod 파일을 수정하지 않으면 다시 배포를 할려고 해도 변경 내용이 없다고 pod가 재배포 되지 않음   
    ECS는 git hub에서 배포를 할 때 task-definition을 수정하기 때문에 항상 배포가 이루어지는 것입니다.

- Front End 애플리케이션 배포
- 방법
  - EC2 인스턴스를 생성하고 그 안에 Web Server Application을 설치하고 그 Web Server Application 스펙에 맞춰 정적 웹 사이트를 제공

  - S3는 Web Server Application이 이미 구현된 형태로 정적 웹 호스팅 가능 설정을 하고 정적 웹 페이지를 업로드하면 됩니다.

  - react 애플리케이션을 배포할 때는 build를 수행해서 정적 웹 사이트 파일을 생성하고 생성된 파일들을 웹 서버 애플리케이션에 업로드하면 됩니다.

  - S3 버킷을 생성
  - 생성한 S3 버킷이 웹 서버가 될 수 있도록 설정을 수정

    접근 권한

    CORS 설정

    정적 웹 호스팅 설정
  - react 프로그램을 웹 호스팅할 수 있는 형태로 빌드   
    `npm run build`

  - S3 버킷에 업로드(현재 AWS 사용자가 S3 사용 권한을 가지고 있어야 함)   
    `aws s3 sync ./build s3://버킷이름`

- CloudFront 설정
  - CloudFront: CDN(Content Delivery Network) 설정

- HTTPS 인증서 사용
  - Certificate Manager 서비스에서 요청
  - CloudFront에 적용할 때는 반드시 인증서를 버지니아 북북에서 만들어야 합니다.
  - 만들어진 인증서를 cloudfront 에 연결
  - 인증서를 만들 때 사용한 도메인 과 cloudfront 연결
  - 프론트 앤드나 백 앤드 중 어느 한쪽에만 https를 적용하면 통신이 불가능합니다.
- 백엔드 쪽에도 https 인증서를 적용
  - Certificate Manager 에 접속해서 인증서를 생성
  - Elastic Load Balancer 서비스에서 [새 리스너 추가]를 이용해서 설정

## 3.Secret 적용
### 1)개요
- 민감한 정보를 별도의 yaml 파일에 만들어두고 컨테이너가 생성될 때 주입하는 기능

- configMap은 일반적인 설정을 저장해서 불러들입니다.

- 최근의 모던 애플리케이션을 개발하기 위한 방법론으로 The Twelve-Factor App이 자주 소개되는데 그 중의 하나가 애플리케이션 설정 정보는 환경 변수에 저장해서 사용하라는 것입니다.   
이렇게 설정 정보를 일반적으로 개발 환경, 스테이지 환경, 서비스 환경 등에서 취급하는 정보가 다르기 때문에 애플리케이션을 다시 빌드하는 일이 없도록 하기 위해서
- 빌드를 다시 할 필요 없이 재시작, 재배포만 하면 됨
- 쿠버네티스 상에서도 깃액션에서 환경변수 사용을 추천
- 데이터베이스 접속 계정이나 비밀번호, AWS의 접속 정보 등은 쿠버네티스의 secret에 저장하고 사용
- secret 작성 방법
```yaml
apiVersion: v1
kind: Secret
type: Opaque # 이름과 값의 형태로 시크릿을 생성하겠다는 설정
metadata:
  name: 시크릿이름
stringData:
  키: 값
  키: ${이름} # 이 경우는 yaml 파일을 실행할 때 이름=값의 형태로 주입
```
- 배포 파일에서 사용하고자 하는 경우
```
env:
  - name: 소스코드에서작성한이름
    valueFrom:
      secretKeyRef:
        key: 시크릿파일에서의 키
        name: 시크릿이름
```
### 2)secret 사용
- db_config_k8s.yaml 파일을 생성해서 저장
```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: db-config
stringData:
  db-username: "mywork"
  db-password: "12345678"
```
- 확인
```
kubectl get secret db-config -o jsonpath='{.data.db-password}'
```
- 파일에는 값을 설정하지 않고 `${DB-USERNAME}` 의 형태로 만들어 둔 경우에는 `DB-USERNAME="값" envsubst < 시크릿파일이름` 의 형태로 설정을 해줄 수 있음
- 시크릿은 base64로 인코딩되어 있는 경우 해독하고자 하면 해독이 가능
- 매니페스트 안의 비밀정보를 암호화해두고 클러스터 내부에서 복호화하여 시크릿으로 등록하는 구조를 사용하는 것을 권장(Git Ops)

### 3)ConfigMap 사용
- 야믈 파일 작성
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: 컨피그맵이름
data:
  키: 값
  키: ${이름}
```
- 사용
```
env:
  - name: 소스코드에서작성한이름
    valueFrom:
      configMapKeyRef:
        key: 맵에서의 키
        name: 컨피그맵이름
```
- 생성 및 확인
  - yaml 파일 생성(config_map_k8s.yaml)
```yaml {filename="config_map_k8s.yaml"}
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  db-username: mywork
  db-password: "12345678"
```
  - 파일 실행: `kubectl apply -f config_map_k8s.yaml`
  - 확인: `kubectl describe configmap app-config`

## 4.Deployment를 이용한 배포
### 1)배포를 위한 야믈 파일을 생성(deployment_backend_app_k8s.yaml)
```yaml {filename="deployment_backend_app_k8s.yaml"}
apiVersion: apps/v1

kind: Deployment

metadata:
  name: backend-app
  labels:
    app: backend-app

spec:
  replicas: 2
  
  selector:
    matchLabels:
      app: backend-app

  template:
    metadata:
      labels:
        app: backend-app
    spec:
      containers:
      - name: backend-container
        image: 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:2.0.0
        ports:
        - containerPort: 8080
```
### 2)야믈 파일 실행
```
kubectl apply -f deployment_backend_app_k8s.yaml
```
### 3)확인
```
kubectl get pods
```
### 4)시크릿 설정
- 소스 코드 수정: application.properties 수정
```
spring.application.name=backend

spring.datasource.url=jdbc:postgresql://adampostgresql.cesn3uejbkwe.ap-northeast-2.rds.amazonaws.com:5432/myworkdb
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
### 5)ECR에 이미지를 만들어서 배포
- 빌드: ./gradlew clean build
- 빌드 실행
  - 빌드를 하기 전에 Test를 하는데 Test 과정에서 데이터베이스 테스트를 하기 때문에 데이터베이스에 접속할 수 있어야 하고 Test를 통과하기 위한 데이터가 준비되어야 하므로 빌드 실패
  - 쿠버네티스가 컨테이너를 만들 때 주는 정보를 사용하기 위해서는 테스트 과정에서 데이터베이스 테스트를 하지 않거나 테스트를 위한 데이터베이스 접속 정보를 별도로 만들어야 합니다.
- 이미지 생성   
`docker build -t 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:3.0.0 .`

- 이미지 푸시   
`docker push 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:3.0.0`

- deploy를 위한 야믈 파일을 수정
```yaml
apiVersion: apps/v1

kind: Deployment

metadata:
  name: backend-app
  labels:
    app: backend-app

spec:
  replicas: 2
  
  selector:
    matchLabels:
      app: backend-app

  template:
    metadata:
      labels:
        app: backend-app
    spec:
      containers:
      - name: backend-container
        image: 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/k8s/backend-app:3.0.0
        ports:
        - containerPort: 8080
        env:
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              key: db-username
              name: db-config

        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              key: db-password
              name: db-config
```


## 5.VPC 내의 데이터베이스 사용
- 여러 클러스터 또는 여러 VPC에서 사용해야 하는 데이터베이스가 있다면 외부에 생성해서 접근을 하거나 VPC 내에 만들어서 외부로 공개하는 형태를 취해야 하지만 클러스터 내부에 있는 VPC 안에서만 접속한다면 VPC 안에 생성하고 외부로 노출하지 않고 사용을 해야 합니다.
- 이렇게 사용하고자 하는 경우에는 테스트를 위한 데이터베이스는 별도로 준비가 되어야 합니다.

## 6.생성한 리소스를 삭제
### 1)외부에 노출된 서비스를 삭제
- ELB(Elastic Load Balancer)는 외부와 연결된 서비스라서 Cluster를 삭제할 때 삭제할 수 없습니다.
- 이 작업을 수행하지 않으면 VPC가 제거되지 않습니다.
- 작업   
`kubectl get svc` 또는 `kubectl get all` 을 이용해서 External IP가 설정된 서비스를 확인하고 `kubectl delete svc 이름` 을 이용해서 삭제

### 2)도메인 관련된 내용 삭제
- Route53 에서 레코드 삭제
- CloudFront에서 배포 삭제

- S3 버킷 삭제

- Certificate Manager에서 인증서 삭제

### 3)클러스터 삭제
`kubectl config get-contexts`로 클러스터 이름 확인   
`eksctl delete cluster 클러스터이름`

## 7.CloudFormation 으로 구축한 리소스
### 1)base_resources_cfn.yaml: VPC를 생성하기 위한 CloudFormation 파일
- Parameters 부분은 변수 설정
- Resources 부분
  - VPC 생성 부분
```yaml
Resources:
  EksWorkVPC:
    Type: AWS::EC2::VPC
```
  - VPC 안에서 사용할 서브넷으로 현재는 3개인데 위에 subnet을 추가하면 더 배치가 가능(AZ는 한국의 경우 4개 밖에 없으므로 5개 이상을 생성하고자 하는 경우에는 AZ를 중복시켜야 함)  
```yaml
  WorkerSubnet1:
    Type: AWS::EC2::Subnet
```
  - 인터넷 게이트웨이 설정: 이 설정이 있어야 안에 만들어지는 노드들이 인터넷이 가능
```yaml
  InternetGateway:
    Type: AWS::EC2::InternetGateway
```