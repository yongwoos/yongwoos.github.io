---
title: kube-apiserver
weight: 3
---
# **Kubernetes API Server (`kube-apiserver`)의 역할과 작동 방식**  

## **한 줄 요약**  
> "`kube-apiserver`는 Kubernetes의 중심 허브로, 클러스터의 모든 컴포넌트와 통신하는 **게이트웨이(API 엔드포인트)** 역할을 한다."

---

## **kube-apiserver의 주요 역할**  

### 1. **Kubernetes API 엔드포인트 제공**  
- 사용자가 `kubectl`, REST API, 또는 대시보드 등을 통해 요청하면 이를 받아들여 처리함.  
- 예제:  
  ```sh
  kubectl get pods
  ```
  - `kubectl` → `kube-apiserver`에 요청  
  - `kube-apiserver` → etcd에서 데이터를 가져옴  
  - 응답 반환  

###  2. **클러스터 상태 관리 (etcd와 통신)**  
- 클러스터의 모든 상태 정보를 `etcd`(Kubernetes의 키-값 저장소)에 저장하고 관리.  
- 새로운 리소스(Pod, Service 등)가 생성되면 이를 `etcd`에 기록.  

###  3. **인증 & 인가 (Authentication & Authorization)**  
- 사용자가 `kubectl apply`로 리소스를 생성하려 하면,  
  1. **인증(Authentication)**: 사용자가 누구인지 확인 (예: `kubeconfig`에 등록된 사용자).  
  2. **인가(Authorization)**: 해당 사용자가 요청한 작업을 할 권한이 있는지 확인 (RBAC 적용).  

###  4. **Admission Controller 적용**  
- 새로운 리소스 요청이 올 때, 정책을 적용해 검증 및 변환.  
- 예제: 특정 네임스페이스에만 Pod이 생성되도록 제한하는 정책 적용.  

###  5. **Kubernetes 컴포넌트와 통신 (컨트롤러, 스케줄러, kubelet 등)**  
- `kube-controller-manager`, `kube-scheduler`, `kubelet` 등과 통신하여 클러스터가 정상 작동하도록 조율.  

---

## **작동 방식 (예제)**  

### **`kubectl apply`로 Pod 생성**  
```sh
kubectl apply -f nginx-pod.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx
      image: nginx
```

### **kube-apiserver의 동작 흐름**  
1. **요청을 받음**  
   - 사용자가 Pod 생성 요청을 보냄.  
   - `kubectl` → `kube-apiserver` → `etcd`  

2. **인증 & 인가**  
   - 사용자의 ID를 확인 (`kubeconfig`)  
   - RBAC(Role-Based Access Control)로 권한 체크  

3. **Admission Controller 실행**  
   - Pod의 리소스 제한, 네트워크 정책 적용  

4. **`etcd`에 저장**  
   - 유효한 요청이면 Pod을 `etcd`에 저장  

5. **컨트롤러 및 스케줄러 호출**  
   - `kube-controller-manager`가 Pod을 감지하고 관리  
   - `kube-scheduler`가 적절한 노드에 배치  

6. **kubelet이 최종 실행**  
   - 스케줄링된 노드의 `kubelet`이 Pod을 실행  

---

## **고급 기능**  

### 1. **API 요청 확인 (`kubectl proxy`)**  
- API 서버와 직접 통신해볼 수 있음.  
```sh
kubectl proxy
```
```sh
curl http://localhost:8001/api/v1/pods
```

### 2. **etcd 데이터 확인**
```sh
kubectl exec -it etcd-container -- sh
etcdctl get /registry/pods --prefix --keys-only
```

###  3. **Role-Based Access Control (RBAC)**  
- 특정 사용자가 특정 네임스페이스의 Pod을 관리할 수 있도록 설정 가능.  

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

---

## **정리**  
- `kube-apiserver`는 **Kubernetes의 중심 허브**로, 클러스터의 모든 요청을 처리하고 `etcd`에 저장함.  
- **인증 & 인가, Admission Controller 적용, 컨트롤러 및 스케줄러와 통신**하는 핵심 역할 수행.  
- **REST API를 제공**하여 모든 Kubernetes 리소스를 관리하고 조작하는 역할을 함.  

> **즉, `kube-apiserver` 없이는 Kubernetes 클러스터가 동작할 수 없다!**
## 파드 할당 워크플로우
#  **Kubernetes API Server를 통한 Pod 생성 과정**  

### **한 줄 요약**  
> `kubectl apply` → `kube-apiserver` → `etcd` 저장 → `kube-scheduler` → `kubelet` → Pod 실행  

---

## **1. `kubectl apply`로 Pod 생성 요청**  

```sh
kubectl apply -f nginx-pod.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx
      image: nginx
```

사용자가 `kubectl apply`로 Pod을 생성하면, `kubectl`이 `kube-apiserver`로 요청을 보냄.  

---

## **2. `kube-apiserver`가 요청 처리**  

1. **인증(Authentication)**  
   - 사용자의 신원을 확인 (`kubeconfig` 기반).  
   - 예: Service Account, 인증서, OIDC, 베이직 인증 등 사용.  

2. **인가(Authorization)**  
   - 사용자가 Pod을 생성할 권한이 있는지 체크 (RBAC, ABAC).  
   - RBAC 정책 예시:
     ```yaml
     kind: Role
     apiVersion: rbac.authorization.k8s.io/v1
     metadata:
       namespace: default
       name: pod-creator
     rules:
     - apiGroups: [""]
       resources: ["pods"]
       verbs: ["create", "get", "list"]
     ```

3. **Admission Controller 적용**  
   - 리소스 할당 제한, 보안 정책 검토  
   - 예: PodSecurityPolicy, MutatingWebhook  

4. **요청을 `etcd`에 저장**  
   - `kube-apiserver`가 검증을 통과하면 Pod 정보를 `etcd`에 저장  
   - 저장된 내용 확인:  
     ```sh
     kubectl get pods nginx-pod -o yaml
     ```

---

## **3. `kube-scheduler`가 Pod 배치**  

1. `kube-scheduler`가 `etcd`에서 "스케줄되지 않은 Pod" 검색  
   ```sh
   kubectl get pods --field-selector=status.phase=Pending
   ```

2. 적절한 노드를 선택해 Pod을 배치  
   - CPU, 메모리, 라벨, 노드 셀렉터 등의 조건을 고려  
   - 스케줄링된 Pod 정보는 `etcd`에 업데이트됨.  

---

## **4. `kubelet`이 Pod 실행**  

1. `kubelet`이 `kube-apiserver`에서 자신의 노드에 할당된 Pod 목록을 조회  
   ```sh
   kubectl get pods -o wide
   ```

2.  `kubelet`이 컨테이너 런타임(예: `containerd`)을 통해 실제 컨테이너 실행  
   ```sh
   crictl ps
   ```

3. Pod가 정상적으로 실행되었는지 상태 업데이트 (`etcd` 반영)  
   ```sh
   kubectl get pods
   ```

---

##  **최종 정리 (전체 과정)**  

1. `kubectl apply` → `kube-apiserver`가 요청 받음  
2. `kube-apiserver`가 인증/인가 후 `etcd`에 저장  
3. `kube-scheduler`가 적절한 노드에 배치  
4. `kubelet`이 Pod을 실행하고 상태를 업데이트  
5.  `kubectl get pods`로 실행 여부 확인  

>  **결론:** `kube-apiserver`는 클러스터의 모든 요청을 조율하며, etcd와 통신하여 리소스 상태를 관리함.

## 참고사이트
[Kubernetes Cluster & Process Flow of a POD creation](https://belowthemalt.com/2022/04/08/kubernetes-cluster-process-flow-of-a-pod-creation/)

## 파드생성 워크플로우
![](https://i0.wp.com/belowthemalt.com/wp-content/uploads/2022/04/image-3.png?resize=1100%2C428&ssl=1)