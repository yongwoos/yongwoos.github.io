---
title: Helm & Jenknins
weight: 11
---
- 쿠버네티스를 이용해서 애플리케이션을 배포하다보면 pod(Pod, ReplicaSet, Deployment, DaemonSet, StatefulSet 등)을 만들기 위한 작업을 수행하고 외부로 노출시키기 위해서 Service(ClusterIP, NodePort, LoadBalancer, Ingress Controller, External IP 등) 와 데이터를 저장하기 위한 Volume 작업 등을 수행해야 함
- 쿠버네티스 만을 이용하게 되면 여러 개의 작업을 별개로 수행해야 하기 때문에 업데이트를 할 때 오류가 발생하거나 일부분이 업데이트 되지 않는 일이 발생할 수 있음
- 이러한 작업들을 하나의 패키지로 묶어서 한 번에 수행하기 위한 도구가 Helm

### Helm 설치
- 설치 가이드: https://helm.sh/ko/docs/intro/install/

- 설치 확인: helm version

### 애플리케이션 설치
-  https://kiamol.net & vweb, https://charts.bitnami.com/bitnami & nginx

- 레포지토리 추가
```
helm repo add 이름 URL
삭제: helo repo remove 이름
리스트: helm repo list
```
- 레포지토리의 캐시를 업데이트
```
helm repo update
```
- 애플리케이션 검색 및 설치
```
애플리케이션 검색: helm search repo 애플리케이션이름
helm search repo vweb
helm search repo nginx

애플리케이션 다운로드: helm pull 애플리케이션이름
helm pull bitnami/nginx
```
- 구조를 알아보기 위해서 압축 해제
```
tar xvfz nginx-18.2.4.tgz

환경 변수 확인: helm show values 이름
```
- 설치: helm install --set 환경변수=값… 레이블 애플리케이션이름
```
로컬의 nginx를 설치
cd nginx
helm install nginx -f values.yaml .

helm ls

kubectl get pods

원격 서버의 kiamol/vweb을 설치
helm install --set servicePort=8010 --set replicaCount=2 vweb kiamol/vweb --version 1.0.0

helm ls

kubectl get pods
```

### 패키징
- helm create 차트이름
```
helm create samplechart
```
- 명령을 수행하면 Chart.yaml, Values.yaml, charts 와 template 디렉토리가 생성되고 기본 코드를 작성해 줍니다.

### 레지스트리를 만들어서 업로드
- 레지스트리를 만드는 방법
  - Cloud 의 File Storage 이용(AWS의 S3 등)
  - Harbor를 이용해서 구축
  - git hub 같은 버전 관리 사이트를 이용
  - 직접 웹 서버를 구축(S3는 Front End Server의 기능을 하는 것이 가능) 

### Github Page로 Helm 패키지 저장 및 다운로드
- git hub 레포지토리 와 배포할 데이터를 가진 디렉토리를 동기화
  - it hub 레포지토리 와 배포할 데이터를 가진 디렉토리를 동기화
  - github 레포지토리를 생성(README.md 파일을 소유한 상태)
  - 로컬에서 clone: git clone https://github.com/itggangpae/webping.git 
  - 브랜치 변경: git checkout -b release
  - README.md를 수정: nano README.md

- git hub 레포지토리를 웹 사이트로 변경
github 레포지토리에서 [Settings] - [Pages]를 선택한 후 branch 부분에서 원하는 브랜치를 선택하고 save를 클릭
확인: https://{username}.github.io/{repositoryname}/

- 배포할 디렉토리 복사
  - cp -r /home/ubuntu/kiamol/ch10/web-ping /home/ubuntu/webping

- 압축 파일을 생성
```
helm package 디렉토리/
```
- index.yaml 파일 생성
```
helm repo index .
```
- 구조 확인
```
README.md
web-ping
	Chart.yaml
	Values.yaml
	templates 디렉토리
index.yaml
web-ping-0.1.0.tgz 
```
- 푸시 수행
```
git add .
git commit -m "chart init"
git push
```
- 레포지토리 등록
```
helm repo add {REPO_NAME} https://{USER_NAME}.github.io/{REPO_NAME}/
```

- 설치
```
helm install webping webping/web-ping
```

## 지속적 통합/배포
### 애자일 개발 모델
- 개발 팀에 속한 모든 팀원이 동시에 같은 요구 사항에 대해서 작업하는 방식
- RAD(Rapid Application Development - 신속 애플리케이션 개발) 같은 모델에서는 각자가 다른 업무를 수행하는데 기획자가 작성한 요구 사항을 개발자가 구현하고 개발자가 완료한 작업은 테스터가 수행하는 형태
=>애자일 모델에서는 애플리케이션의 요구 사항을 우선순위에 따라 분류하고 분류된 요구 사항 별로 개발을 진행   
분류한 일정량의 작업을 분석하고 구현하는데 할당된 작업 기간을 Spring 라고 합니다.   
애자일에서 애플리케이션은 Sprint를 반복하면 완성됩니다.   
기간은 보통 1주에서 3주로 짧은 기간 안에 많은 기능을 구현   
동일한 프로젝트에서 작업하는 개발자들이 각자 자신이 맡은 기능을 구현하고 구현과정에서 변경한 코드를 한꺼번에 Main Branch에 Commit   
Git Hub에서는 main branch 라고 하고 Git Lab에서는 master branch 라고 합니다.   
이러한 개발 방식에서는 회귀 결함(이전에 제대로 작동하던 기능에 문제가 발생) 이나 코드 충돌 같은 문제를 발생시킬 수 있음

- 애자일 도입 초창기에는 하루에 한 번만 통합하거나 스프린트가 끝날 때 한꺼번에 통합을 했는데 최근에는 지속적 통합 방식을 이용하는 형태로 변경되었는데 지속적 통합에서는 개발자가 작업을 완료하는 즉시 메인 브랜치에 통합을 하는데 이렇게 하면 개발자는 코드 충돌 문제를 좀 더 빠르게 발견할 수 있고 회귀 결함이 발생해도 더 효율적으로 해결할 수 있음

### 개발 워크플로
- 로컬에서 단위 테스트 실행   
  - 개발자는 중앙 레포지토리에서 최신 코드를 로컬로 가져 온 후 요구 사항을 구현
  - 요구 사항을 구현할 때는 TDD(Test-Driven Development: 테스트 주도 개발) 방식을 많이 사용하며 구현된 코드는 단위 테스트를 모두 통과할 때 까지 반복적으로 수정
  - 테스트 주도 개발은 코드를 구현하기 전에 테스트 케이스를 먼저 작성하는 개발방식으로 처음에는 테스트 케이스만 작성되어 있고 구현부는 없기 때문에 테스트를 실행하면 모두 실패로 나오지만 구현부 코드를 작성해 나가면 점점 성공률이 올라가는 형식의 개발 방식

- 중앙 레포지토리로 코드 푸시 및 병합
  - 기능 구현을 완료한 후 중앙 레포지토리에 코드를 push 하면 메인 브랜치에 merge
  - 코드 충돌이 발생할 수 있음

- 병합 후 컴파일
  - 새로 병합된 코드로 인해 기존에 없던 컴파일 에러가 발생할 수 있음

- 컴파일된 코드에서 테스트  실행
  - 단위 테스트 와 통합 테스트를 실행해서 회귀 결함이 있는지 확인   
  - 정적 분석(코딩 표준 준수 및 불필요한 코드의 존재 여부) 같은 작업이 추가되기도 함

- 아티팩트 배포
  - 단계별 품질 점검이 끝나면 모든 코드를 패키징하고 최종 사용자가 사용할 수 있도록 배포   
  - 자바의 경우 아티팩트는 jar 이나 war   

### 지속적 제공/지속적 배포
- 지속적 통합에서는 애플리케이션 코드가 변경될 때 마다 개발 환경에서 테스트가 수행되며 빌드 결과가 공개됨
- 정기 빌드 외에 일상적인 코드 변경도 개발 환경에서 테스트 와 확인 과정을 거치는 것이 중요
- 개발 환경에서는 잘 동작하던 애플리케이션이 프로덕션 환경에서 문제를 일으키는 경우가 있는데 이런 문제는 새로 변경한 항목이 기존 프로덕션 환경의 소프트웨어 나 하드웨어 와 호환되지 않아서 발생
- 프로덕션에 자주 배포되지 않는 환경은 이 문제를 디버깅하고 해결하는 것이 어려움

### CI/CD 워크 플로 과정 - 사칙 연산을 수행하는 계산기를 만들고자 하는 경우에 덧셈을 추가 구현하는 경우

- 중앙 레포지토리에서 코드를 가져오기

- 단위 테스트 구현
```
{
 	Result = Addtion(10, 20);
	Assert.assertEquals(Result, 30, “Addtion Function Dose Not Work”);

} 
```
  - 실행하면 에러 : Addtion이 구현 안됨

- 코드 구현
```
Addtion(a, b){
	Result = a +  b
	return Result;
}
```
- 단위 테스트 다시 수행: 통과

- 코드 푸시 와 병합

- 컴파일을 다시 수행

- 병합된 코드에서 테스트 실행

- 아티팩트 배포

- 배포 애플리케이션의 E-E(End to End: 실제 사용 환경에서 테스트) 테스트 수행

## Jenkins
### 개요
- 실제 CI/CD 환경에서는 작은 변경 사항을 자주 지속적으로 통합하고 테스트하며 빌드 결과를 즉시 통보받는데 이런 프로세스를 수작업으로 관리하려면 담당자가 있어야 하고 번거로우며 오류도 발생하기 쉬움
- 애자일 방법론에서는 변경된 코드가 반영됨 과 동시에 실행 가능한 제품을 출시되어야 한다고 하는데 개발 팀은 새로 추가한 기능이 동작하는데서 만족하는 것이 아니고 추가된 기능이 제품에 반영돼 부가가치를 일으키는 것에 대해서 알 수 있게 됩니다.
- CI/CD 프로세스는 애자일 방법론 과 철학적 가치가 유사하기 때문에 잘 어울림
- CI/CD 프로세스는 Git 이나 SubVersion 같은 소스 관리 시스템에서 최신 코드를 가져오는 것으로 시작하며 필요한 경우 컴파일러를 실행해서 코드를 컴파일하고 상황에 따라 단위 테스트 도구를 실행해서 단위 테스트를 수행   
이 작업은 다양한 종류의 도구들을 사용해야 하고 여러 번 실행되는 워크플로는 개발자, 테스터, 운영자 모두에게 부담이 되는 작업
- 젠킨스는 다양한 플랫폼에서 애플리케이션 빌드가 가능하고 넥서스 같은 아티팩트 레포지토리에 산출물을 발행하고 pull request 통합 절차도 자동화가 가능
- 일반적인 테스트 도구들은 고품질의 빌드를 생성하는 충분하지 않기 때문에 테스트 도구들을 잘 조합할 수 있도록 해주는 도구 중의 하나가 젠킨스
- 젠킨스는 애플리케이션을 구축하는 팀에 불필요한 부담을 주지 않으면 다양한 도구 와 상호 작용하며 주기적으로 애플리케이션의 시작부터 끝까지 워크플로를 실행하는 도구
### Jenkins
  - 소프트웨어 개발 프로세스의 다양한 단계를 자동화하는 도구
  - 중앙 소스 코드 레포지토리에서 최신 코드 가져오기, 소스 코드 컴파일, 단위 테스트 실행, 산출물을 다양한 유형으로 패키징하고 산출물을 여러 종류의 환경으로 배포하는 기능을 제공
  - 오픈 소스 라이센스 소프트웨어
  - Apache Tomcat 이나 Servlet Container 내부에서 실행되는 서버 시스템
  - 자바로 작성
- 젠킨스를 이용한 CI/CD 구현
  - CI/CD 프로세스는 애플리케이션 코드에 변경이 발생하면 그 변경 사항이 실행 파일이나 라이브러리 형태로 프로덕션 환경에 배포될 때 까지 E-E 빌드 수명 주기 단계에서 검증을 하는 프로세스   
  개발자가 변경한 코드가 소비자에게 사람의 개입없이 바로 반영되도록 하는 프로세스
  - CI/CD는 여러 개의 하위 수명 주기 단계로 구성되는데 사전에 구성된 순서에 따라 필요한 모든 하위 단계를 거치면서 단순한 소스 코드가 최종적으로는 실행 가능한 애플리케이션으로 변환되는 것
  - 젠킨스 자동화 서버는 도메인 특화 언어(Domain Specific Language)로 이러한 빌드 수명 주기 단계를 구축
  - 애플리케이션은 다양한 빌드 단계를 거치면서 빌드 도구, 정적 분석 도구, 여러 종류의 소스 코드 관리 도구 등 다양한 도구를 사용
  - 젠킨스는 방대한 규모의 플러그인을 제공하기 때문에 거의 대다수의 애플리케이션에 대해 E-E 빌드 수명 주기 단계를 구현하는 것이 가능
  - 젠킨스에서는 파이프라인이라고 부르는 스크립트를 작성할 수 있는데 이를 사용해서 각 빌드 단계마다 젠킨스가 수행할 태스크 및 하위 태스크의 순서를 정의
  - 빌드 단계는 이전 단계의 결과 다른 단계의 입력으로 주어지는 방식으로 순차적으로 이루어집니다.
  - 순차적이고 종속적인 단계가 시작부터 끝까지 실행되면 최종적으로 사용가 실행할 수 있는 빌드가 생성
  - 빌드 프로세스를 진행하는 도중에 특정 단계에서 실패하면 이 단계의 출력 결과를 사용하는 다음 단계는 실행되지 않으며 빌드 프로세스 전체가 실패
  - 소스 코드 관리 같은 소스 관리 시스템에서 최신 코드를 가져와서 컴파일을 하는 중에 실패가 발생하면 단위 테스트를 수행하지 않음 
- 젠킨스의 아키텍쳐
  - 프로세스   
    다수의 개발자가 각자의 브랜치에서 변경 작업을 한 후 이를 중앙 레포지토리로 푸시를 하고 코드 리뷰가 끝나면 이를 다른 브랜치(개발 브랜치)에 병합
    
    브랜치의 변경 사항이 젠킨스에 통보

    젠킨스가 통보를 수신하면 작업을 시작
  - 젠킨스의 작업   
    소스 코드 관리 시스템에 맞는 플러그 인을 이용해서 소스 코드를 가져오는 것
    
    빌드 도구 와 관련 젠킨스 플러그인을 이용해서 변경된 파일을 컴파일하고 빌드를 수행
    
    빌드 도구를 재사용해서 컴파일된 코드의 단위/통합 테스트를 수행
    
    정적 분석 도구를 실행해서 표준을 준수하는지 여부 나 데드 코드가 있는지를 확인하는 대표적인 애플리케이션이 SonarQube
    
    jar 나 war 같은 라이브러리 형태로 번들링

    테스트/프로덕션 환경으로 배포

    E-E 테스트 자동화 도구를 사용해서 테스트를 수행

    작업 결과를 팀원들에게 전송

### CD도구
- 도커 생태계
  - 컨테이너 관련 기술
  - 도커 레지스트리: 도커 허브나 직접 구축한 레지스트리
  - 쿠버네티스: 컨테이너 오케스트레이터
- 젠킨스
- Ansible
  - 소프트웨어 프로비저닝과 구성 관리, 애플리케이션 배포를 자동화하는 도구
  - 가장 빠르게 성장하는 구성 관리 엔진
  - 에이전트가 없는 구조이며 도커와도 쉽게 연동
- Git Hub
- Java/Spring Boot/Gradle
- 그 이외 도구
  - 인수 테스트용 프레임워크: Cucumber, FitNesse, JBehave 등
  - DB Migration 프레임워크: Flyway, Liquibase 등

### Jenkins 설치
- 운영체제에 직접 설치: Windows, Mac, Linux 모두 가능
  - JRE를 설치
  ```
  sudo apt install openjdk-17-jdk
  확인은 java -version
  ```
  - Ubuntu에 젠킨스 설치   
    https://www.jenkins.io/blog/2023/03/27/repository-signing-keys-changing/
    ```
    젠킨스 레포지토리 추가 
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
    /usr/share/keyrings/jenkins-keyring.asc > /dev/null

    echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null

    apt 업데이트
    sudo apt update

    설치
    sudo apt install jenkins
    ```
- 도커나 쿠버네티스(헬름을 이용한 설치)를 이용
```bash
docker run -d --name jenkins --restart=on-faiure -p 8080:8080 -v /var/jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -e TZ=Asia/Seoul -u root jenkins/jenkins
```
- 쿠버네티스(헬름을 이용한 설치)를 이용
  - 설치
```
$ helm repo add jenkinsci https://charts.jenkins.io
$ helm repo update
$ helm install jenkins jenkinsci/jenkins

로그 확인
kubectl logs sts/jenkins jenkins

암호 확인
kubectl get secret jenkins -o jsonpath="{.data.jenkins-admin-
password}" | base64 --decode

포트포워딩
kubectl port-forward sts/jenkins 8080:8080
```

- 클라우드에서 사용
  - public cloud에서는 호스팅 서비스를 제공공

### jenkins 설치 디렉토리
- /var/lib/jenkins 디렉토리인데 HOME 디렉토리를 변경하고자 할 때는 /etc/default/jankins 파일의 JENKINS_HOME 의 설정을 변경해주면 됩니다.
- 파일 구성
  ```
  - config.xml: 젠킨스 루트 구성 파일
  - *.xml: 기타 사이트 전체 대상 구성 파일
  - userContent: http://server/userContent/ 경로에서 제공
  - fingerprints: 핑거프린트(사용자 추적) 기록을 저장
  - nodes: 에이전트 구성 파일
  - plugins: 플러그인 저장
  - secrets: 크리덴셜을 다른 서버로 이전할 때 필요한 시크릿
  - workspace: 버전 관리 시스템용 작업 디렉터리   
        JOBNAME: 작업별 서브 디렉터리
  - jobs   
    [JOBNAME]   
        config.xml   
        latest   
        builds   
            [BUILD_ID]   
                build.xml   
                log   
                changelog.xml
  ```
- 젠킨스 서버 접속
  - 확인
  ```bash
  sudo systemctl status jenkins
  sudo systemctl start jenkins

  sudo ufw status

  sudo ufw allow 8080
  sudo ufw allow openSSH
  ```
  - Cloud 의 IaaS를 사용하는 경우에는 보안 그룹 설정에서 8080을 개방
  - 브라우저에서 PublicIP:8080
- 추가 설정
  - 기본 비밀번호는 `sudo cat /var/lib/jenkins/secrets/initialAdminPassword` 명령으로 확인
    
  53f2f60fabef4e568474bf452db1681c

  도커의 경우는 `docker exec 컨테이너이름 cat /var/lib/jenkins/secrets/initialAdminPassword` 명령으로 확인 가능
  - 플러그 인 설치
  - 계정 생성

### 시스템 구성 옵션
- Manage Jenkins > Configure System 을 클릭하고 System을 클릭
  - Home Directory   
    젠킨스의 작업 및 구성 파일 등 모든 디렉토리 와 파일이 저장되는 경로

    젠킨스 UI에서는 수정할 수 없고 Jenkins 구성 파일에서 JENKINS_HOME 변수 값을 편집해야 함

    변경하는 경우는 해당 디렉터리에 대한 접근 권한이 없거나 저장 공간이 부족한 경우
  - Jenkins URL   
    인터넷에서 접속할 수 있는 Jenkins 서버 URL
  - System Admin e-mail address(시스템 관리자 이메일 주소)   
    젠킨스 작업 시 생성되는 알림 메시지를 보낼 이메일 주소

### 계정을 잃어버린 경우
- 실행 중인 젠킨스 서버를 중지
- config.xml 파일을 편집   
  <useSecurity>true</useSecurity> 부분을 false로 설정
- 젠킨스 서버를 재시작
- 브라우저에서 접속: 로그인 하는 과정이 생략
- 젠킨스 관리에서 Security로 이동을 해서 Authorization 설정 에서 Anyone Can Do Anything으로 변경을 하고 Save클릭

### 플러그 인
- 젠킨스의 기능을 확장하기 위해서 사용
- 자주 사용되는 플러그인
  - Git
  - Gradle: 그래들은 컴파일, 패키징, 테스트 등과 같은 핵심 빌드 단계를 자동화하는데 사용되는 도구
  - Maven Integration: 메이븐은 컴파일, 패키징, 테스트 등과 같은 핵심 빌드 단계를 자동화하는데 사용되는 도구
  - Email Extension Plugin: 빌드 진행 상태를 관리자에게 알리는 이메일 알림을 구성해주는 플러그인
- 플러그인 설치
  - 젠킨스 관리 메뉴에서 Plugin을 선택하면 플러그인 매니저가 보여짐
  
    Updates: 이미 설치된 플러그인 중 업데이트가 가능한 플러그인을 조회

    Available plugins: 다운로드 및 설치 가능한 플러그

    Installed plugins: 이미 설치된 플러그

    Advanced settings: proxy를 설정하는 것으로 기업이 프록시 서버를 운영하는 경우 프록시에 대한 설정을 하는 것으로 프록시 서버의 접속 정보를 설정하고 프록시를 거치지 않고 접근할 수 있는 URL을 설정