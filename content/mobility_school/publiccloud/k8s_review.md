---
title: K8s 복습
weight: 10
---
## 참고지식
- Load Balancer는 PublicIP는 ClusterIP와 매핑, 포트는 노드포트와 매핑
  - port: Load Balancer 포트
  - Target Port: 파드 포트
  - Node Port: 노드 포트(실제 로드밸런서 사용시 노드포트는 굳이 설정필요 없음)
- NLB는 도메인을 인식하지 못함(3계층), IP로 로드밸런싱
- CLB와 ALB는 가능
  - ALB는 바로 https를 붙일 수 있음
  - CLB는 관리 콘솔에서 바로 https를 붙일 수 없음
- 외부의 코드가 내부의 코드에 영향을 미치면 안됨
  - IoC
  - 의존성 주입
  - application.properties
  - ExternalName
- Ingress는 클러스터가 많을 때 사용
- 서비스를 생성하면 파드 정보가 서비스에 추가됨

## 쿠버네티스에서 애플리케이션을 동작시키는 구조
### 1)컨테이너를 동작시키기 위한 리소스
#### 컨테이너를 동작시키기 위한 리소스 종류
- Pod, ReplicaSet, Deployment, DaemonSet, Job, CronJob
  - ReplicaSet, Deployment, DaemonSet: 계속 구동되어야 하는 애플리케이션 배포
  - DaemonSet: 모닌터링이나 로그 수집 - 모든 곳에서 수행해야 하는 경우
  - Job, CronJob: 배치 작업 - 한 번에 수행하고 종료되거나 주기적으로 수행
  - StatefulSet: 상태 저장이 목적
#### Pod
- 쿠버네티스에서 동작하는 프로그램은 컨테이너(실행의 단위)
- 최소 배포 단위가 파드
- 파드는 서로 관련성이 있는 하나 이상의 컨테이너를 합쳐 놓은 오브젝트
- 파드를 구성하는 방법   
  - 하나의 컨테이너로 구성된 파드
  - 2개 이상의 컨테이너로 구성된 파드
    - 로컬 호스트로 서로 통신 가능
    - 스토리지 공유 가능
- 2개 이상의 컨테이너로 구성된 파드를 사용하는 경우   
  - 컨테이너끼리 네트워크나 스토리지를 공유해서 처리해야 하는 경우   
  - 하나의 컨테이너가 다른 컨테이너의 보조 역할을 수행하는 경우
  - 실제 구성
    - 작업을 처리하는 컨테이너가 존재하고 이 컨테이너가 출력한 로그를 다른 컨테이너가 읽어서 로그 수집 서버나 메트릭 수집 서버에 전송하는 경우
    - 메인 처리를 실행하는 컨테이너가 외부 시스템에 접속할 때 다른 컨테이너가 프록시로 되어 목적지를 할당하거나 요청이 제대로 처리되지 않았을 때 재시도 수행
    - 메인 처리를 실행하는 컨테이너 옆에 보조 역할을 하는 컨테이너를 배치하는 구성을 Sidecar 패턴이라고 하고 프록시를 배치하는 형태는 Ambassador 패턴이라고 함
    - 파드 초기화 컨테이너 사용   
    메인 컨테이너 생성하기 전에 초기화 컨테이너를 실행하도록 설정할 수 있음

    메인 컨테이너를 동작시키기 위해 필요한 초기화 처리를 하는 것이 목적
    
    메인 컨테이너 안에서 수행해도 되지만 분리시키면 장점이 더 많은 장점을 얻을 수 있음
    - 애플리케이션 자체에 필요 없는 도구를 사용하여 초기화 처리 가능
    - 메인 컨테이너의 보안성을 낮추는 도구를 초기화 컨테이너로 분리시키면 안전하게 초기화
    - 초기화 처리와 애플리케이션을 서로 독립시켜 빌드, 배포가 가능
    - 초기 컨테이너가 모두 종료될 때 까지 메인 컨테이너가 실행되지 않기 떄문에 메인 컨테이너를 생성시키는 어떤 조건을 설정하고 그 조건이 성립될 때 까지 메인 컨테이너 생성을 차단할 수 있음
    - 금융의 경우 초기화컨테이너에서 쓰기 전용DB를 읽고 난 후 읽기 실행
  - 하나의 파드에 여러개의 컨테이너가 실행되는 샘플이 워드프레스

#### Deployment
- 파드의 다중화, 버전 업데이트, 롤백을 구현하는 오브젝트
- 파드를 직접 배포하면 파드의 개수를 늘리고 줄이는 동작 또는 파드가 비정상 종료된 경우 별도의 파드를 생성하는 작업 그리고 업데이트 할 때 기존 파드를 유지하면서 변경하는 작업 등을 할 수 없음
- 쿠버네티스 클러스터에 애플리케이션을 배포하는 경우 파드를 직접 설정하지 않고 디플로이먼트 형태를 사용
- 디플로이먼트를 배포를 하면 직접 파드를 배포하지 않고 중간에 ReplicaSet이라는 오브젝트를 생성해 배포
- ReplicaSet은 파드 수 증감 과 파드에 장애가 발생했을 때 자동 재시작하는 것을 담당하는 오브젝트
- Deployment를 배포하면 Deployment 이름 뒤에 레플리카셋이 이름이 붙어서 배포가 이루어집니다.
- 업데이트를 수행하면 새로운 레플리카셋이 만들어지고 순서대로 파드를 교체합니다.

#### 크론잡
- 일정한 주기를 가지고 프로그램을 동작시키는 오브젝트
- 크론잡이 동작시키는 대상은 컨테이너
- 크론잡이 잡을 생성하고 잡이 다시 파드를 생성하고 파드가 컨테이너를 생성해서 실제 작업은 컨테이너에서 이루어짐
- 잡 실행 패턴   
  단일 파드를 실행하는 패턴: .spec.completions 와 .spec.parallelism 모두 기본값 1을 사용하는 경우로 파드가 1개 생성되고 파드가 정상 종료되면 잡이 종료됩니다.

  완료해야 하는 파드 수를 설정하는 실행 패턴: .spec.completions 로 설정한 파드가 정상 종료되면 잡은 완료되는 형태인데 .spec.parallelism 은 필수가 아니지만 설정하면 파드 수 만큼 병렬로 처리

  작업 큐형 실행 패턴: 파드를 여러 개 생성하고  .spec.completions를 설정하지 않는 것으로 처리 대상이 완료되면 완료 처리가 됩니다.
- 잡 재시도 횟수   
  잡에서 생성된 파드가 비정상 종료된 경우 몇 번을 재실행할 지 설정하는 것으로 기본값을 6   
  설정은 .spec.backoffLimit를 이용   

  exponential back-off는 처리를 여러 번 재실행할 때 횟수가 증가함에 따라 재실행을 다시 할 때 할 때 까지의 대기 시간을 지수 함수적으로 증가시키는 것   
  같은 간격으로 처리 재실행을 반복하면 비정상 종료한 처리가 많아질 가능성이 높기 때문입니다.   
  상한 값은 6분
#### DaemonSet
- 모든 노드에 파드 하나를 동작시키는 오브젝트

#### StatefulSet
- 영구 데이터를 다루기 위한 오브젝트
- ReplicaSet은 새로운 파드를 만들 때 파드를 초기화해서 생성하기 때문에 이전 파드의 내용을 기억하지 못함
- 파드 외부에 볼륨 형태로 데이터를 저장한 후 파드가 재시작되더라도 그 때까지 사용했던 볼륨을 계속 사용할 수 있도록 해주는 오브젝트
- 쿠버네티스에서 권장하지 않음
- 쿠버네티스에서는 이런 경우 쿠버네티스 클러스터 외부에 저장소를 만들어서 사용하는 것을 권장

#### 네임스페이스
- 클러스터를 논리적으로 분할해서 사용하기 위한 리소스
- 표준으로 3개를 제공   
  default: 네임스페이스 설정하지 않았을 때 사용하는 네임스페이스
  
  kube-system: 쿠버네티스에 의해서 생성되는 오브젝트가 사용하는 네임스페이스

  네임스페이스는 논리적으로 분할하는 기능 이외에 리소스 쿼터 나 네트워크 정책 과 같은 리소스 또는 RBAC 구조가 있음

#### 디플로이먼트 업데이트와 롤백
- 하나의 디플로이먼트를 만들어서 배포(nginx_deployment_k8s)
```yaml
apiVersion: apps/v1

kind: Deployment

metadata:
  name: nginx
  labels:
    app: nginx

spec:
  replicas: 2
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
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 100m
            memory: 512Mi
          limits:
            cpu: 250m
            memory: 768Mi
```
  - 배포: `kubectl apply -f nginx_deployment_k8s.yaml`

  - 현재 상태 확인: `kubectl get all`
  - 1개의 deployment 와 1개의 replicaset 그리고 2개의 pod로 구성

  - 하나의 디플로이먼트를 만들어서 배포(nginx_deployment_cpu200_k8s.yaml)
```yaml
apiVersion: apps/v1

kind: Deployment

metadata:
  name: nginx
  labels:
    app: nginx

spec:
  replicas: 2
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
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 250m
            memory: 768Mi
```
  - 배포: `kubectl apply -f nginx_deployment_cpu200_k8s.yaml`
  - 현재 상태 확인: `kubectl get all`   
    디플로이먼트는 동일한 이름을 사용하기 때문에 1개가 유지되고 새로운 ReplicaSet을 만들어서 파드를 배치하고 파드의 배치가 끝나면 이전 ReplicaSet의 파드들은 Terminated 상태가 되서 노드에서 제거   
    이 때 노드들에 대한 정보를 ReplicaSet이 가지고 있기 때문에 롤백이 가능   

  - 롤백을 수행하기 위해서 deployment 의 revision을 체크: `kubectl rollout history deployment 디플로이먼트이름`

  - 각 리비전에 대해서 자세히 보고자 하는 경우: `kubectl rollout history deployment nginx --revision=1`

  - 롤백 수행: `kubectl rollout undo deployment 디플로이먼트이름 --to-revision=리비전넘버`

### 2)컨테이너를 외부로 공개하기 위한 리소스
- 파드를 서비스로 묶기
  - 서비스 리소스를 이용하면 파드 여러 개를 묶어서 하나의 DNS 이름으로 접속할 수 있도록 합니다.
  - 파드는 동적이기 때문에 외부에서 직접 접속하는 것은 불편합니다.
  - 서비스가 파드를 기억하고 있다가 외부에서 요청이 오면 정상적으로 동작하는 파드에게 요청을 할당하는 구조로 동작
  - 서비스를 위한 야믈 파일
```yaml
apiVersion: v1			#api 버전
kind: Service			#리소스 종류
metadata:
  name: backend-service	#서비스 리소스 이름 설정
spec:
  type: LoadBalancer		#서비스 종류
  selector:
    app: backend-app		#파드를 선택하기 위한 셀렉터 정의
  ports:
  - protocol: TCP
    port: 80				#서비스에 할당하는 포트
    targetPort: 80			#파드의 포트
```
  - 서비스 리소스 타입   
    ClusterIP: 서비스에 대해 클러스터 내부에서 유효한 IP 주소를 부여하는데 클러스터 외부에서 접속할 수 없습니다.
    
    NodePort: 각 노드에서 해당 서비스에 접속하기 위한 포트를 열고 클러스터 외부에서 접속 가능하도록 합니다.
    
    LoadBalancer: NodePort에서 열린 노드 각각의 공개용 포트를 묶는 형태로 클러스터 외부에 로드밸런서를 구축
    
    EKS의 경우는 CLB(Classic Load Balancer)가 생성되며 설정에 따라 NLB(Network Load Balancer)로 변경 가능하지만 ALB(Application Load Balancer)는 안됨
    
    ExternalName: 클러스터 내부의 파드를 공개하기 위한 리소스가 아닌 클러스터 외부의 엔드포인트를 클러스터 내부에 공개하기 위한 리소스 타입으로 파드 각각이 외부 서비스를 직접 호출하지 않고 ExternalName으로 등록한 서비스로 접속하면 외부 서비스와 내부 파드를 느슨한 결합으로 연결할 수 있습니다.
- 컨테이너를 외부로 공개하는 또 하나의 방법
  - LoadBalancer 타입의 서비스를 만들어서 EKS 클러스터의 컨테이너를 외부로 공개해서 인터넷에서 접속할 수 있도록 했을 때의 문제점
    1. 서비스 단위로 ELB가 생성되기 때문에 효율이 좋지 못함
    2. HTTP나 HTTPS 로드밸런서로 더 많은 기능이 있는 ALB(Application Load Balancer)를 사용할 수 없음
  - 다른 방법으로 Ingress를 사용할 수 있습니다.
  - 인그레스는 쿠버네티스 클러스터로 접근하는 입구를 만들기 위한 리소스
  - 동작 환경(AWS의 클라우드 환경 등)에 적합한 Ingress Controller를 사용하면 쿠버네티스 클러스터에 접근할 공통 입구를 만들고 애플리케이션 여러 개를 동시에 클러스터 외부에 공개할 수 있음
  - EKS에서는 인그레스 컨트롤러로 AWS ALB 인그레스 컨트롤러가 제공됨 https://github.com/kubernetes-sigs/aws-load-balancer-controller
- CLB(Classic Load Balancer)에 HTTPS 인증서를 적용
  - 인증서를 만들고 인증서의 ARN을 서비스를 만들 때 기재하면 됩니다.
  - 서비스를 개방할 때 포트번호도 443 이어야 합니다.
  - 인증서를 만들기 위해서 도메인도 준비가 되어 있어야 함

- 로드밸런서 설정
  - TCP: IP + 포트
  - HTTP: 파일경로
  - 서버만들때 TCP로 해야 포트번호, IP로 로드밸런싱 가능