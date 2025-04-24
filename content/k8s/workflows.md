---
title: Pod/Deployment 생성흐름 비교
weight: 15
---
### Pod와 Deployment 실행시의 scheduler와 controller의 작동 시점이 다르다
**Pod 단독 생성**과 **Deployment로 Pod 생성**은 흐름의 **출발점**이 다르기 때문에  
`Scheduler`와 `Controller`의 작동 시점도 달라짐

---

### 1. **단일 Pod 생성** 시 흐름

- `kubectl apply -f pod.yaml`
- 바로 **Pod 객체**가 `API Server`에 생성됨
- 이 Pod는 **아직 노드에 바인딩되지 않았기 때문에**
  -  **Scheduler가 즉시 개입**해서 노드를 할당합니다
- 그 후, 해당 노드의 `kubelet`이 파드를 실행함

>  즉, Pod → Scheduler → Node (Kubelet)

---

### 2. **Deployment 생성** 시 흐름

- `kubectl apply -f deployment.yaml`
- 먼저 **Deployment 객체**가 생성되고, 그걸 기반으로
  - **Deployment Controller**가 작동해서
  - ReplicaSet 생성 → ReplicaSet Controller가 파드 생성
- 이때 만들어진 **Pod**는 여전히 노드에 바인딩되지 않아서
  -  그제서야 **Scheduler**가 개입해서 파드 스케줄링

>  즉, Deployment → ReplicaSet → Pod → Scheduler → Node (Kubelet)

---

###  요약 비교

| 구분 | 단일 Pod | Deployment |
|------|-----------|------------|
| 최초 리소스 | Pod | Deployment |
| 첫 동작 주체 | Scheduler | Deployment Controller |
| Scheduler 작동 시점 | 즉시 (Pod 생성 직후) | 파드가 ReplicaSet에서 생성된 후 |
| Controller 개입 | 없음 | Deployment Controller → ReplicaSet Controller |

---

###  그래서 언제 어떤 흐름?

- 단일 Pod: 빠르게 테스트하거나 임시 워크로드 실행 시
- Deployment: **스케일링, 롤링 업데이트, 자가 복구 등**을 원할 때 사용