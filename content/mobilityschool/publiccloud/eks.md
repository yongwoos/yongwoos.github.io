---
title: VPC CloudFormatioon EKS
weight: 5
---
## 참고지식
### 두 대 이상의 컴퓨터가 통신하는 방법
- 인터넷
  - Gateway(밖으로 나가기 위해) 필요
  - DNS 필요
- 내부 통신
  - 동일한 네트워크 대역 필요
  - 하나의 장비(hub, switch)에 동일한 네트워크로 묶여야 함
- Docker Swarm, Kubernetes, Kafka ...
  - 인터넷 연결을 통해 묶는 것을 허용하지 않음
- Ansible, Open Stack
  - SSH를 이용하기 때문에 인터넷 허용

- VPC를 사용하면 내부 망을 쉽게 설정 가능
  - VPC를 사용하지 않으면 컴퓨터마다 IP 설정을 하고 Gateway IP 주소를 설정 등 직접 물리적 연결, 설정이 필요
- AWS는 VPC 안에서 요금을 받지 않음
- 로드밸런서를 VPC에 연결하게 되면 요금을 내야 함

### 자료구조의 종류
- Scala Data
- Set
- Collection
  - List: 인덱스 - 행의 집합, 데이터 구분을 인덱스로 수행
  - Map(dict): key - 열의 집합

### 데이터를 쌓을 때 큐가 중요한 이유
- Kafka - AirBnb(예약)
  - 예약은 병렬처리 불가, 순차 처리 필요

- 카프카 사용시 느슨한 결합 가능
  - 다양한 소스로부터 데이터가 생성
  - App1, App2를 직접 Datalake로 연결하면 조금만 수정이 생겨도 설정 변경해야 함, 어느 하나의 변화가 영향을 줌

### 웹 서버가 req없이 response하는 방법
- SSE(Server Side Events) -> kafka, rabbitmq
  - 앱으로 웹서버가 req없이 response 하기는 힘듬
- APNS, GCM(FCM) 이용
  - Web Server가 구글, 애플 서버로 알림을 보내면 그 서버가 스마트폰으로 push

### Gateway
- EC2의 퍼블릭IP는 게이트웨이가 있단 것을 의미
- 무조건 통신 위해 게이트웨이 필요
- L2스위치: 맥 주소 1개 기억
- L3스위치: IP주소 기억 가능
- 공유기는 L3 스위치 기능 가지고 있음, 게이트웨이로도 작동
- 라우터가 게이트웨이

### 이름과 ID
- 이름이 ID 역할을 수행하는 것
  - EC2, RDS, S3, ECS Cluster
- ID가 이름의 역할을 수행하지 않음
  - VPC: ID를 다시 부여

## VPC(Virtual Private Cloud)
### 1)VPC 개요
- AWS에서 제공하는 가상의 네트워크
- 사용자의 상황에 맞게 여러 가지 형태의 네트워크를 구성할 수 있음
- VPC는 인터넷과 네트워크를 잘 이해하는 전문가를 위한 서비스
- 프리티어 계정에서는 무료이지만 VPN을 연결하면 요금을 지불
- AWS에 가입하면 VPC 1개가 제공   
  일반적으로 EC2 인스턴스나 RDS 또는 ElastiCache 등을 생성할 때 이 VPC 안에 생성
- VPC 안에서 서브넷을 여러개 추가할 수 있기 때문에 네트워크를 격리할 수 있고 서브넷 안에 ACL을 설정할 수 있음   
  인터넷에 접근해야 하는 웹 서버는 공개 서브넷에 만들고 외부에서 접근할 필요가 없는 데이터베이스 서버는 사설 서브넷에 만드는 식으로 구성
- VPN을 이용해서 외부 네트워크와 연결 가능하고 다른 AWS 계정의 VPC와도 연결 가능
- IP주소 할당 방법은 CIDR(Classless Inter-Domain Routing) 표기 사용   
  네트워크주소/서브넷마스크의비트수

### 2)VPC 생성
- 생성 방법
  - 관리 콘솔에서 생성
  - yaml 파일을 만들어서 aws-cli 이용
  - 스위치를 생성헀다고 생각하면 됨
  - 서브넷은 VLAN으로 생각하면 됨
- VPC를 생성하면 이후에 EC2나 RDS를 생성할 때 VPC를 선택해서 생성하는 것이 가능
- VPC 안에 Subnet을 생성해서 네트워크를 격리하는 것도 가능
- VPC 안의 컴퓨터에 인터넷 접속을 허용하고자 하는 경우는 Internet Gateway를 추가해주면 됩니다

### 3)추가 기능
- Route Tables
- DHCP Options Sets
- Elastic IPs
- Peering Connections: VPC 와 VPC를 연결하는 기능
- Network ACLs: 방화벽
- VPN Connections

### 4)사용하는 경우
- Kubernetes나 Docker Swarm 또는 Ansible 등을 이용하는 경우 이용

## CloudFormation
### 1)개요
- 미리 만든 템플릿을 이용해서 AWS 리소스를 생성하고 배포하는 것을 자동화 해주는 서비스
- Ansible의 역할과 유사한 서비스
- 서비스에 필요한 EC2 인스턴스, EBS 볼륨, S3 버킷, RDS 인스턴스를 미리 구성한대로 자동 생성
- 지원하는 리소스
  - Auto Scaling
  - RDS
  - CloudFront: CDN
  - Redshift: RedHat 의 PaaS를 구축하기 위한 소프트웨어
  - CloudWatch: AWS의 Monitoring 서비스
  - EC2
  - S3
  - DynamoDB
  - SimpleDB
  - ElastiCache
  - Route53
  - SNS(Simple Notification Service): 푸시
  - IAM
  - Elastic Beanstalk: 애플리케이션 배포를 쉽게해주는 서비스
  - Elastic Load Balancing
  - SQS(Simple Queue Service): 메시지 큐
- 템플릿 파일은 JSON 형식의 텍스트 파일: YAML이 가능
  - .txt: 실행 불가
  - .csv: 데이터를 행으로 구분, Key가 없는게 문제
  - json: 데이터와 설정용으로 사용 가능
  - yaml: 설정용으로만 사용 가능
- 직접 작성해도 되고 AWS에서 제공하는 템플릿을 이용하는 것도 가능
- 실제 동작은 Chef와 Puppet을 이용함   
  Chef와 Puppet은 Ansible과 동일한 용도로 사용함
- CloudFormation 템플릿으로 생성한 AWS 리소스 조합을 CloudFormation Stack이라고 함

### 2)작업 흐름
- 아키텍쳐 설계
- 템플릿 작성
- AWS 관리 콘솔이나 AWS CLI로 CloudFormation 스택 생성

### 3)템플릿 기본 구조
- Description
- Parameters
- Resources
- Outputs
- AWSTEmplateFormatVersion

### 4)ec2 생성하는 템플릿
```
{
	“Description”: “설명”,
	“Parameters”:{
		“KeyPair”:{
			“Description”:”설명”
			“Type”: “String”
			“Default”:”키페어이름”
            }
        },
“Resources” : {
	“EC2Instance”: {
		“Type”: “AWS::EC2::Instance”,
		“Properties”:{
			“KeyName”: {“Ref”, “KeyPair”},
			“ImageId”: “ami-?”,
			“InstanceType”:”t1.micro”,
            }
        }
    }
}
```
### 5)스택을 생성하는 방법
- 템플릿 파일을 직접 만들어서 적용
- 제공되는 샘플 템플릿을 이용
- GUI 환경에서 생성

## 3.EKS 개요 및 환경 구축
### 1)개요
- Amazon EKS(Elastic Kubernetes Service)는 Kubernetes를 제어하는 Control Plain을 제공하는 관리형 서비스
- 2017년에 발표되었고 일본에서는 2018년 12월 서울 리전에는 2019년 1월에 출시

### 2)특징
- VPC와 통합
  - Kubernetes Cluster에서는 Pod Network로 Public Network 와 다른 자체 네트워크 체계를 배치하기 때문에 클러스터 외부에서 Pod에 명시적으로 End Point를 설정하지 않으면 통신이 불가능
  - EKS에서는 Amazon VPC 통합 네트워크를 지원하고 있어서 Pod에서 VPC 내부 주소 대역을 사용할 수 있고 클러스터 외부 와의 통신을 Seamless(서비스 접근을 단순하게 또는 복잡한 기술이나 기능을 설명하지 않아도 구현 가능)하게 구현 가능
- IAM을 통한 인증과 인가
  - Kubernetes 클러스터는 kubectl이라는 명령 도구를 사용하여 조작하는데 해당 조작이 허가된 사용자에 의한 것임을 올바르게 인증을 해야만 조작이 가능
- ELB와 연계
  - 클러스터 외부에서 접속할 때 서비스를 사용해 End Point를 생성해야 하는데 이 때 가장 많이 사용되는 End Point가 Load Balancer
  - EKS에서는 Kubernetes의 서비스 타입 중 하나인 Load Balancer를 설정하면 자동으로 Load Balancer 서비스인 ELB가 생성되는데 이것으로 HTTPS나 경로 기반 라우팅 등의 L7 Load Balancer 기능을 AWS 서비스로 구현할 수 있음
- 데이터 플레인 선택
  - 초창기에는 EKS 와는 별도로 EC2를 관리해야 했는데 지금은 데이터 플레인 관리를 도와주는 기능이 제공

### 3)구축 도구
- EKS 클러스터를 구축하는 방법
  - EKS 클러스터 도구인 eksctl을 이용
  - AWS 관리 콘솔 또는 AWS CLI를 이용

- eksctl
  - EKS 클러스터 구축 및 관리를 하기 위한 오픈소스 명령 도구
  - 기본 구성이라면 eksctl create cluster 명령만으로 클러스터 구축 가능
  - 다양한 옵션을 제공하므로 유연하게 구성을 변경할 수 있음
  - eksctl을 사용하면 VPC, Subnet, 보안 그룹 등 EKS 클러스터를 구축하는데 필요한 리소스를 한 번에 구성할 수 있음
  - 오픈 소스 프로젝트
  - EKS 클러스터는 정지를 해도 과금이 되는데 이를 막으려면 클러스터를 삭제할 때 VPC 도 같이 삭제해야 합니다.
  - eksctl로 클러스터 와 VPC를 구축하면 EKS 클러스터를 삭제하면 같이 삭제됨
  - eksctl로 접속한 PC가 Control Plane이 되며 워커노드와 가상으로 묶임

- AWS 관리 콘솔
  - AWS 서비스를 관리하기 위한 웹 사용자 인터페이스

- AWS CLI
  - AWS가 제공하는 명령줄 도구
  - 파이썬으로 제작된 도구

### 4)도구 설치
- AWS CLI
  - 다운로드: https://aws.amazon.com/ko/cli/
  - 확인: `aws --version`
  - 사용을 하기 위해서는 aws configure 명령을 수행해서 access-key 와 secret access-key를 등록해주어야 합니다.
- eksctl
  - windows: https://github.com/eksctl-io/eksctl/releases
  - mac: brew install weaveworks/tsp/eksctl
  - 확인: `eksctl version`
- kubectl
  - https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/install-kubectl.html
  - 확인: `kubectl version --client`

### 사용자 및 키 생성
- IAM > 사용자 생성 > 정책 전부 선택 > 액세스 키 만들기 > CLI 선택 > 생성 > 키 다운로드
- CLI에서 `aws configure` 명령으로 키 입력

### 5)기본 리소스 구축
- VPC 구축
- 쿠버네티스는 워커 노드들을 하나의 클러스터로 묶기 위해서 가상의 네트워크를 만들어서 IP를 할당해서 내부 통신을 수행
- 쿠버네티스 클러스터를 구성할려면 Matster Node 와 Worker Node 가 하나의 네트워크로 묶어야 함
- AWS의 EKS에서는 하나의 VPC를 이용해야 함
- Cloud Formation 을 생성
  - CloudFormation 페이지로 이동
  - 스택 생성을 클릭
  - [기존 템플릿 선택]을 선택하고 [템플릿 파일 업로드]를 선택하고 [base_resouce_cfn.yaml] 파일을 선택
  - Stack 이름만 설정하고 나머지 옵션은 기본으로 해서 전송을 누르면 길게는 10분 정도 후면 스택이 생성됨
- VPC 항목에서 VPC가 생성되었는지 확인
- 생성된 VPC 안에 EKS 클러스터 구축
  - CloudFormation에서 만들어진 스택을 선택하고 [출력] 항목에서 WorkerSubnets 값을 복사
    - 네트워크 대역을 가져와야 노드를 늘릴 수 있기 때문
  - 로컬 컴퓨터에서 작성
    ```
    eksctl create cluster \
    --vpc-public-subnets <복사한값> \
    --name 클러스터이름 \
    --region 리전이름 \
    --version EKS클러스터버전 \
    --nodegroup-name 노드 그룹 이름 \
    --node-type 워커 노드 인스턴스 타입 \
    --nodes 워커 노드의 개수 \
    --nodes-min 워커 노드의 최소개수 \
    --nodes-max 워커노드의 최대 개수

    eksctl create cluster --vpc-public-subnets WorkerSubnets값 --name eks-cluster --region ap-northeast-2 --version 1.31 --nodegroup-name eks-work-nodegroup --node-type t2.small --nodes 2 --nodes-min 2 --nodes-max 5
    ```
  - Permission Denied 에러가 발생한 경우   
    IAM에서 사용자에게 권한을 추가한 후 access-key 와 secret access-key 다시 등록

- Cluster 구축 확인
  - 로컬 컴퓨터에서 `kubectl get nodes`   
    설정한 만큼의 노드가 보이는지 확인
  - AWS 관리 콘솔에서 EC2 페이지에서 노드의 개수만큼 인스턴스가 추가되었는지 확인
  - CloudFormation에서 2개의 스택이 추가되었는지 확인

- kubeconfig 설정
  - eksctl은 EKS 클러스터 구축 중에 kubeconfig(~/.kube/config) 파일을 자동으로 업데이트
  - kubeconfig 파일은 쿠버네티스 클라이언트인 kubectl이 이용할 설정 파일로 접속 대상 쿠버네티스 클러스터의 접속 정보를 저장하고 있음
  - kubeconfig 파일의 구성   
    clusters: 쿠버네티스 클러스터의 정보

    users: 클러스터에 접근할 유저의 정보

    context: cluster 와 user를 조합해서 생성된 값

    current-context

  - context 조회: `kubectl config get-contexts`   
    앞에 *이 추가된 클러스터가 현재 사용 중인 클러스터
  - context 변경: kubectl config use-context 컨텍스트이름

- Pod 배포
  - pod를 위한 야믈 파일 작성: pod.yaml
```yaml {filename="pod.yaml"}
apiVersion: v1

kind: Pod

metadata:
  name: node-server-pod
  labels:
    app: node-server

spec:
  containers:
  - name: node-server-container
    image: 905418305225.dkr.ecr.ap-northeast-2.amazonaws.com/djangoecs:3e94a686ed472eaf480698586a360d911305fe7e
    ports:
    - containerPort: 80
```
  - 야믈 파일 실행: `kubectl apply -f pod.yaml`

  - pod 만 확인: `kubectl get pods`

  - 모든 리소스 확인: `kubectl get all`
- Port Forwarding을 수행해서 접속 여부 확인
```bash
kubectl port-forward 파드이름 외부포트:내부포트

kubectl port-forward nginx-pod 9000:80
```
- 브라우저에서 localhost:9000로 접속해서 80 번 포트가 개방되었는지 확인
- Load Balancer를 부착해서 외부에서 접속 가능하도록 작업(직접 생성한 쿠버네티스 클러스터라면 Load Balancer를 만들고 Service 를 만들어서 부착을 해야 하지만 EKS에서는 Service 만 만들면 ELB를 생성해 줍니다.)
```yaml {filename="service.yaml"}
apiVersion: v1
kind: Service
metadata:
  name: node-service
spec:
  type: LoadBalancer
  selector:
    app: node-server
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```
  - 생성한 야믈 파일 실행: `kubectl apply -f service.yaml`
  - `kubectl get svc` 나 `kubectl get all` 을 이용해서 나온 External IP를 이용해서 외부에서 접속이 가능한지 확인

### 6)실습
- CloudFormation에서 템플릿 파일을 이용해서 VPC를 생성(Stack 생성)
- 로컬에서 eksctl 명령을 이용해서 위에 만든 VPC에 Kubernetes 클러스터를 생성
- 생성된 클러스터에 파드(Replica나 Deployment, StatefulSet, DaemonSet)를 배포(Docker Hub에 있는 이미지 이용)
- LoadBalancer를 이용해서 외부에서 접속이 가능하도록 설정

### 7)EKS 작업 내역 삭제
- Load Balancer는 직접 삭제
  - `kubectl get svc --all-namespace` 를 이용해서 External IP 가 설정된 서비스를 조회   
    `kubectl delete svc 서비스이름` 을 이용해서 서비스를 삭제하면 Elastic Load Balancer가 자동으로 삭제됨   
    `eksctl delete cluster 클러스터이름` 을 이용해서 cluster를 삭제하면 이 경우에는 VPC, EC2 인스턴스가 모두 삭제

## 4.데이터베이스 환경 구축
### 1)내부에서만 사용할 데이터베이스를 구축
- VPC 내부에 EC2 인스턴스를 배치하고 데이터베이스를 설치해서 사용
- VPC 내부에 RDS 인스턴스를 배치하고 사용

### Cloud Formation에서 RDS 생성
- VPC 이름이 중요
- Route Table: RDS는 별도의 서브넷 사용하기 때문에 라우팅 테이블 적어줘야 함

### 2)CloudFormation을 이용해서 수행하는 것이 가능
- 이렇게 만들면 클러스터를 삭제할 때 RDS가 같이 삭제
```
anomaly 삭제 이상: 여러번 삭제를 해야 함
무결성 깨짐: A DB에서 데이터 회원 1 삭제 시 B DB는 데이터 삭제가 안됨
=>외래키 사용

kubeadm 사용하지 않는 이유: 고아 워커 노드 발생 가능
eksctl을 이용하면 한꺼번에 삭제 가능, DB도 마찬가지로 eksctl로 만든 vpc안에 생성 시 한꺼번에 삭제 가능
```

### 3)CloudFormation을 이용해서 VPC 내에 접속할 수 있는 데이터베이스(PostgreSQL) 생성
- 파일은 rds-ops-cfn.yaml 파일을 선택
- 파라미터에서 EksWorkVPC 항목을 클릭해서 이전에 만든 VPC를 선택
- OpeServerRouteTable은 이전에 만든 스택의 정보를 가져와야 합니다.   
  이전에 만든 eks-work-base 스택을 클릭한 후 출력  탭을 눌러서 Route Table의 값을 가져와서 사용
- AWS CloudFormation에서 사용자 지정 이름으로 IAM 리소스를 생성할 수 있음을 승인합니다 란을 체크해서 사용자 정보를 생성하도록 설정