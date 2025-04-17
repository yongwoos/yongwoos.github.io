---
title: kube-scheduler
weight: 2
---

## kube-scheduler가 하는 일
### kube-scheduler 역할 및 작동 방식

`kube-scheduler`는 새로 생성된 Pod을 클러스터 내 적절한 노드에 배치하는 역할을 담당하는 Kubernetes의 핵심 컴포넌트입니다.

> **한마디로:**
> "Pod을 실행할 최적의 노드를 결정하는 Kubernetes의 '심판' 같은 존재"

---

## kube-scheduler의 주요 역할
1. **새로운 Pod 감지**
  - `kube-apiserver`를 통해 아직 노드에 배정되지 않은 새 `Pod`을 감지함.
  - `spec.nodeName`이 비어 있는 Pod이 대상.

2. **적절한 노드 선택 (스케줄링)**
  - 클러스터 내 모든 노드를 평가하여 Pod을 실행하기에 가장 적합한 노드를 찾음.
  - CPU, 메모리, 네트워크, 라벨, 테인트/톨러레이션 등을 고려하여 결정.

3. **스케줄링 결과 전달**
  - 적절한 노드를 찾으면 `kube-apiserver`를 통해 Pod의 `spec.nodeName`을 업데이트.
  - `kubelet`이 이를 감지하고 Pod 실행을 시작함.

---

## kube-scheduler 작동 방식
### 스케줄링 단계
kube-scheduler는 Pod을 배정할 노드를 찾을 때 두 가지 주요 단계를 거침.

### 1단계: 필터링 (Filtering)
  - Pod이 실행될 수 없는 노드를 제외하는 과정.
  - 다음 조건을 기반으로 후보 노드를 거름:
    - **자원 부족** (CPU, 메모리, 디스크)
    - **테인트(Taint) & 톨러레이션(Toleration)** 불일치
    - **노드 셀렉터(nodeSelector) & 노드 어피니티(nodeAffinity)**
    - **Pod 간 상충되는 규칙 (예: Pod 안티 어피니티)**

### 2단계: 점수 계산 (Scoring)
  - 필터링된 노드들 중에서 가장 적절한 노드를 선택하기 위해 점수를 매김.
  - 고려 요소:
    - 리소스 사용량이 낮은 노드 선호
    - 특정 노드에 Pod을 집중 배치하는 전략
    - `PodSpreadConstraints`(Pod 분산 규칙)

### 결과
가장 높은 점수를 받은 노드가 최종 선택됨.

---

## 실제 예제
### 새로운 Pod 생성
다음과 같은 `nginx` Pod이 생성됨.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
   - name: nginx
    image: nginx
  nodeSelector:
   disktype: ssd
```

---

### kube-scheduler의 동작
#### (1) 필터링 단계
  - 클러스터에 `node1`, `node2`, `node3`이 있다고 가정.
  - `nodeSelector: disktype: ssd` 조건이 있는 Pod이므로, SSD가 아닌 노드는 제외됨.
  - `node1`이 `disktype: ssd`를 가지고 있어 후보로 남음.

#### (2) 점수 계산 단계
  - `node1`과 `node2`가 남았다고 가정.
  - 각 노드의 CPU, 메모리 상태를 고려하여 점수 부여:
    - `node1`: 80점 (CPU 50%, 메모리 40% 사용 중)
    - `node2`: 90점 (CPU 30%, 메모리 20% 사용 중)

#### (3) 최적 노드 선택
  - 점수가 가장 높은 `node2`가 선택됨.
  - `kube-apiserver`를 통해 `spec.nodeName: node2`가 설정됨.
  - `kubelet`이 이를 감지하고 Pod을 실행.

---

## 고급 기능
### 1. NodeSelector (노드 선택)
특정 라벨이 있는 노드에만 Pod을 배치하고 싶을 때 사용.

```yaml
spec:
  nodeSelector:
   disktype: ssd
```

---

### 2. Node Affinity (노드 선호 조건)
`nodeSelector`보다 더 유연한 정책을 제공하며, `requiredDuringScheduling`(필수)과 `preferredDuringScheduling`(선호) 옵션이 있음.

```yaml
spec:
  affinity:
   nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
       - key: disktype
        operator: In
        values:
        - ssd
```

---

### 3. Taints & Tolerations (테인트 & 톨러레이션)
특정 Pod만 특정 노드에 배치되도록 설정 가능.

```sh
kubectl taint nodes node1 dedicated=high-cpu:NoSchedule
```

이렇게 하면 `dedicated=high-cpu` 톨러레이션이 없는 Pod은 `node1`에 스케줄링되지 않음.

```yaml
spec:
  tolerations:
  - key: "dedicated"
   operator: "Equal"
   value: "high-cpu"
   effect: "NoSchedule"
```

---

## 정리
- `kube-scheduler`는 새로운 Pod을 감지하고 적절한 노드에 배치하는 역할을 담당.
- 필터링 단계(불가능한 노드 제외) → 점수 계산 단계(최적 노드 선택)를 거쳐 결정됨.
- NodeSelector, Node Affinity, Taints & Tolerations 등의 다양한 정책을 지원.

> **즉, kube-scheduler는 클러스터의 리소스를 효율적으로 활용하고 Pod을 최적의 위치에 배치하는 두뇌 역할을 한다!**
```