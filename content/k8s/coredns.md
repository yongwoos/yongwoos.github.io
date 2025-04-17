---
title: Core DNS
weight: 7
---
# **CoreDNS란? (Kubernetes의 DNS 서버)**
CoreDNS는 **쿠버네티스 클러스터 내부에서 DNS 서비스를 제공하는 기본 DNS 서버**다.  
각 Pod는 CoreDNS를 이용하여 **서비스 이름을 클러스터 IP로 변환**할 수 있다.  
쿠버네티스에서 기본적으로 사용되는 네임서버이며, 이전의 `kube-dns`를 대체한다.

---

## **CoreDNS가 하는 일**
**1. 서비스 이름을 클러스터 IP로 변환**  
**2. 외부 도메인 네임 해석 (예: google.com)**  
**3. 쿠버네티스 내부 도메인 관리 (`svc.cluster.local` 등)**  
**4. ConfigMap을 통해 동적 설정 변경 가능**  

---

## **1. CoreDNS가 서비스 이름을 클러스터 IP로 변환하는 과정**  
### **예제: `curl my-service:80` 요청 시**  
1. Pod가 `my-service`로 요청 → **DNS 쿼리 전송 (`my-service.default.svc.cluster.local`)**  
2. `kube-dns`(CoreDNS)가 `etcd`에서 `Service` 정보 조회  
3. `my-service`의 클러스터 IP (`10.96.0.50`)를 반환  
4. Pod가 클러스터 IP로 요청 전송 → `kube-proxy`가 적절한 Pod로 전달  

**`nslookup`으로 확인하기:**  
```sh
nslookup my-service.default.svc.cluster.local
```
출력 예시:
```
Server:  10.96.0.10
Address: 10.96.0.10#53
Name: my-service.default.svc.cluster.local
Address: 10.96.0.50
```
---

## **2. CoreDNS의 설정 확인 및 변경**
CoreDNS는 **ConfigMap**을 이용해 설정 가능  
```sh
kubectl get configmap -n kube-system coredns -o yaml
```
출력 예시:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```
**주요 옵션**  
- `kubernetes cluster.local` → 쿠버네티스 도메인 네임 해석  
- `forward . /etc/resolv.conf` → 외부 DNS 요청 전달  
- `cache 30` → DNS 캐싱(30초)  

---

## **3. CoreDNS 재시작 (설정 변경 후 반영)**
```sh
kubectl rollout restart deployment coredns -n kube-system
```

---

## **정리**
✔ **CoreDNS는 쿠버네티스의 내부 DNS 서버**  
✔ **서비스 이름을 클러스터 IP로 변환**  
✔ **ConfigMap으로 설정 변경 가능**  
✔ **외부 DNS도 처리 가능 (Google, Cloudflare 등)**  
✔ **DNS 캐싱을 통해 성능 최적화**  

> **쿠버네티스 내부에서 서비스 간 통신이 원활하게 이루어지는 핵심 컴포넌트!**