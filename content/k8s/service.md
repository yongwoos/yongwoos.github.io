---
title: Service
weight: 6
---
# **Kubernetes에서 Service가 생성될 때 일어나는 변화**  

Kubernetes에서 새로운 **Service**가 생성되면 다음과 같은 변화가 일어난다.  

---

## 📌 **1. 서비스 생성 요청 → etcd 저장**  
```sh
kubectl apply -f my-service.yaml
```
위 명령을 실행하면, `kube-apiserver`가 요청을 받아들이고 **Service 리소스 정보를 etcd에 저장**한다.  

**예제: my-service.yaml**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```
- `app: my-app` 레이블을 가진 Pod들을 대상으로 서비스 생성  
- 클라이언트가 **80번 포트**로 요청하면, 내부적으로 **8080번 포트로 전달**  

---

## 📌 **2. `kube-controller-manager`가 etcd 변경 감지 → Endpoint 업데이트**  
- **Service가 생성되면 `kube-controller-manager`는 etcd의 변경사항을 감지**  
- 해당 Service의 `selector`와 일치하는 Pod을 찾아 **Endpoint를 생성**  

### **예제: 엔드포인트 자동 생성**
```sh
kubectl get endpoints my-service -o yaml
```
```yaml
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 10.244.1.10
      - ip: 10.244.2.15
    ports:
      - port: 8080
```
> 🚀 **결과:** `my-service`는 `10.244.1.10:8080`, `10.244.2.15:8080`으로 트래픽을 분배  

---

## 📌 **3. kube-proxy가 변경 감지 → iptables/ipvs 업데이트**  
- `kube-proxy`는 `kube-apiserver`에서 서비스 정보를 가져와 **iptables/ipvs 규칙을 생성**  
- 클러스터 내부에서 `my-service`로 트래픽을 보내면, `kube-proxy`가 **적절한 Pod로 요청을 라우팅**  

### **예제: iptables 규칙 확인**  
```sh
iptables -t nat -L -n -v | grep my-service
```
```
DNAT       tcp  --  0.0.0.0/0   10.96.0.50  tcp dpt:80 -> 10.244.1.10:8080
DNAT       tcp  --  0.0.0.0/0   10.96.0.50  tcp dpt:80 -> 10.244.2.15:8080
```
> **결과:** `10.96.0.50`(클러스터IP)로 들어온 요청이 두 개의 Pod로 분산됨  

---

## 📌 **4. 클라이언트가 `my-service`로 요청하면?**  
### 1️⃣ 클러스터 내부에서 요청 (`curl my-service:80`)  
1. `my-service:80`으로 요청하면, 클러스터 DNS(`CoreDNS`)가 **서비스의 클러스터 IP(예: 10.96.0.50)를 반환**  
2. `kube-proxy`가 **해당 IP를 실제 Pod IP로 변환 후 트래픽을 전달**  
3. Pod가 요청을 처리하고 응답 반환  

### 2️⃣ 외부에서 요청 (`kubectl port-forward` 또는 LoadBalancer 사용)  
1. **NodePort or LoadBalancer 서비스라면**, 외부 클라이언트가 직접 노드의 공개된 포트로 접근 가능  
2. `kube-proxy`가 요청을 받아 적절한 Pod로 라우팅  

---

## ✅ **정리: Service 생성 시 발생하는 변화**  
✔ **1. `kubectl apply` 실행** → `kube-apiserver`가 요청을 받아 etcd에 저장  
✔ **2. `kube-controller-manager` 감지** → `Endpoints` 리소스 생성  
✔ **3. `kube-proxy` 감지** → `iptables/ipvs` 규칙 업데이트  
✔ **4. 클라이언트 요청 시** → `kube-proxy`가 트래픽을 적절한 Pod로 전달  

> 🚀 **결론:** Kubernetes의 Service는 `etcd`, `kube-controller-manager`, `kube-proxy`가 협력하여 동적으로 라우팅을 설정하고 관리한다!