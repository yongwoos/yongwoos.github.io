---
title: Probe
weight: 17
---
## Probes
liveness probe: 컨테이너가 실행하는 애플리케이션이 정상인지 판단
- 오류가 발생한 애플리케이션이 종료되지 않고 실행되는 것을 확인하기 위해 주기적으로 검사한다

readiness probe: 컨테이너가 실행하는 애플리케이션이 서비스를 시작할 준비가 되었는지, 완료된 애플리케이션을 네트워크에 연결해 주기 위해
- readiness probe의 검사에 성공하면 쿠버네티스는 해당 파드를 네트워크에 연결한다. 성공하면 더 이상 검사를 하지 않는다

startup probe: 애플리케이션이 주어진 시간 내에 시작했는지를 판단

```
startup probe 확인 -> readiness probe, liveness probe
```

## Graceful Shutdown
어떤 파드를 종료하기 직전에 사용자 요청이 도달하면 응답을 주지 못한 채 파드가 종료된다. 이를 방지하기 위해 사용

- rolling update 시 발생하는 공백을 메꿀 수 있는 가용성 있는 환경 조성 가능
  - readiness probe + graceful shutdown을 함께 사용하면 기존 파드의 응답을 보장하면서 새로운 파드가 충분히 준비가 된 후 사용자 응답을 받게 할 수 있음
  - 기존 파드의 응답과 새로운 파드의 초기화 시간을 보장