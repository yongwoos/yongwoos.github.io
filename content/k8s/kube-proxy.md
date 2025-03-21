---
title: kube-proxy
weight: 1
---
## kube-proxy가 하는일
`kube-proxy`는 Kubernetes에서 각 노드에서 실행되는 네트워크 프록시로, **Service의 가상 IP(ClusterIP)를 실제 Pod의 IP로 연결하는 역할**을 합니다. Kubernetes의 네트워킹 모델을 지원하는 핵심 구성 요소 중 하나이며, 다음과 같은 기능을 수행합니다.  

---

## 🛠 주요 역할
### 1. **서비스 로드 밸런싱**
   - Kubernetes의 `Service`는 여러 개의 `Pod`을 하나의 엔드포인트로 제공하는데, `kube-proxy`는 `iptables` 또는 `IPVS`를 이용해 **트래픽을 적절한 Pod으로 라우팅**합니다.
   - 클라이언트가 `ClusterIP`(가상 IP)로 요청을 보내면, `kube-proxy`가 이를 적절한 `Pod IP`로 전달합니다.

### 2. **트래픽 포워딩**
   - 노드에 도착한 패킷을 적절한 **Pod으로 전달**합니다.
   - `kube-proxy`는 `iptables`, `IPVS`, `user-space` 모드를 사용하여 패킷을 포워딩합니다.

### 3. **서비스 정책 적용**
   - Kubernetes `Service`의 **SessionAffinity**(고정 연결) 등의 정책을 지원합니다.
   - 특정 클라이언트 요청이 항상 같은 Pod으로 가도록 설정 가능.

---

## 🔍 작동 방식 (모드별 차이)
### 1️⃣ **iptables 모드 (기본)**
   - **iptables 규칙을 설정하여 트래픽을 라우팅**합니다.
   - 각 `Service`에 대해 `iptables` 체인을 생성하고, 요청이 들어오면 해당 체인에 따라 적절한 `Pod`으로 전달됩니다.
   - 성능이 우수하며, 기본적으로 많이 사용됨.

### 2️⃣ **IPVS (IP Virtual Server) 모드**
   - `ipvsadm`을 사용하여 Linux 커널의 **IPVS 기능을 활용**(L4 Load Balancer).
   - `iptables`보다 더 효율적이며, 대규모 트래픽 처리에 적합.
   - `kube-proxy` 실행 시 `--proxy-mode=ipvs` 옵션으로 활성화 가능.

### 3️⃣ **user-space 모드 (비효율적, 거의 사용 안 함)**
   - `kube-proxy`가 직접 요청을 받고 적절한 `Pod`으로 **프록시 역할**을 수행.
   - 성능이 낮고 오버헤드가 많아 현재는 거의 사용되지 않음.

---

## 🎯 정리
- `kube-proxy`는 Kubernetes 클러스터의 **Service 네트워킹을 담당**하며, 클라이언트 요청을 올바른 `Pod`으로 연결.
- `iptables` 또는 `IPVS`를 사용하여 패킷을 효율적으로 라우팅.
- Kubernetes의 내부 서비스 디스커버리 및 로드 밸런싱을 지원.

🚀 **즉, kube-proxy는 Kubernetes에서 서비스 간 통신을 원활하게 만들어주는 핵심 네트워크 컴포넌트!**


## 📌 **kube-proxy 작동 방식 예시**  

#### 🎯 **시나리오**
1. **사용자가 `ClusterIP`를 가진 서비스에 요청을 보냄**  
2. **kube-proxy가 `iptables` 또는 `IPVS`를 사용해 요청을 적절한 Pod으로 라우팅**  
3. **Pod이 요청을 처리하고 응답을 반환**  

---

## 🏗 **예제 구성**  
### 1️⃣ **Deployment & Service 생성**
아래와 같이 `nginx`를 실행하는 Pod 3개를 포함한 Deployment와 이를 노출하는 Service를 생성한다고 가정하자.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80   # 서비스의 포트
      targetPort: 80 # Pod의 포트
  type: ClusterIP  # 기본적으로 내부에서만 접근 가능
```

---

## 🎯 **서비스 요청 흐름**
사용자가 Kubernetes 클러스터 내부에서 다음과 같은 요청을 보낸다고 가정하자.

```sh
curl http://nginx-service:80
```

### 2️⃣ **kube-proxy의 역할**
1. 사용자가 `nginx-service:80`(ClusterIP)로 요청을 보냄.
2. `kube-proxy`가 `iptables` 또는 `IPVS`를 확인하여 **해당 Service가 어떤 Pod들과 연결되어 있는지 확인**.
3. 요청을 3개의 Pod 중 하나로 **로드 밸런싱하여 전달**.

---

## 🖥 **iptables 기반의 요청 처리 흐름**
`kube-proxy`가 `iptables` 모드를 사용할 경우, 내부적으로 아래와 같은 규칙이 생성됨.

```sh
iptables -t nat -L -n -v
```

```
Chain KUBE-SERVICES (2 references)
target     prot opt source               destination
KUBE-SVC-XXXXXX  tcp  --  0.0.0.0/0        10.96.0.10  /* nginx-service */

Chain KUBE-SVC-XXXXXX
target     prot opt source               destination
KUBE-SEP-AAAAAA  all  --  0.0.0.0/0        0.0.0.0/0   /* Pod1 */
KUBE-SEP-BBBBBB  all  --  0.0.0.0/0        0.0.0.0/0   /* Pod2 */
KUBE-SEP-CCCCCC  all  --  0.0.0.0/0        0.0.0.0/0   /* Pod3 */
```

📌 **설명**  
- `nginx-service`의 `ClusterIP`는 `10.96.0.10` (Kubernetes가 할당한 내부 가상 IP)  
- `kube-proxy`가 `iptables`을 통해 `Pod1`, `Pod2`, `Pod3` 중 하나로 트래픽을 전달 (라운드 로빈 방식)  

---

## 🚀 **결과**
- `curl http://nginx-service:80`를 실행할 때마다 **다른 Pod이 응답할 가능성이 있음**.
- `kube-proxy`는 클러스터 내부에서 **클라이언트가 Pod의 실제 IP를 몰라도 서비스가 가능하도록 네트워크 라우팅을 수행**.

---

## 🎯 **정리**
1. 사용자는 `Service`의 `ClusterIP`(가상 IP)로 요청을 보냄.
2. `kube-proxy`는 `iptables` 또는 `IPVS`를 통해 **요청을 적절한 Pod으로 전달**.
3. 요청을 받은 Pod이 응답을 보내고 클라이언트가 결과를 받음.

💡 **즉, kube-proxy는 Kubernetes의 내부 네트워크 트래픽을 관리하는 핵심 컴포넌트다!** 🚀