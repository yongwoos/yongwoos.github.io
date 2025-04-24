---
title: iptables
weight: 8
---
# **iptables란? (Kubernetes에서 트래픽을 라우팅하는 핵심 구성 요소)**  
`iptables`는 리눅스에서 패킷 필터링 및 네트워크 주소 변환(NAT)을 수행하는 **방화벽 및 패킷 처리 도구**다.  
쿠버네티스에서는 **kube-proxy가 iptables 규칙을 설정하여 서비스 트래픽을 적절한 Pod로 라우팅**한다.  

---

## **Kubernetes에서 iptables 역할**
 **1. 서비스의 클러스터 IP(가상 IP)를 Pod의 실제 IP로 매핑**  
 **2. NodePort 서비스의 트래픽을 적절한 노드의 Pod로 전달**  
 **3. 외부에서 들어오는 요청을 내부 Pod로 전달 (DNAT 적용)**  
 **4. Pod 간 통신을 제어하여 네트워크 정책 적용 가능**  

---

## **1. iptables를 활용한 서비스 트래픽 흐름**  
### **서비스 생성 후 iptables 변화 예제**  
```sh
kubectl apply -f my-service.yaml
```
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
- `my-service`가 생성되면 `kube-proxy`가 iptables 규칙을 설정  

---

## **2. iptables 규칙 확인**
### **iptables NAT 테이블 확인**
```sh
iptables -t nat -L -n -v | grep my-service
```
출력 예시:
```
DNAT       tcp  --  0.0.0.0/0   10.96.0.50  tcp dpt:80 -> 10.244.1.10:8080
DNAT       tcp  --  0.0.0.0/0   10.96.0.50  tcp dpt:80 -> 10.244.2.15:8080
```
**해석:**  
- `10.96.0.50` (my-service의 Cluster IP)로 들어온 요청을 **Pod IP(10.244.1.10, 10.244.2.15)로 전달**  
- `targetPort: 8080`에 맞춰 변환됨  

### **iptables 필터 테이블 확인**
```sh
iptables -t filter -L -n -v
```
- Pod 간 통신이 허용되는지 확인 가능  

---

## **3. iptables 기반 트래픽 흐름 예제**
### **`my-service`로 요청을 보낼 때 흐름**
1. `curl my-service:80` 요청 시, **DNS 조회를 통해 클러스터 IP(10.96.0.50) 획득**  
2. **iptables NAT 규칙을 확인하여 요청을 Pod IP(10.244.1.10:8080)로 포워딩**  
3. `kube-proxy`가 `iptables`을 사용하여 **트래픽을 적절한 Pod로 전달**  
4. **Pod에서 응답 후 클라이언트로 반환**  

---

## **4. iptables 기반 NodePort 동작 방식**
```sh
kubectl expose deployment my-app --type=NodePort --port=80 --target-port=8080
```
NodePort를 사용하면 **모든 노드의 특정 포트(예: 30080)에서 트래픽을 받을 수 있음**  

### **iptables NAT 규칙 예제**
```sh
iptables -t nat -L -n -v | grep 30080
```
```
DNAT       tcp  --  0.0.0.0/0   192.168.56.101  tcp dpt:30080 -> 10.244.1.10:8080
```
**해석:**  
- `192.168.56.101:30080`으로 들어온 요청을 **Pod(10.244.1.10:8080)로 전달**  

---

## **정리**
✔ **쿠버네티스는 `kube-proxy`를 통해 iptables 규칙을 자동 설정**  
✔ **ClusterIP 서비스는 가상 IP를 통해 Pod로 트래픽을 라우팅**  
✔ **NodePort 서비스는 모든 노드의 특정 포트를 통해 접근 가능**  
✔ **iptables NAT을 활용하여 패킷의 목적지를 Pod로 변경**  

>  **iptables는 Kubernetes 서비스 라우팅의 핵심 역할을 수행**