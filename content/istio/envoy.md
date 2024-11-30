---
title: Envoy
weight: 1
---
## Envoy란
Lift사가 개발한 프록시이다. 여러 실행 환경이 있고 쿠버네티스가 그 중 하나이다. Envoy를 수정해 Istio에 적용시켰다고 한다. Istio 대신 envoy만을 사용하려면 많은 추가 설정이 필요하다. 또한 envoy 실행에 추가적인 low-level 툴이 필요하므로 istio를 이용해 사용하는 것이 편하다.
쿠버네티스에서 yaml파일을 이용해 envoy를 간단하게 정의할 수 있다.

Istio는 Proxy를 이용해 서비스 메쉬를 구현하는데 Envoy는 Isito의 Proxy를 생성하는 역할을 한다. 프록시는 사이드카 형태로 모든 파드의 컨테이너 옆에 생성되며 Istio 컨트롤은 Istio Daemon인 istiod가 컨트롤플레인에서 담당한다.

envoy는 L7 Proxy이다. L7 Proxy의 기능인 service discovery, load balancing, traffic routing, observability, and security 등을 제공한다.

모든 Envoy는 트래픽을 수집하고 자체적으로 메트릭을 수집하는 일을 하기 때문에 시간이 갈수록 메모리 사용량이 늘어나게 된다고 한다. 그러므로 고도화 된 서비스 구현 시 envoy 코드를 수정하거나 응용해서 사용하는 일이 필요해 보인다.