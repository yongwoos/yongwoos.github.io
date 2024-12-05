---
title: 모니터링
weight: 12
---
## 1. 모니터링
### 1)개요
- 시스템을 구축하고 운영을 할 때 일반적으로 초기 단계인 구축 작업(요건 정의, 설계, 구축, 테스트)에 집중하는 경향이 있음
- 구축이후 시스템을 관리하고 운영하는 시간이 압도적으로 김
- 완벽하게 설계를 하더라도 반드시 장애는 발생함
- 클러스터나 애플리케이션이 지금 어떤 상태인지 파악하는 것은 중요한 작업 중 하나

### 2)클러스터 상태 파악
- EKS Control Plane은 AWS에서 운영되는 관리형 서비스
- Data Plane(Worker Node)을 EC2로 구축하는 경우는 노드를 스스로 관리
- AWS 오토스케일링 기능을 사용해서 Data Plane을 구축하기 때문에 최소 숫자의 서버가 동작하도록 되어 있고 그 대수 아래로 떨어지지 않도록 AWS에서 자동으로 관리를 수행함

### 3)CloudWatch 의 Container Insights 로 애플리케이션 상태 파악
- CloudWatch 의 Container Insights를 이용하면 클러스터 노드, 파드, 네임스페이스, 서비스 레벨의 메트릭을 참조할 수 있습니다.
- Cluster를 Container Insights에서 확인 할 수 있도록 등록
  - CloudWatch Agent를 DaemonSet으로 배치를 해서 필요한 메트릭을 CloudWatch로 전송
  - 데이터 노드에서 IAM 역할에 CloudWatchAgentServerPolicy 정책을 추가
    
    EC2 서비스로 이동을 해서 Worker Node로 사용되는 인스턴스를 클릭

    IAM 역할을 추가하고 정책 연결을 눌러서 CloudWatchAgentServerPolicy 정책을 연결
  - 나머지 설정   
    https://docs.aws.amazon.com/ko_kr/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-metrics.html
    
```
# namespace 지정
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cloudwatch-namespace.yaml

# 서비스 계정 생성
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cwagent/cwagent-serviceaccount.yaml

# configmap 다운로드
curl -O https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cwagent/cwagent-configmap-enhanced.yaml

# configmap yaml파일 수정
# cluster_name 필드를 수정, 클러스터 이름 확인은 kubectl config get-contexts 로 확인
```
```yaml {filename="cwagent-configmap-enhanced.yaml"}
# cluster_name 수정
# create configmap for cwagent config
apiVersion: v1
data:
  # Configuration is in Json format. No matter what configure change you make,
  # please keep the Json blob valid.
  cwagentconfig.json: |
    {
      "logs": {
        "metrics_collected": {
          "kubernetes": {
            "cluster_name": "eks-cluster",
            "metrics_collection_interval": 60,
            "enhanced_container_insights": true
          }
        },
        "force_flush_interval": 5
      }
    }
kind: ConfigMap
metadata:
  name: cwagentconfig
  namespace: amazon-cloudwatch
```
```
# yaml 파일 적용
kubectl apply -f cwagent-configmap-enhanced.yaml

# DaemonSet 배포
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cwagent/cwagent-daemonset.yaml

# 배포 확인
kubectl get pods -n amazon-cloudwatch

# CloudWatch로 가서 로그그룹에서 aws로 시작하는 것이 생성된 것을 확인
```
- 설치한 내역 삭제
```
kubectl delete -f .
```

## 2. 로그 관리
### 1)AWS의 관리형 서비스에서 사용하는 로그 관리의 기본 개념
- 수집: Fluentd 컨테이너를 데몬셋으로 동작시키고 파드의 로그를 Cloud Watch Logs에 전송
  - Fluentd   
    크로스 플랫폼 오픈 소스 데이터 수집 소프트웨어

    ELK Stack에서 Logstash가 자원을 많이 소모하는 문제점을 가지고 있어서 이를 보완하기 위해서 등장

    서버에 쌓이고 있는 log 파일을 지정해서 로그를 수집할 수 있도록 할 수 있고 http나 https 통신을 이용해서 Fluentd로 직접 로그를 전송하는 것도 가능
- 저장: Cloud Watch Logs에 저장하도록 설계
- 모니터링: CloudWatch 사용자 메트릭을 생성하여 그 메트릭의 경보를 생성
- 시각화: Cloud Watch 의 Logs Insights를 사용

### 2)쿠버네티스의 로그 저장
- 일반 서버에 애플리케이션을 배포하는 경우 애플리케이션이 출력하는 로그는 배포된 서버의 특정 디렉토리에 로그 파일로 출력해서 저장하도록 설정
- 쿠버네티스에서 동작하는 애플리케이션은 어떤 호스트에서 동작 중인지 알 수 없고 재시작을 하게되면 호스트가 변경될 수 도 있기 때문에 앞의 방법을 이용하면 로그를 일관되게 확인하기 어렵습니다.
- 쿠버네티스에서는 애플리케이션 로그 출력은 표준 출력으로 구성하는 것을 추천
- 표준 출력을 사용하기 때문에 명시적으로 애플리케이션이 출력한 내용 이외의 로그도 포함될 가능성이 있음

### 3)CloudWatch를 이용해서 로그 수집
- IAM 역할을 추가하고 정책 연결을 눌러서 CloudWatchAgentServerPolicy 정책을 연결
- 나머지 설정: https://docs.aws.amazon.com/ko_kr/AmazonCloudWatch/latest/monitoring/Container-Insights-setup-logs.html

### 3)관측 가능성의 중요성
- 시스템 서비스 전체 기능이 컨테이너로 세분화되고 그 컨테이너들이 서로 연결되어 전체 기능을 제공하는 마이크로 서비스 방식이 많이 사용됨
- 마이크로 서비스를 구현할 때 전체 서비스 규모가 커지면 어떤 마이크로 서비스의 어떤 기능에서 에러나 성능 저하가 발생하는지 바로 판단하기가 어려움
- 마이크로 서비스 각각의 연관성과 성능 상태를 시각화해서 서비스 전체를 파악하는 동시에 평소와 다른 패턴이 보이거나 문제가 발생했을 때 빨리 원인을 특정지을 수 있어야 하는데 이를 **관측 가능성**이라고 함
- 쿠버네티스 모니터링에는 Container Insights 외에 프로메테우스, 그라파나, 데이터독, 뉴렐릭 등이 사용이 됨

## 3.보안
### 1)클러스터 보안
- 인증(Authentication)
  - 쿠버네티스를 조작할 때는 kubectl 명령을 사용
  - EKS에서는 IAM을 이용한 사용자 인증 그리고 인가(Authorization - 권한) 기능을 제공하면 AWS CLI와 연결해서 인증할수도 있음
  - `aws eks update-kubeconfig --name 클러스터이름`
  - 실제 인증은 `aws --region ap-northeast-2 eks get-token --cluster-name 클러스터이름` 라는 명령으로 확인한 토큰을 통해 인증
- 인가(Authorization)
  - 쿠버네티스에서는 Role-Based Access Control(RBAC)라는 기능을 이용해서 인가를 구현
  - aws-auth 라는 이름의 ConfigMap 안에 AWS CLI 인증 정보로 설정한 IAM 사용, IAM 역할의 Amazon 리소스이름(ARN), 쿠버네티스 오브젝트로 그룹을 연결해 놓고 롤바인딩으로 그 그룹과 롤을 연결시키는 것으로 구현
  - 설정을 하고자 하는 경우 yaml 파일을 하나 생성
```yaml
kind: ClusterRole
rules:
  - apiGroups: ["extensions", "apps", ""]
    resources: ["pods", "pods/log", "deployments" ...]
    verbs: ["get", "watch", "list"]
```

### 2)노드 보안
- 파드에 부여하는 호스트 권한 제어
  - 쿠버네티스에서는 파드에 부여할 권한을 관리하는 Pod Security Policy 라는 기능을 가지고 있음
  - 쿠버네티스 1.13 버전 이후에는 기본적으로 PSP가 활성화 되어 있음
  - 기본적으로 모든 작업이 가능하도록 되어 있음
  - 확인: `kubectl get psp eks.privileged`
  - 편집: `kubectl edit psp eks.privileged`   
    나오는 항목 중에 privileged는 false로 설정하면 파드를 더 이상 생성할 수 없음
- 컨테이너 라이프사이클에 맞춘 보안 대책의 필요성
  - 컨테이너 이미지 취약성: 컨테이너 이미지를 스캔해서 문제가 있는 소프트웨어 버전이 있는지 확인할 필요가 있음
  - 동작도 감시
  - 이러한 보안 대책은 자체적으로 구축할 경우 난이도가 높기 때문에 솔루션을 이용하는 것이 보통인데 컨테이너 이미지 스캔을 하고자 할 때는 trivy나 microscanner를 이용하고 동작 감시만 하는 경우는 falco를 활용할 수 있음
  - ECR은 컨테이너 이미지 스캔 기능을 소유하고 있음

### 3)네트워크 보안
- Endpoint IP 주소 제한
  - 기본적으로 EKS 클러스터 Endpoint 는 인터넷에 공개
  - IAM으로 인증을 받아야 하므로 공개되더라도 문제가 없음
  - AWS 관리 콘솔에서 Endpoint IP 주소 제한을 설정할 수 있음
  - 보안 그룹 설정이 가능
  - 엔터프라이즈용 서비스 사용자 등이 특정 장소에서만 접속해야 하는 경우 사용
- kubectl을 VPC 내부로 제한하는 프라이빗 엔드포인트
  - EKS에서는 프라이빗 엔드포인트를 제공

## 4.매니페스트 관리와 CI/CD
### 1)깃옵스와 깃옵스를 구현하기 위한 도구
- 쿠버네티스에서는 모든 설정 정보를 매니페스트라는 yaml 파일로 정의
- 모든 설정을 코드로 관리할 수 있다면 애플리케이션과 마찬가지로 CI/CD를 구현하는 것이 가능
- Weaveworks사가 GitOps라는 프로세스를 만든 것부터 시작
- 쿠버네티스의 매니페스트도 리포지토리로 관리하고 pull 요청 기반의 운영으로 배포할 수 있음
- 리포지토리의 매니페스트 파일 외에는 업데이트를 인정하지 않는 구조를 도입해야 함
- GitOps Pipeline
  - 개발자 -> 소스 코드를 수정해서 git push -> CI(build/test/push) -> ContainerRegistry -> ConfigUpdater -> Git Code(운영 담당자는 여기에 push) <-> Deploy Operator -> 쿠버네티스 클러스터 배포
    
    Developer -- (git push) --> git repo -> CI(compile -> test -> build -> Image Build -> Push) -> Image Registry -> Code Updator -> Git Repo -- (pull req) --> Deploy Operator -> Kubernetes Cluster

    Operator -- (git push) --> git Repo
- 쿠버네티스에 설정 정보 적용을 자동화해주는 도구
  - Argo CD(argoproj.github.io/argo-cd)
  - Concource CI(concourse-ci.org)
  - Weave Cloud: Weaveworks 에서 만든 CD 서비스 도구
  - Spinnaker(spinnaker.io): 넷플릭스에서 만든 CD 구현 도구
  - Skaffold(github.com/GoogleContainerTools/skaffold): 구글이 만든 CD 도구
- AWS의 CodePipeline
  - AWS에서 제공하는 CI/CD 파이프라인을 구성하는 서비스
- MSA 사용 시 자바는 무거움, Go나 파이썬을 추천
```
개발자 -> git repo --(push or polling)--> Code Commit -> Code Build(Jenkins 역할) -> Code Deploy(ArgoCD역할) -> EKS
                                |--(push)-->ECR(DockerHub역할) -> EKS
```
### 2)클러스터 분할 문제
- 개발 환경에서 테스트하고 스테이징 환경에서 최종 점검해서 문제가 없으면 서비스 환경에 배포
- 환경은 클러스터가 될 수도 있고 네임스페이스가 될 수도 있음
- 환경을 네임스페이스 단위로 나누게 되면 리소스를 효율적으로 사용할 수 있다는 장점이 있지만 클러스터에 장애가 발생하면 모든 서비스가 중지되어 버림
- 세세하게 클러스터를 나누게 되면 클러스터에 장애가 발생했을 때 영향 범위를 최소화할 수 있지만 리소스 사용 효율이 저하되고 클러스터를 개별적으로 관리해야 하므로 관리에 부담이 발생

### 3)GitOps에서의 문제점
- Git Repository에 소스 코드를 업로드한 구조라서 민감한 정보가 노출될 위험성이 있음
- Git Repository의 Secret이나 쿠버네티스의 Secret 기능 등을 이용하는데 Git Repository의 Secret은 소스 코드에 적용하는 것이 어렵고 쿠버네티스의 Secret은 Base64로 인코딩 되어있을 뿐이어서 디코딩을 하면 정보를 알 수 있음
- Sealed Secret 이라는 도구를 이용하는 것이 가능한데 kubeseal이라는 명령어로 민감한 정보를 암호화한 매니페스트를 만들고 적용을 하는데 kubectl apply를 할 때 복호화해서 자동으로 삽입되도록 함

## 4.버전 관리
### 1)쿠버네티스 버전과 업데이트 계획 및 EKS 지원 정책
- 쿠버네티스는 개발이 활발하게 진행되서 3~4개월에 한 번씩 최신 버전을 출시
- 12개월 또는 3개의 릴리즈 중 긴 쪽을 지원
- EKS도 이 정책을 따라서 서포트하는 최신 버전을 포함해 3개의 버전을 서포트   
  일반적으로 9개월에 한 번은 버전 업데이트 작업이 필요
- EKS가 Kubernetes보다 3~5개월 정도 늦게 반영

### 2)eksctl 명령으로 업데이트
- control plane 업데이트
```
eksctl upgrade cluster --name 클러스터이름 --approve

eksctl utils update-kube-proxy --cluster 클러스터이름 --approve

eksctl utils update-coredns --cluster 클러스터이름 --approve
```
- data plane 업데이트: 새로운 버전으로 노드 그룹을 생성하고이전 노드 그룹을 삭제
```
eksctl create nodegroup --clsuter 클러스터이름 --version 새로운버전 --name 새로운노드그룹이름 --node-type 인스턴스유형 --nodes 노드 개수
--node-min 최소노드개수 --node-max 최대노드개수 --node-ami auto

eksctl delete nodegroup --cluster 클러스터이름 --name 노드그룹이름

eksctl create nodegroup --clsuter eks-cluster --name eks-work-nodegroup-2 --node-type t2.small --nodes 3 --node-min 3 --node-max 5
```

### 3)파드를 재배치하는 방법
- eksctl을 이용해서 노드 변경 동작
  - eksctl에서 노드 그룹을 삭제하면 삭제 대상 노드 그룹의 실제 노드들은 Schedule Disabled 상태가 됨   
    이 상태가 되면 그 노드에 새로운 파드의 스케쥴링이 금지됨   
    해당 노드는 Drain 상태가 되고 Drain 상태가 되면 그 노드 상에서 동작하는 모든 파드는 다른 노드로 재배치됨
- 모든 파드가 동시에 정지되지 않게 하기 위한 방법
  - 드레인 구조를 사용하면 노드 단위에 순차적으로 파드를 재배치할 수 있음
  - eksctl에서는 모든 노드를 동시에 드레인하기 때문에 최악의 경우는 모든 파드가 동시에 재배치 될 수 있음
  - 쿠버네티스에서는 PodDisruptionBudget 이라는 리소스가 준비되어 있는데 이 리소스를 이용해서 파드가 재배치될 때 정상이 아닌 파드를 허용하는 수를 결정할 수 있음

```yaml
apiVersion: policy/v1beta1
kind: PodDisruptionBudget
metadata:
  name: 이름
spec:
  maxUnavailable: 숫자
  selector:
    matchLabels:
      파드이름
```
  - 레플리카가 3인데 maxUnavailable의 값을 2로 설정하면 모든 파드가 드레인 상태의 노드에 배치가 되었더라도 반드시 하나는 정상적인 상태를 유지하면서 파드 재배치가 이루어짐

### 4)새로운 클러스터에 파드를 배치하고 기존 클러스터를 제거
- 블루/그린 업데이트 전략
- 기존 클러스터를 업데이트 했을 때 장단점
  - 장점   
    엔드포인트 변경이 되지 않으므로 클러스터 외부와의 설정에 영향을 미치지 않음   
    모니터링 등 운영적인 측면에서 영향이 없음
  - 단점   
    컨트롤 플레인을 업데이트 할 때 일시적인 다운 타임 발생   
    데이터 플레인을 업데이트 할 때는 파드의 재배치 전략을 고려   
    업데이트에 실패하면 복원 작업이 복잡해짐
- 새로운 클러스터를 생성해서 변경하는 경우의 장단점
  - 장점   
    기존 환경에 영향을 주지 않고 사전 준비 가능   
    실패할 경우 복구 작업이 간단함
  - 단점   
    엔드포인트가 변경되기 때문에 DNS 수준에서의 변경 작업 필요   
    모니터링 등 운영적 기능 설정을 다시 해야 함(클러스터 이름 변경되어서 메트릭이나 로그 그룹 이름이 변경됨)

## 5.Fargate
- 데이터플레인의 가상 머신 운영 및 관리를 AWS에 위임
- EC2 인스턴스가 존재하지 않아서 파드가 실제 이용한 CPU/Memory 리소스 양에 따라 과금   
  자주 사용하지 않는 파드의 경우는 EC2 인스턴스보다 Fargate가 저렴
- 사용하는 경우
  - 배치 처리 등 일시적이거나 정기적으로 많은 리소스를 사용하는 경우
  - 동시에 병렬 처리를 하기 위해 많은 파드를 동시에 동작시켜야 하는 경우

## EKS 평가
1. NODE가 2개인 EKS 클러스터를 구성   
   답안은 kubectl get nodes 한 결과를 캡쳐해서 전송

2. 웹 애플리케이션을 replica를 2로 해서 배포
   웹 애플리케이션은 제작한 애플리케이션이어도 되고 nginx나 apache web server도 가능

   kubectl get pods 한 결과를 캡쳐해서 전송

3. 배포한 파드에 LoadBalancer를 부착해서 외부로 노출
   kubectl get svc 한 결과를 캡쳐해서 전송

   externalIP나 LoadBalancer의 Domain Name을 전송

4. 오늘 제출하신 분들은 오늘 클러스터 삭제
   오늘 제출하지 않으신 분들은 저한테 메시지 주시고 1시간 후에 삭제하면 됨