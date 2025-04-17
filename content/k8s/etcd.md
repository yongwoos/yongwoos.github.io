---
title: etcd
weight: 5
---
#  **etcd란? (Kubernetes에서의 역할)**  

###  **한 줄 요약**  
> `etcd`는 **Kubernetes의 모든 상태(State)를 저장하는 분산 키-값 저장소**이며, 클러스터의 구성 정보, 노드 상태, Pod 정보 등을 관리하는 핵심 데이터 저장소다.  

---

##  **1. etcd의 역할 (Kubernetes에서 어떻게 사용되나?)**  

Kubernetes는 클러스터 상태를 유지하기 위해 etcd를 사용한다.  
- **컨트롤 플레인의 모든 구성 요소(`kube-apiserver`, `kube-scheduler`, `kube-controller-manager`)가 etcd와 직접 통신**  
- etcd가 다운되면 **클러스터의 상태를 저장할 수 없으며, 새로운 리소스를 만들거나 업데이트할 수 없음**  

###  **Kubernetes에서 etcd가 저장하는 정보**  
| 저장 데이터 | 설명 |
|------------|------|
| **Pod 정보** | 생성된 Pod의 상태, IP, 네임스페이스 등 |
| **Node 정보** | 노드의 리소스 사용량, 상태 (`Ready`, `NotReady`) |
| **Service 정보** | Service 오브젝트와 Endpoint 매핑 |
| **ConfigMap & Secret** | 환경 변수, 보안 정보 저장 |
| **RBAC 정보** | 사용자 권한 및 역할(Role-based Access Control) |
| **Network Policy** | 네트워크 정책 및 규칙 |

---

##  **2. etcd 작동 방식 (예제)**  

### **`kubectl apply`로 리소스 생성 → etcd 저장**  
```sh
kubectl apply -f nginx-pod.yaml
```
1. `kubectl` → `kube-apiserver`에 요청 전송  
2. `kube-apiserver` → etcd에 데이터 저장  
3. `kube-scheduler`, `kube-controller-manager`가 etcd를 감시하여 Pod 배치  

---

### **etcd에 직접 데이터 저장 및 조회 (실제 데이터 확인하기)**  

#### **1) etcd 데이터 확인**  
**etcdctl**을 사용하여 저장된 데이터를 확인할 수 있음.  
```sh
ETCDCTL_API=3 etcdctl get / --prefix --keys-only
```
- 현재 저장된 모든 키를 조회  
- 예: `/registry/pods/default/nginx-pod`

#### **2) 특정 Pod의 상태 조회**  
```sh
ETCDCTL_API=3 etcdctl get /registry/pods/default/nginx-pod -w json
```
- 해당 Pod의 상태(JSON) 반환

#### **3) etcd 백업하기**  
```sh
ETCDCTL_API=3 etcdctl snapshot save backup.db
```

---

## **3. etcd 장애 발생 시 영향 및 복구 방법**  

### **etcd 장애 발생 시 영향**  
- `kube-apiserver`가 etcd에 접근할 수 없으면 클러스터 상태를 저장/조회할 수 없음.  
- 클러스터는 **기존 Pod을 실행할 수 있지만, 새로운 Pod을 생성하거나 변경할 수 없음.**  
- etcd 장애 복구 없이 클러스터를 유지하려면 `kubelet`이 실행 중이어야 함.  

---

### **etcd 장애 복구 방법**  

#### **(1) etcd 백업에서 복구**  
```sh
ETCDCTL_API=3 etcdctl snapshot restore backup.db
```

#### **(2) etcd 클러스터 재구성 (다중 노드 etcd 사용 시)**  
```sh
ETCDCTL_API=3 etcdctl member list
```
- 살아있는 etcd 노드를 확인하고 장애 노드를 제거  

```sh
ETCDCTL_API=3 etcdctl member remove <MEMBER_ID>
```
- 장애가 발생한 etcd 노드를 제거한 후 새로운 etcd 노드를 추가  

```sh
ETCDCTL_API=3 etcdctl member add new-node --peer-urls=http://new-node-ip:2380
```

---

## **4. 정리 (etcd의 역할과 중요성)**  

✔ **etcd는 Kubernetes의 "데이터베이스"** 역할을 하며, 클러스터의 모든 상태 정보를 저장함.  
✔ `kube-apiserver`는 etcd를 통해 Kubernetes 리소스를 읽고/쓰며, 모든 컨트롤 플레인 컴포넌트는 etcd 데이터를 기반으로 동작함.  
✔ etcd 장애 발생 시 **클러스터 관리는 중단되며, 복구하지 않으면 새로운 리소스 생성 및 변경 불가능**  
✔ etcd 백업과 복구 전략이 중요하며, 정기적인 스냅샷을 유지해야 함.  

> **결론:** etcd는 Kubernetes의 **심장부**이며, 안정적인 etcd 운영이 Kubernetes 클러스터의 가용성을 좌우한다!