---
title: Deployment 생성 흐름
weight: 14
---
![](/images/pod_workflows.png)
**Kubernetes에서 Deployment 리소스를 생성할 때 전체 동작 과정**을 설명
여기서도 **API Server, etcd, Controller, Scheduler, Kubelet** 등이 어떻게 협력하는지 단계별로


## 예시 상황: `kubectl apply -f deployment.yaml` 실행

---

## 전체 구성요소 참여자
- **kubectl**: 사용자 인터페이스
- **API Server**: 모든 요청의 입구
- **etcd**: 클러스터 상태 저장
- **Controller Manager (Deployment Controller, ReplicaSet Controller)**
- **Scheduler**: 파드를 적절한 노드에 할당
- **Kubelet**: 파드를 실제 실행
- **Container Runtime**: Docker, containerd 등

---

## 단계별 흐름

### 1️⃣ `kubectl` → `API Server`
- 사용자가 `deployment.yaml`로 Deployment 생성 요청
- `kubectl apply`는 YAML을 HTTP 요청으로 `kube-apiserver`에 전송

---

### 2️⃣ `API Server` → `etcd`
- `kube-apiserver`는 Deployment 객체의 유효성을 검사한 뒤, `etcd`에 저장

---

### 3️⃣ Deployment Controller 감지
- `kube-controller-manager` 안의 **Deployment Controller**가 새로운 Deployment 리소스를 감지
- 원하는 상태(`replicas: 3`)와 현재 상태(`replicas: 0`)를 비교

---

### 4️⃣ ReplicaSet 생성
- Deployment Controller는 적절한 **ReplicaSet**을 생성함
  - 이름 예: `nginx-deployment-6d4cf56db6`
- ReplicaSet도 `API Server`에 전달 → `etcd`에 저장됨

---

### 5️⃣ ReplicaSet Controller 감지
- **ReplicaSet Controller**는 새로운 ReplicaSet을 감지
- 원하는 수의 파드 (예: 3개)를 생성해야 함을 인식

---

### 6️⃣ ReplicaSet → Pod 객체 생성
- ReplicaSet은 지정된 수의 **Pod 객체 생성 요청**을 `API Server`에 보냄
- 각각의 파드는 아직 스케줄되지 않은 상태로 생성됨

---

### 7️⃣ Scheduler → Pod에 Node 할당
- `kube-scheduler`는 스케줄링되지 않은 파드들을 감지
- 조건에 맞는 **노드를 선택**해 각 파드에 Binding 생성

---

### 8️⃣ Kubelet → API Server에서 파드 수신
- 각 노드의 `kubelet`은 `API Server`를 **watch** 중
- 자신에게 할당된 파드를 수신 후, 컨테이너 런타임에게 실행 요청

---

### 9️⃣ 컨테이너 실행 완료 → 상태 보고
- 파드가 실행되면 `kubelet`은 파드 상태를 `kube-apiserver`에 지속적으로 보고

---

## 텍스트 흐름도

```
[User (kubectl)] 
   ↓ apply
[API Server]
   ↓ 저장
[etcd]
   ↑
[Deployment Controller]
   ↓ 생성
[ReplicaSet]
   ↓ 생성
[Pods (미할당 상태)]
   ↓
[Scheduler]
   ↓
[Pods에 Node 바인딩]
   ↓
[Kubelet (on 각 Node)]
   ↓
[Container Runtime (Docker, containerd)]
   ↓
[Pod 실행 완료]
   ↑ 상태 보고
[API Server]
```

---

## 참고 개념: Deployment는 무엇을 자동화하나?

- **ReplicaSet 관리 자동화**
- **롤링 업데이트 자동화**
- **버전 관리 및 롤백 기능 포함**
- 즉, 사용자가 파드 3개를 직접 생성하는 대신, Deployment가 이를 **추상화**하여 관리

#### 참고
[컨트롤러가 협업하는 법](https://blog.naver.com/ds4ouj/223458438442)