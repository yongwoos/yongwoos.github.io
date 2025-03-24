---
title: Kubernetes CPU 알뜰하게 사용하기
weight: 1
---
## 기본 개념
### CPU Requests
- CPU의 최소 보장량
- 초과 가능

### CPU Limits
- CPU의 최대 허용량
- 더 많이 사용 시 Throttling 발생 가능

### Throttling
- CPU를 할당 받지 못해 기다리는 현상
- 응답 속도 느려지게 만듬

## 자원 최적화
### 목표
- 서비스 안정성 유지
- 자원 할당량 최소화
- 자원 사용량 최소화
- 자원 사용량 분산

## Kubernetes CPU 최적화
- CPU 사용량 추이가 Limits 보다 낮아도 Throttling 발생하는 현상 관측 가능
- ex) CPU 사용량 < 5 < requests 7.5 < Limits 15
- CFS에 대한 이해가 필요

### CPU Throttling 방지
- CFS(Completely fair scheduler)
  - 컨테이너가 워커 노드의 CPU 공유하기 위해 사용하는 CPU 스케줄러
  - 각 컨테이너는 CPU 타임 슬라이스 할당량 분배
  - kubelet quota 비활성화 또는 quota period 낮추기
- 병렬성 설정
  - 컨테이너는 OS의 커널을 공유하기 때문에 컨테이너의 CPU 코어 인식 개수와 워커 노드 CPU 전체 코어 개수와 같다

### 자원 할당량 최적화(Right Sizing)
- 대고객 서비스
  - 토스는 액티브-액티브 형태의 데이터 센터 구조 -> request 2배
- 오토스케일링은 IDC 환경에서 위험
  - 서버를 파드 처럼 직접 늘릴 수 없음 -> 최대 부하를 추산해 자원 할당
- Alert 활용
  - 그라파나, 타노스, 프로메테우스
  - 기준 Metric: CPU req 대비 사용량
  - Noise: 정확하지 않은 Alert, 중요하지 않은 Alert
- Noise 제거
  - 실시간 값 대신 최근 1주일 최대값 계산해 alarm
  - max over time 중첩

### Right Sizing for Cloud
- EC2 워커 노드 스케일업으로 리소스 사용량 줄이기
- MAU 20% 증가해

### Optimization for infra
- istio
  - 모든 envoy가 자신의 메모리에 메트릭을 올려놓고 서빙을 해야 함
  - 메트릭은 가비지 콜렉션이 안되 오래된 엔보이는 OOM으로 죽을 확률이 있음
  - 프로메테우스 리소스 사용량 증가
- istio를 대체하는 toss mixer 개발
- toss mixer
  - envoy로 트래픽 수집, 메트릭으로 aggregate 후 log를 카프카로 전송
  - 메트릭을 aggregate 함으로 envoy가 메트릭을 쌓을 필요가 없어짐
  - 
### CPU Requests/Limits 최소화

### CPU 최적화
- 인프라 관점
- 서비스 관점