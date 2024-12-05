---
title: LoadBalancer + HTTPS / Autoscaling
weight: 11
---
## 1. EKS에서 생성한 Load Balancer에 HTTPS 적용
### 1)HTTPS를 사용해야 하는 이유
- 모바일 환경에서는 보안이 적용되지 않은 HTTP 사용을 허용하지 않습니다.
- 클라이언트 애플리케이션은 HTTPS로 접속하도록 만들어야 하는데 클라이언트 애플리케이션이 HTTPS를 사용하면 HTTP로 통신을 할 수 없습니다.

### 2)EKS에서 service를 이용해서 생성한 로드 밸런서에 HTTPS 적용
- EKS에서 생성한 service는 ALB(Application Load Balancer)가 아니고 CLB(Classic Load Balancer) 입니다.
- CLB에서는 관리 콘솔에서 HTTPS 인증서를 부착할 수 없습니다.
- 서비스를 생성하는 YAML 파일에서 인증서의 ARN 값을 이용해서 부착합니다.
- HTTPS 인증서는 도메인에만 적용할 수 있음

### 3)작업 순서
- HTTPS 인증서를 생성: ARN 값을 복사
  - Certificate Manager 서비스로 이동
  - 인증서 요청을 눌러서 인증서 생성화면으로 이동한 후 정규화 된 도메인을 입력한 후 요청을 누름
  - 인증서가 만들어지고 검증 대기 중으로 표시되는데 Route53에서 레코드 생성 버튼을 눌러서 검증을 요청
  - 검증에 성공했으면 ARN 값을 복사 arn:aws:acm:ap-northeast-2:905418305225:certificate/cc9705c2-98d4-4366-8127-cdf9eb8019d7
- Service를 생성해서 배포
  - yaml 파일 작성
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: https
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:ap-northeast-2:641022061021:certificate/f4109120-9b88-4989-bfbb-158ce49a6d98 #자신의 https 인증서 ARN

spec:
  type: LoadBalancer
  selector:
    app: backend-app
  ports:
  - protocol: TCP
    port: 443
    targetPort: 80
    name: https
```
  - 서비스 배포
  - 인증서를 적용한 상태로 서비스를 배포하면 Load Balancer의 dns로 접근이 불가능합니다.

- 로드밸런서에 도메인을 연결
  - Route53에 접속해서 인증서를 발급받을 때 사용한 레코드를 생성 > ALB/CLB 선택 > ELB에 연결

- 확인
  - 브라우저에서 생성된 도메인을 입력해서 요청에 정상적으로 응답하는지 확인

## 2.Health Check
### 1)개요
- 컨테이너 동작 속도는 빠릅니다.
- 가상 머신이 동작하는데 분 단위 시간이 소모된다고 하면 컨테이너의 경우는 대부분 밀리초 나 초 단위로 동작
- 애플리케이션이 동작할 때 수행해야 하는 초기화 처리가 완전하게 이루어지 않은 상태에서 서비스를 통해서 파드가 공개되면 요청에 대해서 제대로 응답하지 못하고 에러가 발생할 가능성이 있음   
  이런 경우를 방지하기 위해서 헬스 체크 기능을 사용

### 2)Readiness Probe로 파드와 연결된 서비스 모니터링
- 애플리케이션 공개 가능한 상태인지의 여부를 확인하고 정상이라고 판단된 경우 처음으로 서비스를 통해 트래픽을 수신
- 애플리케이션이 동작할 때 헬스 체크 응답용 페이지를 생성해두고 HTTP로 그 페이지에 접속해서 상태 코드가 200으로 돌아오면 서비스를 통해 접속하는 등의 방법을 사용할 수 있음
- 30초 간격으로 체크를 할 수 있도록 헬스 체크 기능을 추가
  - deployment와 관련된 yaml 파일을 수정
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
        image: 641022061021.dkr.ecr.ap-northeast-2.amazonaws.com/backend-app:4.0.0
        ports:
        - containerPort: 80

        readinessProbe:
          httpGet:
            port: 80
            path: /health
          initialDelaySeconds: 15
          periodSeconds: 30
```
- 파드가 생성되고 나면 80번 포트의 /health로 요청을 해서 결과가 정상적으로 도달하면 ready 상태로 만들어서 서비스에 응답하도록 함   
  요청에 실패했을 때 30초 간격으로 요청을 함

### 3)Liveness Probe로 파드 상태 모니터링
- 실행 중인 파드가 제대로 동작 중인지 모니터링을 함
- 작성하는 방법은 Readiness Probe 와 동일한데 키 값이 livenessProbe
- 실패하면 파드가 재시작 됨
- yaml 파일에 추가
 ```yaml
        livenessProbe:
          httpGet:
            port: 80
            path: /health
          initialDelaySeconds: 15
          periodSeconds: 30
```
- 초기화 처리에 걸리는 시간 고려
  - Readiness Probe는 파드 상태가 비정상으로 판달될 경우 서비스에서 트라펙이 전달되지 않습니다.
  - Liveness Probe에서는 헬스 체크에 실패하면 파드가 재시작 됩니다.
  - Liveness Probe 의 실행은 Readiness Probe가 성공한 후 하지 않으면 파드의 재시작 루프에 빠질 가능성이 있습니다.
  - 쿠버네티스에서는 initial delay 라는 설정으로 파드가 동작한 후 첫번째 헬스체크를 시작하기 까지 유예 시간을 설정할 수 있습니다.
  - livenessProbe의 intialDelaySeconds를 readinessProbe보다 더 길게 하는 것이 좋음

## 3.파드를 안전하게 종료하기 위해 고려해야 할 사항
### 1)파드 종료 시의 상태 변화
- 명시적인 종료 뿐 아니라 어떤 이상이 발생하거나 다양한 이유로 파드가 종료되는 경우 쿠버네티스 입장에서는 비동기적으로 종료 처리를 시작하고 Terminating 상태로 변경하는 흐름으로 동작
- 종료 처리는 SIGTERM 처리를 하고 SIGKILL 처리 순서로 실행되고 이 와 병행해서 서비스에서 제외되는 처리가 이루어지게 됩니다.
- SIGTERM  처리, SIGKILL 처리 와 서비스에서 제외되는 처리가 비동기적으로 이루어지기 때문에 파드를 종료할 때 서비스에서 제외되기 전에 SIGTERM 처리를 할 수 있습니다.
- 이렇게 되면 서비스에서 제외되기 전의 파드가 클라이언트의 요청에 정상적으로 응답할 수 없는 상태가 될 수 있습니다.
- 컨테이너 생성할 때 lifecycle의 preStop에 시간을 설정해 주면 됨
- Docker나 Kubernetes는 거의 대부분의 작업을 비동기로 처리
  - Service에서 Pod를 분리 후 제거
  - 파드 제거 후 서비스 삭제 시 500 에러 발생 가능
  - 서비스 삭제 -> 클러스터 삭제 -> 스택 삭제

### 2)적용
- yaml 파일의 container 생성 부분 하단에 추가
```yaml
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 30"]
```
- 테스트를 할 때는 배포를 한 후 kubectl delete all --all 명령을 수행해서 삭제가 이루어지는데 걸리는 시간을 확인하면 됩니다.

## 4.리소스 관린
### 1)파드의 리소스 양을 명시하는 requests 와 limits
- 도커 컨테이너는 일단 동작하면 부하에 따라 호스트의 CPU 나 메모리를 사용할 수 있는 만큼 사용
- 호스트 하나에서 여러 개의 컨테이너를 동작시키는 경우 리소스를 확보하려는 경쟁이 벌어집니다.
- 도커 컨테이너를 사용하는 경우 여러 개의 컨테이너를 배치하는 것은 안심할 수 없는 상황을 만듬
- 쿠버네티스에서는 파드가 사용할 CPU/메모리의 양을 설정하고 필요 이상으로 호스트 쪽에 부하를 주지 않도록 하는 구조가 있습니다.
resources 라는 속성의 requests 와 limits 를 추가하면 됩니다.
- requests에는 파드가 사용할 수 있는 리소스 상한을 지정하고 requests에는 파드 배포 시 호스트에게 리소스를 최소한으로 사용할 때 필요한 양을 설정하는데 이를 충족하지 않으면 파드가 배치되지 않습니다.

### 2)설정
- 야믈 파일의 containters 안에 추가
```yaml
        resources:
          requests:
            cpu: 100m # 0.1CPU
            memory: 512Mi
          limits:
            cpu: 250m # 0.25CPU
            memory: 768Mi
```

### 3)주의할 점
- CPU 설정이 되어 있지 않거나 너무 낮게 설정된 경우에는 CPU 자원을 많이 사용하게 되는 경우 각 애플리케이션들은 초기에 요청한 자원만큼만 사용할 수 있기 때문에 CPU throttling(CPU나 GPU 등 지나치게 과열될 때 기기의 손상을 막고자 클럭과 전압을 강제적으로 낮추거나 강제로 전원을 끄는 것)이 발생하게 되고 애플리케이션 지연이 발생
- Memory를 너무 낮게 설정하면 메모리 이상을 사용할려고 하면 파드가 삭제됨
- request 와 limits 의 차이를 크게 했을 경우
  - 파드 배치는 requests 값을 기준으로 결정되므로 실제 부하가 많은 호스트라도 requests를 받을 여유가 있다면 새로운 파드를 배치하는데 이것을 OverCommit 이라고 합니다.   
    이 상태는 쿠버네티스는 일정 조건으로 파드 동작을 정지시킬 수 있습니다.
  - 차이를 크게 나게 주는 경우는 시간대별로 부하가 발생하는 파드가 나누어 있고 시간대별로 리소스를 효율적으로 사용하고 싶은 경우 이런 경우에는 양쪽 모두가 배치될 정도의 메모리 양을 requests에 설정하고 limits에 한쪽 파드가 필요로하는 양을 설정
- 차이를 적게 주거나 동일하게 설정하는 경우
  - 파드에 필요한 리소스 양이 얼마인지 미리 알고 있고 예상치 못한 부하가 발생하지 않는 경우에는 requests와 limits를 동일하게 맞출 수 있음

### 4)LimitRange
- 과도한 리소스를 요청하는 파드의 배포를 거부하거나 설정하지 않은 파드에 대해 자동으로 requests와 limits를 적용할 수 있음
- 이 기능은 네임스페이스 단위로 설정
- 네임스페이스를 이용해서 개발 환경과 운영 환경을 다르게 설정해서 사용하는 것도 가능

### 5)ResourceQuota
- 네임스페이스 단위로 사용할 수 있는 총 리소스 양의 상한을 관리하는 기능
- 파드 하나 하나의 리소스 사용량이 적당하더라도 많은 파드가 배포되면 클러스터 전체의 리소스가 모자른 상황이 발생할 수 있는데 리소스 쿼터는 이러한 위험을 방지
- 설정은 네임스페이스 단위로 설정
- CPU나 메모리 뿐 아니라 배포 가능한 파드 수 등도 제한할 수 있음
- 개발 환경의 리소스 상한을 낮게 설정하면 파드가 필요 이상으로 생성되지 않도록 관리할 수 있음
- AWS는 확장성을 보장하지만 불필요하게 리소스를 많이 사용하면 비용이 발생하므로 리소스 사용량을 잘 관리하면 클러스터의 안전성 뿐 아니라 비용도 최적화할 수 있음

## 5.Auto Scaling
### 1)개요
- 시스템 부하 상황에 따라 자동으로 리소스를 유연하게 조정하는 것
- 쿠버네티스도 클라우드 네이티브 도구이므로 오토 스케일링 기능이 있음

### 2)Cluster Autoscaler를 이용한 데이터 플레인 오토스케일링
- 개요
  - Cluster Autoscaler은 Data Plane 인스턴스에 대한 오토 스케일링 기능
- Cluster Autoscaler를 이용한 발견적 오토스케일링
  - Cluster Autoscaler의 스케일링 트리거 기준은 파드에 설정된 리소스 요청에 따라 판단
  - 새로운 파드를 배포하려고 할 때 요청한 CPU리소스와 메모리 크기에 여유가 없다면 그 파드는 Pending 상태가 됨
  - Cluster Autoscaler는 위와 같은 상황을 감지하고 요청된 파드가 동작할 수 있도록 노드를 추가해주는 기능   
    Pending 상태의 파드가 발생했을 때 노드가 추가
- 설정
  - 데이터 노드의 IAM 역할에 IAM 정책을 추가해야 함   
    데이터 노드로 사용되는 EC2 인스턴스를 찾아서 AutoScalingFullAccess 권한을 부여

    사용하고자 하는 클러스터의 EC2 인스턴스를 클릭해서 상세보기로 이동

    인스턴스의 IAM 역할을 클릭해서 AutoScalingFullAccess 권한을 추가

    오토스케일링 그룹 이름을 확인: eks-eks-work-nodegroup-c4c9c78f-c14e-3f1b-74e6-629a0886691d
  - yaml 파일을 만들어서 auto scaling 을 활성화 해줘야 함
  - cluster_autoscaler.yaml 파일을 다운로드 받아서 command 부분의 오토스케일링 그룹 이름 부분만 수정
```yaml
command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        # 오토스케일링 그룹 이름 설정
        - --nodes=3:5:eks-eks-work-nodegroup-c4c9c78f-c14e-3f1b-74e6-629a0886691d
```
  - 야믈 파일 실행
  - 동작 확인   
    `kubectl logs -f deployment/cluster-autoscaler -n kube-system`
  - replica 의 개수를 증가   
    `kubectl scale --replicas=20 deployment/backend-app`
  - 파드 확인: Pending 상태 인 것이 있는지 확인   
    `kubectl get pods`
- 주의할 점
  - Cluster Autoscaler는 requests 값으로 스케일링을 판단
  - 파드를 배치할 때만 스케일링 할지 판단이 가능
  - 파드가 배치가 되면 노드의 스케줄링은 실행되지 않음
  - *실제 부하가 작지만 파드의 requests 값이 큰 경우* 파드가 스케줄링 되지 못하고 **스케일링** 되어 버림
    - EX: 각각 4CPU인 3개의 노드를 하나의 클러스터로 구성할 때 requests: cpu: 4 , 실제 사용량이 1 , autoscaling: 3:5 , replicas:4 총 12CPU 중 전부가 사용되므로 노드가 하나 더 생성됨
  - *requests 값은 낮지만 limits 설정이 없거나 limits가 아주 높은 값으로 설정된 경우* request 자체에는 아직 리소스에 여유가 있지만 이 때 파드를 배포하면 **노드에 과부하**가 걸리는 상태가 될 수 있음

### 3)AWS 오토스케일링 기능을 이용한 예방적 오토스케일링
- 리소스가 부족해서 파드를 배치할 수 없는 상황이 발생하면 스케일 아웃을 하는 것은 잘못된 방식일 수 있습니다.
- 실제 상황에서는 리소스가 부족한 상황이 발생해서 스케일 아웃을 하지 않고 특정 임곗값을 넘으면 노드를 추가하는 것이 더 올바른 방식
- 컨테이너는 빠르게 배포를 해야하는데 노드 추가를 기다려야 한다면 컨테이너의 장점을 활용하지 못하는 것이고 미리 많은 서버를 동작시켜 두는 것도 미용이 많이 발생함
- 부하가 얼마나 발생할 지 또는 대기 시간을 얼마나 갖는지 등 분석을 통해서 적절한 임곗값을 사용하는 것이 좋습니다.
- 생성되는 파드를 pending 상태로 만들지 않으려면 노드의 부하가 높아지는 것을 판단할 필요가 있는데 이 때 많이 사용되는 메트릭이 CPU 사용률입니다.   
  AWS에서는 Cloud Watch 의 Container Insights를 활성화하면 자동으로 등록
- eksctl 명령어로 클러스터를 배포하면 자동 설정이 가능

- AWS에서는 https://docs.aws.amazon.com/ko_kr/autoscaling/ec2/userguide/scale-your-group.html 에서 도큐먼트 제공 

### 4)Horizontal Pod Autoscaler를 이용한 파드 오토스케일링
- 개요
  - 노드의 오토스케일링은 파드를 원하는 수만큼 동작시키기 위해 용량을 확보하는 것
  - 파드 오토스케일링은 애플리케이션의 스케일링
  - Horizontal Pod Autoscaler(HPA)라는 기능을 이용해서 파드의 스케일 아웃과 스케일 인 기능을 구현할 수 있음
  - HPA는 AWS 오토스케일링과 마찬가지로 서비스의 문제 발생을 막는 차원에서 설정
  - 파드의 리소스 사용 현황을 모니터링하고 임계값을 넘을 경우 스케일 아웃을 함
- 메트릭 서버 배포
  - 파드의 리소스 사용 현황을 파악하는 서버
  - 설치는 Kubernetes 지표 서버 설치로 검색하면 설치가 가능
```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```
```
확인
kubectl get deployment metrics-server -n kube-system

kubectl get apiservice v1beta1.metrics.k8s.io -o yaml
```
- 노드의 자원 소모량 확인: `kubectl top node`
- 파드의 자원 소모량 확인: `kubectl top pod`
- HPA 리소스 생성하기 위한 야믈 파일 작성(horizontal-pod-autoscaler.yaml)
```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: backend-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: deployment
    name: backend-app
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 50
```
  - backend-app 이라는 Deployment 의 레플리카를 2에서 부터 5까지 증감시킬 수 있는데 증가하는 기준은 cpu 사용률이 50%를 넘었을 때 입니다.
- 확인을 할 때 CPU 사용량을 증가시킬 수 있도록 애플리케이션에서 wget 이나 요청을 하는 프로그램을 만들어서 사용하거나 targetCPUUtilizationPercentage 값을 낮춰서 확인   
  CPU 사용량이 임계값이 넘어가면 파드의 개수가 증가함