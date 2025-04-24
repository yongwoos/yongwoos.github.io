---
title: etcd 흐름
weight: 16
---
Kubernetes에서 `etcd`는 **클러스터의 모든 상태(state)**를 저장하는 **단일 소스의 진실(Single Source of Truth)** 이기 때문에,  
리소스가 생성되거나 변경될 때마다 적절한 시점에 **etcd에 기록(persist)**

## etcd 기록이 발생하는 핵심 원리

- **모든 기록은 `kube-apiserver`를 통해서만 발생**
- 리소스가 생성, 수정, 삭제될 때 → `kube-apiserver`는 etcd에 저장 (PUT/DELETE)
- 반대로, 읽을 때는 etcd에서 가져오거나 캐시된 값을 반환


## 단계별 etcd 기록 위치 (Deployment 기준)

아래는 Deployment를 통해 파드가 생성되는 전 과정을 기준으로 `etcd 기록` 타이밍을 정리한 것:

### 1️⃣ 사용자: `kubectl apply -f deployment.yaml`

- **etcd 기록 발생**  
  - `Deployment` 리소스가 `kube-apiserver`에 전달 → 유효성 검사 → etcd에 저장됨  
  - `Deployment` 객체가 etcd에 기록

### 2️⃣ `kube-controller-manager`: Deployment 감지 → ReplicaSet 생성

- **etcd 기록 발생**  
  - 새로 생성된 `ReplicaSet` 객체도 `kube-apiserver`를 통해 etcd에 저장됨  
  - `ReplicaSet` 객체가 etcd에 기록


### 3️⃣ ReplicaSet Controller: 파드 N개 생성

- **etcd 기록 발생 (N번)**  
  - 각 Pod 객체도 `kube-apiserver`로 전달되어 etcd에 저장됨  
  - `Pod` 객체들이 etcd에 기록됨


### 4️⃣ `kube-scheduler`: 파드에 Node를 바인딩

- **etcd 기록 발생 (N번)**  
  - `kube-scheduler`는 각 Pod에 대해 **binding 정보(PodSpec.nodeName)**를 업데이트  
  - 이 업데이트 역시 `kube-apiserver`를 통해 etcd에 반영됨  
  - 각 Pod의 `nodeName` 필드가 업데이트되어 etcd에 다시 저장됨


### 5️⃣ `kubelet`: 파드 실행 후 상태 보고

- **etcd 기록 발생 (주기적)**  
  - `kubelet`은 주기적으로 파드의 상태(Ready, Running 등)를 `kube-apiserver`에 보고  
  - 이 상태 변경은 etcd에도 저장됨  
  - `PodStatus`가 etcd에 지속적으로 갱신됨


## 요약표

| 단계 | 리소스 | etcd 기록 여부 |
|------|--------|----------------|
| 1. Deployment 생성 | Deployment | ✅ 저장됨 |
| 2. ReplicaSet 생성 | ReplicaSet | ✅ 저장됨 |
| 3. Pod 생성 | Pod | ✅ 저장됨 (N개) |
| 4. 스케줄링 | Pod (nodeName 업데이트) | ✅ 저장됨 |
| 5. 실행 후 상태 보고 | PodStatus | ✅ 저장됨 (주기적으로 갱신) |

---

### 한마디 요약:

> **"모든 객체 상태 변화는 kube-apiserver를 통해 etcd에 저장된다."**