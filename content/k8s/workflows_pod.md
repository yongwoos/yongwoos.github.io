---
title: Pod 생성 흐름
weight: 14
---
쿠버네티스에서 **파드 생성 요청**이 들어왔을 때 **Master Node와 Worker Node의 구성 요소들(kubelet, apiserver, etcd, controller, scheduler)**이 어떻게 동작하는지


### 예시 상황: 사용자가 `kubectl apply -f pod.yaml` 명령어로 파드 생성 요청
## 전체 단계 요약

1. **kubectl → API Server**  
2. **API Server → etcd 저장**  
3. **API Server → Scheduler로 전달**  
4. **Scheduler → 선택된 Node에 binding**  
5. **API Server → Controller Manager 감지 → 생성 요청 생성**  
6. **Kubelet → API Server로부터 파드 정보 수신**  
7. **Kubelet → 컨테이너 런타임(Containerd, Docker 등)에게 컨테이너 생성 요청**  
8. **파드 실행 완료 → 상태를 API Server에 보고**

## 단계별 상세 흐름

### 1️⃣ `kubectl apply` → `API Server`
- 사용자가 `kubectl`로 파드 정의를 요청하면, `kubectl`은 `kube-apiserver`에 HTTP 요청을 보냄.
- **kube-apiserver**는 클러스터의 **프론트 도어 역할**을 수행.

---

### 2️⃣ API Server → etcd에 저장
- `kube-apiserver`는 요청된 리소스(Pod 객체)를 **검증** 후, 클러스터 상태를 저장하는 **etcd**에 해당 객체를 저장.

---

### 3️⃣ API Server → Scheduler로 전달
- 새로운 Pod 객체는 아직 어떤 노드에도 **스케줄링되지 않은 상태**.
- `kube-apiserver`는 이를 감지한 **kube-scheduler**에게 전달.

---

### 4️⃣ Scheduler → 노드 선택 및 Binding
- **kube-scheduler**는 파드의 요구사항(CPU, 메모리, nodeSelector 등)을 고려해 **적절한 노드 선택**.
- 선택된 노드 정보를 포함해 다시 `kube-apiserver`에 **Binding 객체**로 전달.

---

### 5️⃣ Controller Manager → 파드 생성 감지
- `kube-controller-manager`는 파드가 생성되었지만 아직 실행되지 않은 상태임을 감지.
- 필요한 리소스(예: ReplicaSet 등)가 있는 경우 이에 대한 조치를 함.

---

### 6️⃣ Kubelet (선택된 노드) → API Server로부터 파드 사양 수신
- **해당 노드의 kubelet**은 `kube-apiserver`에서 자신에게 스케줄된 파드를 **watch** 중.
- 파드 생성 요청이 자신에게 도착한 것을 감지하고 파드 사양을 가져옴.

---

### 7️⃣ Kubelet → Container Runtime에 파드 실행 요청
- `kubelet`은 파드의 컨테이너를 실행하기 위해 **컨테이너 런타임(Containerd, Docker 등)**에 요청.

---

### 8️⃣ 파드 실행 완료 → 상태 보고
- 파드가 실행되면, `kubelet`은 실행 상태를 `kube-apiserver`에 주기적으로 보고.
- `kubectl get pods` 명령 시, 이 정보가 사용자에게 표시됨.

---

## 시각화한 흐름도 (텍스트)

```
[User] 
   ↓ kubectl apply
[API Server] 
   ↓ 저장
[etcd] 
   ↑
[Scheduler] ← (watching unscheduled Pods)
   ↓
[API Server] ← Binding 정보
   ↓
[Controller Manager]
   ↓
[Kubelet on Node (선택됨)]
   ↓
[Container Runtime (Docker, containerd)]
   ↓
[Pod 실행 완료]
   ↑
[API Server에 상태 보고]
```