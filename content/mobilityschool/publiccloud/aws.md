---
title: AWS
weight: 1
---
## 1.AWS 개요
### 1)AWS
- Amazon에서 서비스하는 Cloud 컴퓨팅 서비스
- 시스템 운영에 필요한 서비스 일체를 제공
- 여러가지 다양한 서비스를 제공하고 이를 조합하는 것이 쉬움
- AWS 단독으로 사용되는 경우보다는 사내 LAN 과 연결해서 사용하는 경우가 많음
- 종량제 임대가 기본 원칙이지만 정액제 임대도 병행해서 선택 가능
- 사용이 쉬움
- 원화 결제 가능: 요금의 단가는 US 달러로 표시되지만 한국 원화로 결제 가능 - 서울에 한국 전담팀이 있으므로 예산 견적이나 시스템 도입에 대한 상담이 가능
- ISMS 인증을 취득해서 한국 보안 기준을 준수하고 있음
- 글로벌 확장이 쉬움
- 165가지 이상의 서비스를 제공
- 목적에 따라 다양한 서비스를 제공

### 2)대표적인 서비스
- EC2
  - 컴퓨터 용량을 제공하는 서비스
  - 성능은 가변적이며 일시 정지 중에는 언제든 성능을 높이거나 낮출 수 있음

- S3(Simple Storage Service)
  - 오브젝트 스토리지 서비스
  - 파일 서버 기능을 수행
  - 정적 웹 호스팅이 가능(Front End Application 배포 가능)
  - 파일 1개의 크기는 5TB까지 가능하고 용량 제한이 없음

- Amazon VPN
  - AWS 계정 전용의 가상 네트워크

- Amazon RDS
  - 데이터베이스 서비스

- Amazon Route 53
  - DNS 

- Elastic IP Address
  - 고정 IP 제공
  - EC2 와 같은 인스턴스에 제공할 수 있고 ELB(Load Balancer)에도 부여 가능

- Amazon Cloud9
  - 웹 브라우저로 조작이 가능한 통합 개발 도구
  - 다양한 언어를 지원

- Amazon Managed BlockChain
  - 데이터 위변조 유무를 확인하는 기능으로 많이 사용

- Amazon SageMaker
  - 머신러닝 도구

- Amazon GameLift
  - 게임 호스팅 서비스

- ECR, ECS, EKS: 컨테이너 서비스

### 3)Free Tier
- EC2 1대, RDS 1대, 5GB의 S3 를 12개월 동안 무료로 사용 가능
- SageMaker, API Gateway, S3, RDS, EC2, Quick Sight: 12개월 간 무료
- 계정 생성 후 12개월 후에도 무료
  - Cloud Watch, SQS, Lambda, Dynamo DB, SES

### 4)사용 방법
- 관리 콘솔(AWS 웹 사이트)을 이용한 Managed Service 사용
- 로컬에서 IAM 인증을 받아서 CLI 또는 Application Code로 사용

### 5)기본 개념
- Region
  - AWS의 모든 서비스가 위치하고 있는 물리적인 장소
  - Region 마다 제공하는 서비스나 요금이 다름
- Availability Zone(AZ - 가용 영역)
  - 데이터 센터와 유사한 개념
  - 하나의 Region 은 1개 이상의 AZ를 소유
  - 한국은 1개의 Region 안에 4개의 AZ를 소유

- Edge Location
  - AWS의 CDN(Content Delivery Network) 서비스인 CloudFront를 위한 Cache Server
  - 사용자가 요청을 했을 때 트래픽을 효율적으로 처리할 수 있는 지역에 POP(Point-of-Presence)을 구축하는 서비스 


### 6)IAM(AWS Identity and Access Management)
- AWS 권한을 관리하는 서비스
- AWS에 계정을 이메일로 생성하면 모든 서비스에 접근할 수 있는 SSO(Single SIgn ON) ID가 생성되고 root 권한을 소유
- 루트 권한을 이용해서 모든 작업을 수행하는 것은 보안 측면에서 올바르지 않음
- 사용자, 사용자 그룹, 권한, 정책, 자격 증명 공급자 형태로 분류해서 별도로 권한을 설정해서 사용하는 것을 권장
- MFA(Multi Factor Authentication)를 이용해서 관리 콘솔에 접속하도록 변경
- 정책 설정
  - 무엇에 대해서 어떤 조작을 허가할지 말지를 설정하는 것
  - 사용자가 어떤 일을 할 수 있는가 형태로 설정이 가능하고 조작 대상에 대해서 무엇을 허가하는 형태로도 설정이 가능한데 앞의 방식을 자격 기반 정책이라고 하고 뒤의 방법을 리소스 기반 정책이라고 합니다.
  - 어떠한 조작을 지정할 수 있는지는 서비스나 대상에 따라서 다르고 세밀하게 설정하는 것을 권장
  - 세밀하게 조정이 가능하지만 직접 작성하는 것은 쉽지 않기 때문에 대부분의 경우는 미리 준비되어 있는 AWS 관리 정책을 사용하는 것을 추천

- 주요 설정 항목
  Statement: 설정 값인데 Effect 나 대상을 기술

  Sid: 임의의 식별자

  Effect: 허가 여부를 결정(Allow | Deny)

  Action: 허가하거나 거부하는 작업

  NotAction: Action의 반대

  Resource: 작업 대상(ARN 값을 설정)

  NotResource: 작업 대상에서 제외할 대상

  Condition: 정책을 실행하는 타이밍 조건

예시


- ARN
  - AWS 서비스에서 리소스를 구분하기 위한 이름   
    arn:partition:service:region:account-id:resource-id

    partition은 리소스가 있는 파티션(aws, aws-cn 등)   
    service는 실제 서비스(s3, ecr…)   
    region   
    account-id는 실제 아이디가 아니고 aws에서 부여한 코드값   
    resource-id는 리소스 식별자

## 2. Network
### 1)IP
- 컴퓨터를 구분하기 위한 주소 체계
- Static IP & Dynamic IP
  - Static IP: IP 주소가 고정, Elastic IP 라고 서비스로 제공합니다.
  - Dynamic IP: IP 주소가 가변, EC2는 기본적으로 Dynamic IP
- Public IP 와 Private IP
  - Public IP: 외부에서 접근이 가능한 IP
  - Private IP: 내부에서만 접근이 가능한 IP

### 2)Domain
- 문자로 된 주소
- DNS는 Domain을 가지고 숫자로 구성된 IP 주소 변경하는 서비스
- FQDN(Fully Qualified Domain Name): 완전한 도메인 주소
- CNAME: 도메인을 다른 도메인으로 매핑하는 것으로 단축 URL을 만들기 위해서 사용

### 3)VPN(Virtual Private Network)
- VPN은 공중 네트워크를 통해 한 회사나 몇몇 단체가 내용을 외부에 노출시키지 않고 통신할 목적으로 사용하는 사설 통신망
- 사용자가 접속하고자 하는 사이트에 사용자의 IP 주소가 아닌 VPN 업체에서 제공하는 IP 주소를 이용해서 VPN 업체가 받은 결과를 다시 사용자에게 전달하는 방식

### 4)Amazon VPC
- Amazon Cloud 환경에서 구성하는 VPN
- 계정 전용 가상 네트워크 서비스
- EC2 나 RDS의 경우 VPC를 선택하지 않으면 서버를 생성할 수 없음
- 구성 요소
  - 가용 영역: 물리적인 장소로 VPC가 위치하는 영역
  - 인터넷 게이트웨이: 인터넷에 접속하기 위한 출입구
  - 라우팅: 트래픽을 어디로 전달할지 결정하는 것으로 여기서는 소프트웨어로 구현
  - 라우팅 테이블: 라우팅을 할 때 참조하는 테이블
  - 보안 그룹: AWS가 제공하는 가상의 방화벽으로 인스턴스로 단위로 설정하며 유입되는 데이터는 거부가 기본 설정
  - 네트워크 ACL: AWS가 제공하는 가상 방화벽으로 서브 네트워크 단위로 설정

### 5)CIDR 표기
- 프리픽스 표기법이라고도 하는데 /네트워크길이 형태로 나타내는 방식
- 서브네트워크 표기법으로 255.255.255.0 은 24가 됩니다.
- 하나의 컴퓨터: IP/32
- 전체 컴퓨터: 0.0.0.0/0

### 6)RDS 나 EC2 인스턴스를 생성하고 외부에서 접속이 안되는 경우
- 퍼블릭 IP 확인
- 포트를 보안 그룹에서 사용할 수 있도록 설정했는지 확인
- Internet Gateway를 확인해 볼 필요가 있는데 RDS를 생성할 때 인터넷게이트웨이 설정이 잘못되서 외부에서 접속을 못하는 경우가 있음

```
Object Storage
- 읽기를 주로 하는 File Server
- 속도는 빠름
- key value 를 사용해 저장, 공간 낭비될 확률이 높음
  - 대부분 운영체제는 worst fit을 사용, 재사용 가능 높기 때문

Block Storage
- 읽기, 쓰기 속도가 빠름
- 블럭 단위로 저장하면 다운로드 후 블럭 재조합이 필요 ->  운영체제는 큰 블럭으로 저장하지 않음 -> 다른 블럭 마이그레이션이 필요하기 떄문
  - inode를 생성: FAT32, FAT64 
  - 연속되지 않은 빈공간이 있어도 인덱스 이용해 연속인 것처럼 저장 가능 -> index로 찾아갈 수 있음
  - 포맷은 실제 블럭은 쓰기 가능으로 만들어 덮어씌움, inode를 삭제하기 때문에 이름은 복원 불가
```


## 3.EC2 서비스
### 1)개요
- 컴퓨터 용량을 제공하는 서비스
- Managed Service가 아니므로 서버 및 네트워크 운영은 AWS가 담당하지만 운영체제를 포함하여 필요한 소프트웨어는 사용자가 직접 설치하고 운영

### 2)클릭 한 번으로 최적의 서버 생성
- 관리 콘솔에서 클릭 만으로 생성할 수 있기 때문에 서버에 대한 기술적 지식은 그다지 필요하지 않음
- 기본적으로 외부에서 SSH를 이용해서 접속이 가능하도록 생성

### 3)주요 구성
- 인스턴스: 가상 서버
- AMI: 운영체제 이미지
- Key Pair: 외부에서 인스턴스에 접속할 때 인증을 위해 사용하는 키
- EBS: 스토리지
- 보안 그룹: 가상의 방화벽
- Elastic IP: 고정 IP

### 4)SSH 접속 후 가장 먼저 할일
- `sudo apt update`

### 5)apache 웹 서버 실행
- 패키지 설치: `sudo apt install apache2`

- 서비스 시작: `sudo service apache2 start`

- 확인: `ps aux | grep apache2`

- 외부에서 공인IP:80 포트로 접속 가능한지 확인(80은 생략 가능)


### 6)MySQL Server 생성 및 외부 접속
- mysql 이나 mariadb를 바로 설치하면 루트의 비밀번호가 없거나 계정이름이 됩니다.
  - 비밀번호가 없으면 외부에서는 접속할 수 없습니다.

- mysql 설치: `sudo apt install mysql-server`

- 외부 접속 허용
  - 3306 번 포트를 개방
  - 관리자 비밀번호를 설정
  ```
  use mysql;	

  alter user "root"@"localhost" identified with mysql_native_password by "wnddkd";

  flush privileges;
  ```
  - MySQL 은 기본적으로 외부 차단되어 있습니다.   
    /etc/mysql/mysql.conf.d/mysqld.cnf 파일에서 bind-address 에 자신의 IP 또는 0.0.0.0 을 설정해주어야 합니다.   
    service 재시작: `sudo service mysql restart`

  - mysql 과 maria db는 계정 단위로 접속할 수 있는 IP를 다르게 설정하는 것이 가능한데 root 의 비밀번호를 설정할 때 @’localhost’ 라고 설정했기 때문에 localhost에서만 접근 가능
  - root 계정의 설정을 변경하거나 새로운 계정을 생성해서 수행

  - MySQL에 접속해서 사용자 생성
  ```
  mysql -u root -p

  create database adam;

  create user 아이디@’%’ identified by ‘비밀번호’;

  grant all privileges on adam.* to ‘adam’@’%’;

  flush privileges;
  ```
  - ec2의 mysql에서는 '%'대신 dbeaver가 있는 컴퓨터의 publicIP 입력해 해당 컴퓨터에서만 접속 가능하게 설정도 가능
  - dbeaver에서는 ec2의 mysql에 설정한 ec2 publicIP와 아이디 비밀번호 db 입력해 연결

### 7)ubuntu24 버전의 EC2를 Mongo DB Server 만들기
- 설치: https://www.mongodb.com/ko-kr/docs/manual/tutorial/install-mongodb-on-ubuntu/

- 서비스 시작 및 확인
```
sudo systemctl status mongod

sudo systemctl start mongod

sudo systemctl enable mongod

sudo systemctl status mongod
```
- 로컬 접속: `mongosh`
- 외부 접속 허용
  - 설정 파일에 바인딩을 수정: `/etc/mongod.conf`파일의 bindIP를 0.0.0.0 으로 수정
  - `sudo systemctl restart mongod`
  - 보안 그룹에서 27017 번 포트를 개방
  - 다른 컴퓨터의 mongosh 이나 compass 에서 mongodb://IP:27017

### 8)Docker 설치
- ubuntu에서 도커 설치: https://docs.docker.com/engine/install/ubuntu/
- docker-compose 설치: `sudo apt install docker-compose`

### 9)Docker를 이용해서 jenkins 설치
- docker-compose.yaml 파일을 만들어서 jenkins 설정을 수행
```
version: "3"

services:
  jenkins:
    image: jenkins/jenkins:latest
    user: root
    volumes:
      - ./jenkins:/var/jenkins_home
    ports:
      - 8080:8080
```
- 실행   
  `sudo docker-compose up -d`

- 초기 비밀번호 확인   
  `sudo docker logs jenkins:lts`

- 이 경우 하드웨어 성능 이슈로 에러가 발생하는 경우 EC2 인스턴스를 중지시키고 인스턴스 유형을 변경
- 보안 그룹에서 8080 열어 주어야 합니다.
- UI에서 로그인: 고정IP:8080

### 10)snapshot
- 스냅샷은 관리 콘솔에서 볼륨(스토리지 전체) 단위로 선택해서 생성
- 생성한 스냅샷을 기반으로 EBS 볼륨을 생성하면 새로운 볼륨은 원래 볼륨의 복제
- 스냅샷의 데이터 보존 장소는 S3

### 11)EC2 와 많이 조합하는 AWS 서비스
- S3
- RDS
- Cloud Watch
- Route 53
- VPC

### 11)Elastic IP
- AWS가 제공하는 정적인 공인 IPv4 주소
- EC2 인스턴스를 생성하면 대부분 필수적으로 같이 생성
- 인스턴스에 부여되는 것이 아니고 계정에 부여되기 때문에 인스턴스가 삭제되도 IP는 소유
- Elastic IP 도 리전에 속함

## 4.Route 53
### 1)개요
- 도메인을 발급하고 관리해주는 서비스
- 활용 이유
  - 웹 애플리케이션의 경우 IP를 기반으로 통신하지 않고 도메인을 기반으로 통신
  - IP 주소에는 HTTPS 설정이 안됨
  - 도메인 구입은 Route 53이 아니더라도 상관없음
## 4. 배포
### 1) Route 53
- 도메인을 발급하고 관리해주는 서비스
- 활용 이유
  - 웹 애플리케이션의 경우 IP를 기반으로 통신하지 않고 도메인을 기반으로 통신
  - IP 주소에는 HTTPS 설정이 안됨
  - 도메인 구입은 Route 53이 아니더라도 상관없음

### 2)Elastic Load Balancer
- 개요
  - AWS가 제공하는 Load Balancer
  - Load Balancer는 집중되는 트래픽을 여러 대나 네트워크에 분배하는 장비
  - 한 대에 집중되는 부하를 분산시키기 때문에 부하 분산 장치라고도 합니다. 
- 종류
  - ALB   
    HTTP나 HTTPS에 사용   
    요청하는 명령어의 내용을 보고 판단하기 때문에 대상의 URL 디렉터리 단위로 분배하는 것이 가능
  - NLB   
    전송 계층에서 동작하는 Load Balancer   
    TCP 와 TLS를 지원   
  - CLB   
    오래된 유형의 Load Balancer   
  	지원 프로토콜: TCP, SSL/TLS, HTTP, HTTPS 등

- 에러가 발생하는 경우
  - 로드 밸런서에는 최대 접속 시간 제한이라는 설정이 있는데 기본값이 60초인데 로드 밸런서가 60초 동안 아무런 데이터도 전달받지 못하는 경우 연결을 자동으로 종료하고 타임아웃 에러를 발생시킴
  - 이로 인한 에러는 504 Error 인데 이 경우에는 접속 제한 시간을 늘리거나 애플리케이션을 수정