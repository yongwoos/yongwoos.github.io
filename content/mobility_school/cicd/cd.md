---
title: CD
weight: 5
---
## 1.CD(Continuous Delivery, Deployment)
- CI(지속적인 통합)에서 중요한 것은 커밋 단계 와 자동 인수 테스트
- 지속적인 배포
- 배포를 자동화하는 것
- 코드를 이용해서 인프라를 빠르게 배포하는 형태(IaC: Infra as a Code)로 사용
```
Application개발 -> Code Repository -> Trigger -> 단위테스트, 통합테스트, 인수테스트

- 통합테스트와 인수테스트는 제품테스트, 빌드 필요
- 단위테스트는 빌드필요없음, 컴파일만 해도 테스트 가능
- 블랙박스테스트는 기능을 테스트
- Equi Balance Partitioning test: 참 거짓 테스트
- Boundary Value Analysis: 경계값 분석
- Code Coverage: 모든 코드에 최소한의 충분한 테스트를 했는지 확인
- Static Analysis: 명명규칙 분석(상수이름 대문자, 클래스이름 등), 협업 시 중요
```
## 2.Ansible
### 1)개요
- 여러 개의 서버를 효율적으로 관리하기 위해 고안된 환경 구성 자동화 도구
- 현재는 레드햇에서 개발
- chef, puppet도 동일한 작업을 수행해주는 도구
- 리눅스에서 동일한 환경을 구성하기 위해서 사용하는 가장 기초적인 방법은 Bash Shell Script를 사용하는 것인데 각종 패키지의 설치 및 설정 파일의 수정 등을 위해 일괄 처리 목록(Batch Processing List)을 Shell Script에 나열하고 이를 실행하는 방식으로 작업   
클러스터에 존재하는 많은 서버들에 동시에 동일한 환경을 배포해야 하는 상황에서는 Bash Shell Script는 한계점이 명확(Bash Shell Script는 환경 설정을 위해 만들어진 것이 아니며 규칙이 명확하지 않음)
- 환경의 배포와 구성을 규격화된 코드로 정의해 사용해 나가는 것이 (IaC: Infrastructure as a Code)
- IaC의 대표적인 도구가 Ansible

### 2)Ansible 사용 환경 준비
- 서버와 클라이언트 구조로 구성
- 셰프나 퍼핏과 다르게 에이전트가 없는 구조   
  Ansible Command를 입력할 수 있는 컴퓨터에서 명령을 입력하면 SSH Daemon을 이용해서 클라이언트 컴퓨터에 접속해서 명령을 전달함
- Ansible을 사용하기 위한 컴퓨터는 Python이 설치되어 있어야 하고 SSH 접속이 가능해야 함
```bash
# python 확인
python3 --version

# ansible 설치
sudo apt install software-properties-common
sudo apt-add-repository ppa:ansible/ansible
sudo apt update
sudo apt install ansible
ansible --version
```

### 3)Ansible의 기본 개념
- Inventory
  - Ansible에서 관리하는 모든 서버의 목록
  - 컴퓨터들은 파이썬 인터프리터가 설치되어 있어야 하고 SSH 서버가 설치되어 있어야 함
  - /etc/ansible/hosts 에 설정을 함
  - 기본설정
    ```
    [group_name]
    서버주소
    서버주소
    …

    [webservers]
    192.168.0.241
    192.168.0.242
    ```
  - SSH-Key를 복사한 후 별명을 이용해서 원격 사용자를 지정
    ```
    [webservers]
    web1 ansible_host=192.168.0.241 ansible_user=사용자
    web1 ansible_host=192.168.0.242 ansible_user=사용자
    ```
  - 퍼블릭 클라우드에서는 인벤토리를 동적으로 가져오는 기능을 제공

- 애드훅 명령   
`ansible all -m ping`
  - 구성 형식   
	`ansible <타겟> -m 명령 -a 인자`

### 4)playbook
- 개요
  - 서버의 설정 방법을 기술한 구성 파일
  - 각 서버에서 수행해야 할 일련의 작업을 이 파일에 정의
  - yaml 파일로 작성
- 샘플 작성 및 실행
  - playbook.yaml 파일을 만들고 작성
```yml {filename="playbook.yaml"}
---
- hosts: localhost # 수행될 컴퓨터로 inventory에 있는 컴퓨터 이름이나 all 또는 localhost
  become: yes
  become_method: sudo # 관리자 모드로 수행
  tasks:
  - name: ensure apache is at the latest version
    apt: name=apache2 state=latest
  - name: ensure apache is running
    service: name=apache2 state=started enabled=yes
```
  - 실행   
    `ansible-playbook playbook.yaml`

  - 확인   
    `systemctl status apache2`
- playbook을 실행할 때 `--f 스레드개수`를 설정하면 태스크를 병렬로 수행할 수 있음
- 플레이북은 멱등성을 가짐
  - 이전 내용과 동일한 부분은 작업을 다시 수행하지 않고 이전의 내용을 이용

### 5)Handler
- 변경이 발생하면 알려주는 이벤트 방식의 메커니즘 구현을 위한 개념

- 주요 개념
  - handler: 알림을 받으면 실행할 태스크를 지정
  - notify: 실행할 핸들러를 지정

- playbook.yaml 파일 수정
```yml
---
- hosts: localhost #수행될 컴퓨터로 inventory에 있는 컴퓨터 이름이나 all 또는 localhost
  become: yes
  become_method: sudo #관리자 모드로 수행
  tasks:
  - name: ensure apache is at the latest version
    apt: name=apache2 state=latest
  - name: ensure apache is running
    service: name=apache2 state=started enabled=yes
  - name: copy configuration
    copy:
      src: foo.conf
      dest: /etc/foo.conf
    notify:
    - restart apache
  handlers:
  - name: restart apache
    service:
      name: apache2
      state: restarted
```
- foo.conf 파일 생성: `touch foo.conf`

- 재실행: `ansible-playbook playbook.yaml`

- 재실행 - 아무런 변화가 없음
- foo.conf 수정: `echo "somthing" > foo.conf`

- 재실행: `ansible-playbook playbook.yaml`

### 6)변수 사용
- 앤서블은 만들어서 사용할 수 있는 기능을 제공
- 변수를 만들 때는 vars 속성에 이름과 값을 설정하면 되고 Jinja 구문을 이용해서 변수를 이용   
  Jinja 구문이 Django에서 Python의 문법을 이용해서 HTML을 만드는 구문이기도 함
- playbook.yaml 파일 수정
```yml
- hosts: localhost #수행될 컴퓨터로 inventory에 있는 컴퓨터 이름이나 all 또는 localhost
  become: yes
  become_method: sudo #관리자 모드로 수행

  vars:
    http_port: 8080

  tasks:
  - name: print port number
    debug:
      msg: "Port number: {{ http_port }}"
```

### 7)롤
- 재사용의 개념
- 롤: 다른 플레이북에 삽입해 재사용할 수 있도록 구조화한 플레이북
- 롤은 동일한 디렉토리 구조를 가짐
```
templates/
tasks/
handlers/
vars/
defaults/
meta
```
- 각 디렉토리에 main.yml 파일을 만들어서 필요한 내용을 정의
- mysql의 경우: https://github.com/geerlingguy/ansible-role-mysql
- mysql 설치를 위해서 playbook.yaml을 수정
```
---
- hosts: localhost
  become: yes
  become_method: sudo
  roles:
  - role: geelingguy.mysql
```
### 8)앤서블 갤럭시
- 공통적으로 사용할 수 있는 롤 요소를 저장하고 다른 사람과 공유할 수 있도록 해주는 도커 허브 와 유사한 사이트
- 사용할 수 있는 롤의 목록은 https://galaxy.ansible.com 에 존재
- 갤럭시를 이용한 설치   
  `ansible-galaxy install geerlingguy.mysql`   
  `ansible-playbook playbook.yaml`

### 9)도커 및 쿠버네티스와 앤서블
- 유사한 점
  - 환경 구성 방법을 제공: 앤서블은 스크립트를 사용하는데 도커는 전체 환경을 컨테이너에 캡슐화
  - 의존성: 여러 서비스들을 같은 또는 다른 호스트로 배포하는 방법을 제공
  - 확장성: 앤서블은 인벤토리와 호스트 그룹을 통해서 서비스를 확장하고 쿠버네티스는 컨테이너 수를 늘리거나 줄이는 방식을 선택
  - 구성 파일을 사용한 자동화   
    도커는 Dockerfile 에 쿠버네티스는 Deployment.yaml 파일 같은 야믈 파일에 ansible은 playbook.yaml 파일을 이용
- 앤서블의 장점
  - 도커/쿠버네티스를 운영하는 경우 호스트 머신에 대한 설정과 관리가 필요
  - 이미지화 할 수 없는 애플리케이션 이용   
    이미지화하지 않는 애플리케이션으로는 성능이나 보안 또는 특정 하드웨어 요구 사항이나 레거시와의 연동 문제임
  - 인벤토리   
    앤서블은 모든 서버에 대한 정보를 저장하는 인벤토리를 사용해서 물리적 인프라를 관리하는 방식을 제공
  - 클라우드 프로비저닝   
    쿠버네티스 클러스터의 프로비저닝이나 클라우드에 쿠버네티스 설치 할수 있음

- 도커 이미지를 위한 yaml 파일을 생성
```yml
---
- hosts: localhost
  become: yes
  become_method: sudo
  tasks:
  - name: Hazecast Container
    community.docker.docker_container:
      name: hazelcast
      image: busybox
      exposed_ports:
      - 5701
```
- 쿠버네티스 사용을 위한 yaml
```
---
- hosts: localhost
  become: yes
  become_method: sudo
  tasks:
  - name: Create Namespace
    kubernetes.core.k8s:
      name: my-namespace
      api_version: v1
      kind: Namespace
      state: present
```

## 3.쿠버네티스 환경에서의 CI/CD
### 1)개요
- 리소스를 등록할 때는 kubectl 명령을 사용하는데 실제 운영 환경에서는 수동으로 kubectl 명령어를 실행하는 것은 권장하지 않음   
  휴먼 에러가 발생하거나 관리 가능한 규모가 확장되지 않는 문제점 때문
- 일반적으로 자동으로 CI/CD를 수행하는 파이프라인을 구축하는 것을 권장
- 애플리케이션의 소스 코드나 Ansible, Chef 등의 인프라 구성 코드는 깃 저장소에서 관리하는 것이 일반적
- 쿠버네티스에서 지속적인 배포를 실시하는 경우 깃 저장소에 저장된 매니페스트 파일을 kubectl 등으로 자동 배포하는 구조를 만들어야 함

### 2)GitOps
- git을 이용한 CI/CD
- 애플리케이션 업데이트(디플로이먼트 등의 리소스 등을 사용하는 도커 이미지 변경 같은 쿠버네티스 조작)를 깃 저장소를 통해 실시해서 수동으로 매니페스트를 변경하거나 수동으로 `kubectl apply` 명령을 수행할 필요가 없도록 해주는 것

- 과정
  - 애플리케이션 소스 코드를 변경
  - 애플리케이션 테스트를 수행
  - 애플리케이션 이미지를 생성(애플리케이션 컴파일 이나 빌드 수행)
  - 애플리케이션 이미지를 컨테이너 레지스트리에 푸시
  - 디플로이먼트 등의 매니페스트를 변경(이미지 변경)
  - `kubectl apply` 같은 명령을 실시해서 클러스터 반영 
- GitOps 에서는 하나의 애플리케이션에 2개의 저장소가 필요한데 하나는 애플리케이션 소스 코드용 저장소 와 쿠버네티스 매니페스트 관련 저장소
- 소스 코드를 변경하고 저장소에 변경을 커밋하면 자동으로 애플리케이션 테스트 와 도커 이미지 빌드를 하고 도커 레지스트리로 푸시(Jenkins)하고 매니페스트를 가진 저장소에 Push Request를 생성하고 PR을 기반으로 쿠버네티스 매니페스트 변경점을 확인하고 문제가 없다면 병합을 한후 쿠버네티스에서 동작하고 있는 배포 에이전트라고 불리는 에이전트 와 같은 구성 요소가 저장소의 매니페스트를 가져와 적용
- 매니페스트 저장소를 별도로 만드는 이유는 인프라 변경이 하나의 저장소에서 끝나면 그 저장소 상태가 클러스터 상태와 같기 때문에 복원이 쉬움
- GitOps는 KubeCon +  CloudNativeCon 에서도 자주 발표되어 많이 기업이 주목
- Jenkins X 도 깃옵스 사상을 담은 도구 중 하나
- CI Ops
  - 깃옵스는 쿠버네티스에 배포할 때 배포 오퍼레이터가 매니페스트 저장소에서 데이터를 가져와 자신의 클러스터에 매니페스트를 적용
  - CI옵스는 쿠버네티스에 배포할 때 CI 도구가 kubectl 명령을 사용해서 외부에서 쿠버네티스 클러스터에 매니페스트를 적용
  - 보안이 Git Ops 보다는 약하게 되는데 이 방식은 기본의 배포 사상과 유사해서 사용하기가 편리

### 3)매니페스트 체크 도구 - Kubeval
- 개요
  - 매니페스트 파일의 YAML 구조가 특정 API 버전을 준수하는지 검증할 수 있는 OSS(Open Source Software)
- 설치
  - 다운로드: `wget https://github.com/instrumenta/kubeval/releases/latest/download/kubeval-linux-amd64.tar.gz`
  - 다운로드 받은 파일 압축 해제   
    `tar xf kubeval-linux-amd64.tar.gz`
  - kubeval 명령을 아무 곳에서나 사용할 수 있도록 설정   
    `sudo cp kubeval /usr/local/bin`
  - 버전 확인   
    `kubectl --version`
- 매니페스트 확인 방법   
  `kubeval 파일경로(디렉터리 경로) --kubernetes-version 버전`
- 실습
  - 쿠버네티스 배포를 위한 deployment를 생성
```yml {filename="sample.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-deployment
  annotations:
    max-replicas: 100
spec:
  replicas: 3
  selector:
    matchLabels:
      role: sample-app
  template:
    metadata:
      labels:
        role: sample-app
    spec:
      containers:
      - name: nginx-container
        image: nginx:1.16
```
  - 배포   
    `kubectl apply -f sample.yaml`   
    에러가 발생
  - 문법 검사 수행   
    `kubeval ./sample.yaml --kubernetes-version 1.18.1`   
    에러가 발생
  - `annotations` 아래에 있는 값을 `"100"` 으로 변경하고 실행
- 도커 허브 컨테이너 이미지도 공개되어 있어서 컨테이너 이미지를 사용하는 CI에도 통합이 가능

### 4)매니페스트 체크 도구 - Conftest
- 개요
  - 매니페스트 파일을 유닛 테스트하는 OSS
  - OpenPolicyAgent에서 사용되는 Rego라는 언어로 작성
- 수행할 수 있는 테스트
  - 특수 권한 컨테이너가 있는지
  - 리소스에 부여하는 레이블 룰을 정한 경우 필요한 레이블이 누락되지 않았는지
  - 이미지 태그가 latest는 아닌지
- 사용법 rego 언어로 작성된 규칙을 만들고 검사를 수행
- 설치: https://www.conftest.dev/install/
- 작업
  - policy 디렉터리를 생성하고 그 안에 정책을 담은 rego 파일을 생성
```rego {filename="sample.rego"}
# Deployment는 matchLabels 와 labels가 app으로 시작해야 한다는 규칙
package main

deny[msg] {
  input.kind == "Deployment"
  not (input.spec.selector.matchLabels.app == input.spec.template.metadata.labels.app)
  msg = sprintf("Pod Template 과 Selector는 app 으로 시작해야 합니다.: %s", [input.metadata.name])
}
```
  - 확인할 yaml 파일을 생성: success.yaml
```yaml {filename="success.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: success-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: success-app
  template:
    metadata:
      labels:
        app: success-app
    spec:
      containers:
      - name: nginx-container
        image: nginx
```
  - 검사   
    `conftest test ./success.yaml`

  - 확인할 yaml 파일을 생성: fail.yaml
```yaml {filename="fail.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: success-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: success-app
  template:
    metadata:
      labels:
        app: success-app
    spec:
      containers:
      - name: nginx-container
        image: nginx
```
  - 검사   
    `conftest test ./fail.yaml`

### 5)GitOps의 CD 도구: ArgoCD
- 개요
  - GitOps를 구현하기 위한 CD도구
  - 지정한 저장소를 모니터링하고 쿠버네티스 클러스터에 매니페스트를 적용
- 설치
  - `kubectl create namespace argocd`
  - `kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`
- 실습
  - URL: https://github.com/itstudy001/cicd.git
  - 경로: argocd/manifest 디렉토리에 yaml 파일이 존재
  - argocd로 위 경로에 있는 매니페스트 파일을 현재 클러스터에 적용하기 위한 yaml 파일을 생성
```yml {filename="sample-cd.yaml"}
apiVersion: argoproj.io/v1alpha1
kind: application
metadata:
  name: sample-cd
  namespace: argocd
spec:
  project: default
  # 적용할 Manifest의 경로를 설정
  source:
    repoURL: https://github.com/itstudy001/cicd.git
    targetRevision: 1st-edition
    path: argocd/manifests # git 레포에 배포할 yaml파일 있는 디렉터리
    directory:
      recurse: true
  # 적용 대상으로 기본은 자신의 클러스터
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  # 동기화 옵션 설정
  syncPolicy:
    automated:
      prune: true # 저장소에서 삭제된 리소스를 자동으로 삭제하는 옵션
      selfHeal: true # 자동 복구
```
  - 명령 수행: `kubectl apply -f sample`
### 6)Skaffold
- 구글이 개발한 오픈 소스로 도커 및 쿠버네티스용 빌드 와 배포를 자동화하는 도구
- 애플리케이션 소스 코드가 변경된 것을 감지하면 도커 이미지 빌드 그리고 도커 레지스트리 푸시, 쿠버네티스 클러스터로의 배포를 모두 일원화 해서 관리하는 도구
- 개발이 진행되는 단계에서는 소스 코드 변경 횟수가 많아지고 그 소스 코드로 만들어진 도커 이미지도 늘어나기 때문에 이런 경우에는 레지스트리에 저장하지 않고 쿠버네티스 클러스터에 배포할 수 있게 어느 정도 정해진 타이밍에 도커 이미지를 레지스트리에 푸시 할 수 있습니다.
- 스캐폴드 설치
```bash
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \

sudo install skaffold /usr/local/bin/
```

- 스캐폴드 확인   
  `skaffold version`

- golang 설치   
  `sudo apt install golang`   
  `go version`

- 컴파일 및 실행
  - 소스 코드 작성: main.go
  ```go {filename="main.go"}
  package main

  import "fmt"

  func main(){
          fmt.Print("Hello Go")
  }
  ```
  - 바이너리 파일을 만들지 않고 바로 실행   
    `go run main.go`

  - 바이너리 파일을 만들고 실행   
  `go build main.go`   
  `./main`