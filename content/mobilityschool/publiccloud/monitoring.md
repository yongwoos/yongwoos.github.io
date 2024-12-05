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
- 