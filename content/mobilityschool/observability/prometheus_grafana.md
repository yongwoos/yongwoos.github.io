---
title: 프로메테우스/그라파나
weight: 3
---
## 프로메테우스
### aws 환경에서 프로메테우스 실습할 때 주의할 점
인스턴스 별로 생성할 수 있는 파드의 개수가 한정되어 있습니다.프로메테우스 나 그라파나는 기본적으로 여러 개의 파드를 생성합니다. s2.small 정도를 사용하게 되면 11개의 파드밖에 생성을 하지 못합니다. 프로메테우스나 그라파나 파드를 만들고 그 이외 파드를 배포하게 되면 파드가 생성되지 못하고 pending 상태가 됩니다. aws 환경에서 실습을 할 때는 노드의 개수를 충분히 늘리거나 인스턴스 유형을 높여서 사용해야 합니다.
- cloud formation 생성
- eksctl 명령 실행   
  `eksctl create cluster --vpc-public-subnets subnet-0b4bfa146645963be,subnet-0b735502b46af051d,subnet-08bac6116c96b44c5 --name eks-work-cluster --region ap-northeast-2 --version 1.31 --nodegroup-name eks-work-nodegroup --node-type t2.large --nodes 3 --nodes-min 3 --nodes-max 5`

### 1.쿠버네티스에 프로메테우스 설치
- 헬름 차트를 이용해서 설치(서비스가 ClusterIP로 설정되어 있으므로 LoadBalancer 나 NodePort로 변경해서 웹 UI로 접근) monitoring 이라는 네임스페이스를 만들고 설치를 수행해야 합니다.

- 쿠버네티스 설정 파일들을 이용해서 설치(https://github.com/prometheus-operator/kube-prometheus.git - 서비스가 ClusterIP로 설정되어 있으므로 LoadBalancer 나 NodePort로 변경해서 웹 UI로 접근)
  - 다운로드 받은 파일들 중에서 manifests 디렉토리의 setup을 먼저 실행해서 네임스페이스를 생성하고 manifests 디렉토리의 모든 yaml 파일을 실행하면 됩니다.

  - 설정 파일을 수정해서 설치하는 것도 가능(이 경우는 프로메테우스 서비스에 LoadBalancer를 붙였기 때문에 바로 외부에서 접속이 가능): https://github.com/itggangpae/prometheus

### 2.쿠버네티스에서 동작하는 프로메테우스 개요
- 프로메테우스 오퍼레이터는 프로메테우스 서버의 파드 수량 과 영구 볼룸을 포함해서 배포를 관리하는 것 이외에도 서비스 모니터라는 개념을 사용해서 실행 중인 컨테이너의 레이블 과 일치하는 규칙이 있는 서비스를 타깃으로 환경 설정을 자동으로 업데이트 합니다.
- 프로메테우스 웹 UI 화면은 기본적으로 9090번 포트를 이용합니다. 웹에서 확인하고자 하는 경우는 9090 번을 포트포워딩 하던지 아니면 Cluster IP로 설정된 서비스를 로드밸런서나 인그레스 로드밸런서로 변경을 해주어야 합니다.

### 3.모니터링 방법
- 파드와 서비스를 생성: 모니터링 할 수 있는 네임스페이스 안에 파드와 서비스가 만들어져야 합니다.   
  `kubectl apply -f 파일경로 -n 네임스페이스이름`
- ServiceMonitor 와 관련된 yaml 파일을 생성해야 함
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMontitor
metadata:
  name: 이름
  labels:
    레이블
spec:
  selector:
    matchLabels:
      모니터링할 서비스 레이블
  endpoints:
  - port: http
```

### 프로메테우스 다운로드 및 설치
```bash
git clone https://github.com/itggangpae/prometheus

cd prometheus

# 프로메테우스 생성
kubectl apply -f prometheus/

# 네임스페이스 생성
kubectl create namespace kiamol-ch14-test
```

### 파드를 프로메테우스 관측 대상에 포함
- /prometheus/prometheus 폴더에서 프로메테우스 환경 설정(prometheus-config.yaml)을 확인해서 관측 대상 네임스페이스를 확인: kiamol-ch14-test
- 네임스페이스가 존재하지 않으면 생성   
  `kubectl create namespace kiamol-ch14-test`
- 파드 생성을 위한 deployment.yaml 파일을 생성
```yaml {filename="deployment.yaml"}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: kiamol-ch14-test
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx

  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          env:
            - name: Metrics_Enabled
              value: "true"
          ports:
            - containerPort: 80
              name: metrics
```
- 프로메테우스에서의 관측값을 측정하고자 하는 경우는 엔드포인트의 /metrics 에서 값을 리턴해야 함
- deployment 삭제 및 timecheck pod 배포 
```bash
C:\Users\yongw\prometheus>kubectl delete -f ../deployment.yaml

C:\Users\yongw\prometheus>kubectl apply -f timecheck/

C:\Users\yongw\prometheus>kubectl scale deploy/timecheck --replicas 3 -n kiamol-ch14-test
```
- 프로메테우스주소:9090/targets으로 가서 확인

### 애플리케이션에서 관측 값을 측정하기 위한 준비
- 프로그래밍 언어나 프레임워크에서 프로메테우스 관측을 위한 설정을 추가하고 기본 관측값이외에 필요한 관측값을 설정을 추가해주어야 함
- metrics 엔드포인트를 만들어서 필요한 값을 리턴해주어야 함. 엔드포인트 이름은 상관없지만 컨테이너를 만들 때 이 prometheus-config.yaml의 regex 부분의 이름을 명시해 주어야 함
```yaml {filename="prometheus-config.yaml"}
...
action: keep
          regex: kiamol-ch14-test # 배포할 네임스페이스
        - source_labels: 
...
```
```yaml {filename="deployment.yaml"}
...
          env:
            - name: Metrics_Enabled
              value: "true"
          ports:
            - containerPort: 8080
              name: metrics # 엔드포인트
```

### 메트릭 측정 경로 변경
- 파드를 배포할 때 annotation을 이용하면 됨
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: apod-api
  namespace: kiamol-ch14-test
spec:
  selector:
    matchLabels:
      app: apod-api
  template:
    metadata:
      labels:
        app: apod-api
      annotations:
        prometheus.io/path: "/actuator/prometheus"
    spec:
      containers:
        - name: api
          image: kiamol/ch14-image-of-the-day
          ports:
            - containerPort: 80
              name: api
```
- 헬름, kube-prometheus는 관측도구와 감시 대상을 monitoring 네임스페이스로 생성하므로 헷갈림   
  책은 monitoring namespace와 test namespace를 각각 생성해 관측 도구는 monitoring에 설치되고 수집대상은 test에 설치됨


## Grafana
### 개요
- Data Visualization Tool
- 시계열 매트릭 데이터를 시각화하는데 최적화된 대시보드를 제공해주는 오픈소스 툴킷
- 다양한 DB를 연결해서 DB의 데이터를 가져와 시각화 할 수 있으며 그래프를 그리는 방법도 간단
- 서버 리소스의 매트릭 정보나 로그 같은 데이터를 시각화하는데 많이 사용
- 특정 수치 이상으로 값이 치솟을 때 알림을 전달받을 수 있는 기능도 제공
- 오픈 소스 툴킷이라서 커뮤니티도 많이 활성화 되어 있고 일반 사용자들이 만들어놓은 대시보드를 import 해서 사용할 수 도 있고 커스터마이징 하는 것도 가능
- 플러그인도 다양하게 제공

### 리눅스에 설치
```bash
# 패키지 업데이트
sudo apt update && sudo apt upgrade -y

# GPG 키를 사용하기 위한 패키지 설치
sudo apt install -y apt-transport-https software-properties-common wget

# GPG 키를 저장할 디렉토리를 생성
sudo mkdir -p /etc/apt/keyrings

# grafana GPG 키를 다운로드 받아서 keyrings 디렉터리에 저장
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null

# 저장소 등록
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

# 저장소 정보 업데이트
sudo apt update

# 그라파나 설치
sudo apt install grafana

# 버전 확인
sudo grafana-server -v

# 그라파나 시작
sudo systemctl start grafana-server
sudo systemctl status grafana-server

# 자동시작 설정
sudo systemctl enable grafana-server

# 방화벽이 실행 중이라면 3000번 포트를 방화벽에서 해제
# 웹 브라우저에서 3000번 포트로 접속
# 기본적으로 계정은 admin 비밀번호는 admin으로 설정되어 있습니다.
```
### 대시보드 생성
- 실제 메트릭을 수집하고있는 데이터베이스가 필요 - RDS 생성
  ElasticeSearch 또는 Prometheus

## 예제
### 실행
```bash
kubectl apply -f apod/
kubectl apply -f todo-list/
kubectl apply -f grafana/
```
- grafana 서비스의 External IP의 3000번 포트에 접속해서 확인

### 주의할 점
- 여러 개의 파드를 배포한 경우에 특정 파드는 프로메테우스와 직접 연결할 수 없는 경우가 있는데 아무런 설정도 하지 않으면 프로메테우스는 모든 파드의 데이터를 측정하려고 함. 이런 경우는 명시적으로
```yaml
template:
  metadata:
    annotations:
      prometheus.io/scrape: "false"
```
를 추가해서 스크래핑 하지 않도록 해주어야 함.

## 측정값 추출기를 이용한 모니터링
### 개요
- 레거시한 애플리케이션들은 프로메테우스가 측정할 수 없는 값을 사용
- 이런 레거시한 애플리케이션들의 측정값은 프로메테우스가 인식할 수 있는 값으로 변경을 해야 함
- 사이드카 패턴으로 추가를 해주면 됨

### nginx의 경우
- nginx는 web-server라서 기본적으로 연결 갯수나 리퀘스트 시간 등을 측정해서 리턴을 함
- 이런 경우에는 exporter만 사이드카 패턴으로 연결해주면 됨
```bash
# todo-list에 nginx 프록시 적용
C:\Users\yongw\prometheus>kubectl apply -f todo-list/update/proxy-with-exporter.yaml

# 대시보드 업데이트
C:\Users\yongw\prometheus>kubectl apply -f grafana/update/grafana-dashboard-todo-list-v2.yaml

# 그라파나 파드 다시 배포
C:\Users\yongw\prometheus>kubectl rollout restart deploy grafana -n kiamol-ch14-monitoring
```
- 그라파나 대시보드에 proxy 항목이 생김
### RDBMS의 경우
- 연결 갯수나 리퀘스트 시간 등을 측정하지 않음
- 질의를 이용해서 측정값을 구한 정보를 엔드포인트로 제공함
```bash
# todo-list에 DB와 db-exporter 추가
C:\Users\yongw\prometheus>kubectl apply -f todo-list/update/db-with-exporter.yaml

# dashboard 다시 적용
C:\Users\yongw\prometheus>kubectl apply -f grafana/update/grafana-dashboard-todo-list-v3.yaml

# 그라파나 파드 다시 배포
C:\Users\yongw\prometheus>kubectl rollout restart deploy grafana -n kiamol-ch14-monitoring
```
그라파나 대시보드에 Database 항목이 생김

### 대시보드 추가 시 주의할 점
- 그라파나는 대시보드를 변경한 경우 자동으로 적용이 되지 않음
- 대시보드를 변경한 경우는 그라파나 파드를 다시 배포해야 함

### 이미 배포가 끝난 웹 애플리케이션의 경우
- 코드를 수정해서 프로메테우스에 연결하는 것은 쉽지 않은 작업
- 블랙박스 추출기를 추가해서 애플리케이션에 직접 요청을 보내서 측정값을 받아옵니다.
```bash
# 블랙박스 추출기 배포
kubectl apply -f numbers/

# 그라파나 업데이트: 새로운 대시보드 numbers-api를 생성
kubectl apply -f grafana/update/numbers-api/
```
- numbersAPI로드밸런서주소:8016/rng 에 4번 접속하면 그라파나에서 500에러(서버에러)가 발생하는 것을 볼 수 있다
- numbersAPI로드밸런서주소:8016/reset에 접속하면 다시 정상으로 바뀌게 된다

### 쿠버네티스 객체 모니터링
- 개요
  - 프로메테우스는 쿠버네티스와 통합되어 있음
  - 쿠버네티스의 상태 정보를 직접 수집을 못함: 쿠버네티스 내부의 etcd에 저장되어 있는데 이 정보를 외부 API로 노출하지 않음
- 모니터링 방법
  - 별도의 2개의 컨테이너를 설치해서 수집
  - cAdvisor와 kube-state-metrics
  - cAdvisor가 데몬셋의 형태로 모든 노드에 배치가 되서 노드에 있는 컨테이너 상태 정보를 수집
  - kube-state-metrics는 하나만 설치
```bash
# cAdvisor아 kube-state-metrics 배포
kubectl apply -f kube/

# 설정 변경
kubectl apply -f prometheus/update/prometheus-config-kube.yaml

curl -X POST $(kubectl get svc prometheus -o jsonpath='http://{.status.loadBalancer.ingress[0]
.*}:9090/-/reload' -n kiamol-ch14-monitoring)

# 그라파나 업데이트
kubectl apply -f grafana/update/kube/
```
- grafana/ numbers/ prometheus/ todo-list/ 폴더는 다른 애플리케이션에 재사용 할 수 있음
- todo-list의 nginx와 postgreSQL은 측정값을 받기 위해 exporter가 필요

## EKS 클러스터 삭제
```bash
kubectl delete all --all

kubectl delete all --all -n kiamol-ch14-monitoring
kubectl delete all --all -n kiamol-ch14-test

# 클러스터이름 학인
kubectl config get-contexts

# 클러스터 삭제
eksctl delete cluster 클러스터이름
```
프로메테우스를 이용한 관측은 시간을 길게 가지고 학습을 해야 합니다. 프로메테우스를 도입할려면 어쩔 수 없이 개발 작업이 필요하기 때문입니다 계속해서 쿠버네티스나 클라우드 네이티브를 할 거라면 거의 필수. 프로메테우스 측정값 포맷이 개방형 표준이라서 나중에 만들어질 다른 측정값 수집 도구 역시 이 포맷을 따라 할 가능성이 높음