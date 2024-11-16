---
title: 쿠버네티스 셀프 스터디
---
### Taint, Toleration
- 특정 노드가 Taint 옵션을 가지고 있으면 파드는 해당 노드에 생성 불가
- 파드가 Toleration 옵션을 가지고 있으면 해당 노드에 생성 가능
- NoSchedule: 스케줄러의 필터링 단계에서 노드가 배제
- preferNoSchedule: 스코어링 단계까지 넘어가고 다른 노드보다 낮은 점수를 갖음

### NodeSelector
- 레이블 정보에 따라 노드를 필터링 단계에서 배제
- Node Affinity로 확장

### Node Affinity
- 파드와 노드의 affinity label이 일치될 때 파드가 생성
- 4개의 옵션
  - requiredDuringSchedulingIgnoredDuringExecution   
    스케줄링 시 affinity label 반드시 일치해야 파드 생성   
    실행 중 파드와 노드의 affinity label 변경되어 불일치 시 파드 실행 불가
  - requiredDuringSchedulingPreferedDuringExecution   
    스케줄링 시 affinity label 반드시 일치해야 파드 생성   
    실행 중 조건 만족하지 않아도 파드 실행
  - preferedDuringSchedulingIgnoredDuringExecution   
    스케줄링 시 파드와 노드 옵션 맞지 않아도 파드 생성 가능   
    실행 중 파드와 노드의 affinity label 변경되어 불일치 시 파드 실행 불가
  - preferedDuringSchedulingPreferedDuringExecution   
    파드 스케줄링이나 파드 실행 중 affinity label이 일치하지 않아도 생성, 실행 가능

### Node Affinity vs Taint/Toleration
- Taint와 Toleration을 사용 시 Toleration 옵션이 있는 노드는 Taint옵션이 없는 노드에도 갈 수 있음
- Node Affinity와 Taint/Toleration을 같이 사용시 노드에 원하는 파드만 배치 가능

### Resources
- 1K = 1000 bytes, 1Ki = 1024 bytes
- 1M = 1000000 bytes, 1Mi = 2^20 bytes
- 파드가 할당 메모리보다 더 많이 소모하면 OOM(Out of memory) 에러가 발생
- 기본 설정은 제한 없음
- request:최소 limit: 최대
- LimitRange: Namespace 내의 파드 하나하나의 리소스량 설정
```yml {filename="limit-range-cpu.yaml"}
apiVersion: v1
kind: LimitRange
metadata:
  name: cpu-resource-constraint
spec:
  limits:
  - default:
      cpu: 500m         # limit
    defaultRequest:
      cpu: 500m         # request
    max:                # limit
      cpu: "1"
    min:
      cpu: 100m
    type: Container
```
- ResourceQuota: Namespace에 할당된 모든 파드 자원 통합해서 통제
```yml {filename="resource-quota.yaml"}
apiVersion: v1
kind: ResourceQuota
metadata:
  name: my-resource-quota
  namespace: nm-3
spec:
  hard:
    requests.cpu: 4
    requests.memory: 4Gi
    limits.cpu: 10
    limits.memory: 10Gi
```

### Health Check

### AntiAffinity, InterAffinity


### Namespace와 CNI Plugins 생성 과정
- 네임스페이스: 네임스페이스 안에서는 네임스페이스 밖의 네트워크 인식 못함
- 리눅스에서 네임스페이스 확인   
  `ip netns`
- 네트워크 인터페이스 확인   
  `ip link`   
- `ip netns exec red ip link`
- 네임스페이스 두개 연결
  - 네트워크 인터페이스 두개 연결   
    `ip link add veth-red type veth peer name veth-blue`
  - 인터페이스를 네임스페이스에 결합   
    `ip link set veth-red netns red`   
    `ip link set veth-blue netns blue`
  - IP주소 부여   
    `ip -n red addr add 192.168.15.1 dev veth-red`   
    `ip -n blue addr add 192.1688.15.2 dev veth-blue`
  - 링크
    `ip -n red link set veth-red up`   
    `ip -n blue link set veth-blue up`
  - 확인
    `ip netns exec red ping 192.168.15.2`   
    `ip netns exec red arp`   
    `ip netns exec blue arp`   
    `arp`
- 네임스페이스를 연결하기 위한 가상 스위치 생성
  - 인터페이스 생성   
    `ip link add v-net-0 type bridge`   
    `ip link`   
    `ip link set dev v-net-0 up`
- 가상 스위치에 네임스페이스를 연결하기 위해 기존 링크 삭제   
  `ip -n red link del veth-red`
- 가상 스위치 인터페이스에 IP를 부여
- localhost를 게이트웨이로 설정하며 NAT masquerading을 사용해 출발지 주소를 host주소로 변경
- 이러한 과정을 재사용 가능하게 모아 프로그램으로 만든 것이 플러그인
- 이러한 플러그인들의 표준 규약과 프로토콜이 CNI
- 도커는 자체 CNI 사용
- 쿠버네티스는 컨테이너를 생성하는 컴포넌트 container runtime(containerd, cri-o)가 플러그인 설정
  - 플러그인 목록은 /opt/cni/bin에 있음
  - 쿠버네티스는 /etc/cni/net.d 에서 찾아서 결정
    - net.d 디렉터리에 다양하 파일이 있으면 알파벳 순으로 결정
    - /etc/cni/net.d/10-bridge.conf 파일에 파드의 서브넷 대역 등이 설정

### kubeproxy와 userspace, iptables, IPVS
- userspace -> iptables -> IPVS
