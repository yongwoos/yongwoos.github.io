---
title: Envoy
weight: 1
---
### Envoy란
- Lift가 개발
- Istio는 Proxy를 이용해 서비스 메쉬를 구현하는데 Envoy는 Isito의 Proxy를 생성하는 역할
- 여러 실행 환경이 있고 쿠버네티스가 그 중 하나
- 우버에서도 사용
- envoy는 실행에 추가적인 툴이 필요, Low-level tool
- Istio 대신 Envoy만을 사용하려면 많은 추가 설정이 필요
  - Istio는 Envoy를 간단하게 해줌
  - CRD 사용해 envoy 사용 가능
  - Istio 컨트롤은 Istio Daemon이 담당
- envoy는 L7 Proxy
  - service discovery, load balancing, traffic routing, observability, and security 등의 기능 제공