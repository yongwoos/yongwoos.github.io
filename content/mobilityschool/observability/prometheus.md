---
title: 프로메테우스
weight: 3
---
### aws 환경에서 프로메테우스 실습할 때 주의할 점
인스턴스 별로 생성할 수 있는 파드의 개수가 한정되어 있습니다.프로메테우스 나 그라파나는 기본적으로 여러 개의 파드를 생성합니다. s2.small 정도를 사용하게 되면 11개의 파드밖에 생성을 하지 못합니다. 프로메테우스나 그라파나 파드를 만들고 그 이외 파드를 배포하게 되면 파드가 생성되지 못하고 pending 상태가 됩니다. aws 환경에서 실습을 할 때는 노드의 개수를 충분히 늘리거나 인스턴스 유형을 높여서 사용해야 합니다.
- cloud formation 생성
- eksctl 명령 실행   
  `eksctl create cluster --vpc-public-subnets subnet-0b4bfa146645963be,subnet-0b735502b46af051d,subnet-08bac6116c96b44c5 --name eks-work-cluster --region ap-northeast-2 --version 1.31 --nodegroup-name eks-work-nodegroup --node-type t2.large --nodes 3 --nodes-min 3 --nodes-max 5`

### 1.쿠버네티스에 프로메테우스 설치
- 헬름 차트를 이용해서 설치 -> monitoring이라는 namespace를 만들고 설치를 수행해야 함
- 쿠버네티스 설정 파일들을 이용해서 설치 https://github.com/prometheus-operator/kube-prometheus.git   
  다운로드 받은 파일들 중에서 manifests 디렉터리의 setup을 먼저 실행해서 네임스페이스를 생성하고 manifests 디렉터리의 모든 yaml 파일을 실행하면 됨
- 설정 파일을 수정해서 설치 https://github.com/itggangpae/prometheus 또는 책 ch14페이지 이용 또는 https://github.com/prometheus-operator/kube-prometheus

### 2.쿠버네티스에서 동작하는 프로메테우스 개요
- 프로메테우스 오퍼레이터는 프로메테우스 서버의 파드 수량 과 영구 볼룸을 포함해서 배포를 관리하는 것 이외에도 서비스 모니터라는 개념을 사용해서 실행 중인 컨테이너의 레이블 과 일치하는 규칙이 있는 서비스를 타깃으로 환경 설정을 자동으로 업데이트 합니다.