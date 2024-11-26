---
title: Telemetry 도구
weight: 2
---
###  Kiali란
- Kubernetes SVC 간의 요청을 시각적으로 볼 수 있게 해주는 툴
- Kiali를 이용해 실시간으로 애플리케이션 변경 가능
  - VirtualServices 사용해 DDos 공격시 특정 노드의 트래픽을 차단 가능
  - Kiali의 svc 우클릭 > Actions > weighted routing 클릭 시 yaml 파일 자동 생성
    ```bash
    kubectl get vs
    kubectl get virtualservices

    kubectl get destinationrules
    ```
- Istio를 활용한 다양한 기능
  - Canary Release
  - A/B Testing
  - 프로덕션 클러스터에 Test Deploy 가능

### Open Tracing
- Vendor Neutral Tracing API
- jaeger와 zipkin

### Jaeger
- Uber가 개발
- istio 내장 tracing tool

### Zipkin
- twitter가 개발
- istio 내장 tracing tool

## Jaeger
### 예시 구조
- Upstream Request : Webapp(pod) -> API Gateway(pod) -> Staff Service(pod)
- Downstream Response: Webap <- API Gateway <- Staff Service
### traces
![](trace_span.jepg)
