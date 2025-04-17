---
title: kube-controller-manager
weight: 4
---
# **Kubernetes `kube-controller-manager` 역할과 작동 방식**  

### **한 줄 요약**  
> "`kube-controller-manager`는 Kubernetes 리소스(Pod, Node, Service 등)의 상태를 지속적으로 감시하고, 원하는 상태(Desired State)로 유지되도록 자동 조정하는 컨트롤러들의 집합이다."  

---

## **1. `kube-controller-manager`의 주요 역할**  

**컨트롤러 매니저는 여러 개의 컨트롤러(Controller)를 관리하는 프로세스이며, 각 컨트롤러는 특정 리소스를 감시하고 관리하는 역할을 수행한다.**  
예를 들어, 노드가 다운되거나, Pod이 삭제되거나, ReplicaSet 개수가 줄어들면 자동으로 복구한다.  

---

## **2. 주요 컨트롤러 종류 및 역할**  

| 컨트롤러 | 역할 |
|----------|------|
| **Node Controller** | 노드 상태 감시 및 장애 감지 |
| **Replication Controller** | Pod 개수 조정 (ReplicaSet 관리) |
| **Deployment Controller** | 새로운 버전의 Pod 롤링 업데이트 및 롤백 |
| **StatefulSet Controller** | 상태 유지가 필요한 Pod 관리 |
| **DaemonSet Controller** | 각 노드에 하나씩 Pod을 배포 |
| **Job Controller** | 일회성 작업(Pod) 실행 및 완료 확인 |
| **Service Controller** | Service 오브젝트를 감시하고, 클라우드 로드밸런서 관리 |
| **PersistentVolume Controller** | 영구 저장소(PV, PVC) 상태 관리 |

---

## **3. `kube-controller-manager` 작동 방식 (예제)**  

### **Pod이 강제 삭제된 경우 (ReplicaSet 컨트롤러 동작)**  

1. **사용자가 Pod을 수동 삭제**  
```sh
kubectl delete pod nginx-pod
```

2. **kube-controller-manager가 변경 감지**  
- `etcd`를 모니터링하면서 기대 상태(ReplicaSet 개수)와 현재 상태를 비교.  
- 예상 개수보다 Pod이 부족하면 자동 복구.  

3. **새로운 Pod 자동 생성**  
```sh
kubectl get pods
```
- `ReplicaSet`이 존재하는 경우, 삭제된 Pod을 자동으로 다시 생성.  

---

### **노드 장애 발생 (Node Controller 동작)**  

1. **노드가 다운됨**  
   ```sh
   kubectl get nodes
   ```
   - 특정 노드의 상태가 `NotReady`로 변경됨.  

2. **`kube-controller-manager`가 일정 시간(기본 5분) 감시 후 해당 노드를 "Unreachable"로 표시**  

3. **해당 노드에 있던 Pod을 다른 노드로 이동 (스케줄러 재할당)**  

---

### **Deployment 롤링 업데이트 (Deployment Controller 동작)**  

1. **새로운 이미지로 업데이트 요청**  
```sh
kubectl set image deployment/nginx-deployment nginx=nginx:latest
```

2. **Deployment Controller가 점진적으로 새로운 Pod 배포**  
   ```sh
   kubectl rollout status deployment/nginx-deployment
   ```
   - 기존 Pod을 하나씩 제거하고 새로운 버전의 Pod을 생성함.  

3. **이전 버전으로 롤백 가능**  
```sh
kubectl rollout undo deployment/nginx-deployment
```

---

## **4. 정리 (전체 흐름)**  

1. `kube-controller-manager`는 etcd를 지속적으로 감시하며 Kubernetes 리소스(Pod, Node 등)의 변경 사항을 추적.  
2. 특정 리소스 상태가 기대 상태와 다르면 자동으로 조치 수행 (복구, 재배치, 삭제 등).  
3. 다양한 컨트롤러가 존재하며, 각 컨트롤러는 특정 Kubernetes 리소스를 책임지고 관리함.  
4. `kube-controller-manager`가 없으면 Kubernetes 리소스가 자동 복구되지 않고, 사용자가 직접 모든 변경을 관리해야 함.  

> **결론:** `kube-controller-manager`는 Kubernetes 클러스터의 **자율 조정(Self-Healing)** 기능을 담당하는 핵심 컴포넌트!