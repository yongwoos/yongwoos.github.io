---
title: Router
weight: 4
---
## Router
### CDP와 LDP
- CDP(Cisco Discovery Protocol): 시스코 장비 전용 프로토콜로 자신의 장비와 직접 연결된 시스코 장비들에 대한 정보를 얻기 위해 사용하는 도구
- LLDP(Link Layer Discovery Protocol): CDP와 유사한 국제 표준 프로토콜
- CDP는 데이터 링크 계층에서 동작하는 프로토콜
- CDP 명령이 제공하는 정보
  - 장비 식별자: 라우터나 스위치에 설정된 호스트 이름
  - 주소 목록: IP와 데이터링크 계층 주소
  - 포트 식별자: 로컬 포트와 원격 포트의 이름
  - 성능 목록: 장비(라우터인지 스위치인지 구분)
  - 플랫폼
- `show cdp`로 명령어 시작 - `show cdp ?`로 하위 명령 확인
- 기본은 활성화지만 비활성화 가능
  - CDP가 활성화되어 있으면 보안 노출이 쉽게 일어남
  - CDP를 이용하면 라우터나 스위치의 상세 정보를 쉽게 얻을 수 있기 때문에 시스코는 기본적으로 비활성화를 권장
  - 장비 전체에서 비활성화 할 때는 `no cdp run` 명령을 사용하고 인터페이스별로 비활성화할 때는 `no cdp enable`
- `show cdp neighbors`
  - 보여지는 정보
  - 장비 식별자
  - 로컬 인터페이스
  - 홀드 시간: 홀드 시간 동안 응답 오지 않으면 경로 재탐색
  - 장비 성능 코드
  - 하드웨어 플랫폼
  - 원격 포트 ID
- `show cdp entry 이름`
  - 장비ID와 IP주소도 출력
- `show cdp traffic`
  - 전송된 패킷의 수
  - 오류에 관련된 내용
- `show cdp interface`
  - 로컬 장비에 관한 인터페이스 상태를 확인

### 연결 상태를 확인하는 방법
- `ping`(Packet Internet Groper): 실행 결과로 성공률과 특정 시스템을 찾고 되돌아 오는데 걸리는 최단 시간, 평균 시간, 최상 시간을 리턴
- `traceroute`: 패킷이 목적지까지 가는데 경유하는 경로를 출력, IP 패킷의 헤더에서 TTL(Time to Live)값을 1로 설정하고 목적지 호스트의 유효하지 않은 포트로 패킷을 전송

### 라우팅 프로토콜
- R1 설정
```
R1(config)#interface fa0/0
R1(config-if)#ip address 192.168.0.1 255.255.255.0
R1(config-if)#no shutdown
```
- R2 설정
```
R2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R2(config)#interface fa0/1
R2(config-if)#ip address 192.168.0.2 255.255.255.0
R2(config-if)#no shutdown
```
- 라우팅(Routing): 하나의 네트워크에서 다른 네트워크로 정보를 이동시키기 위해서 경로를 결정하고 트래픽을 전송하는 과정
- 네트워크 계층에서 이뤄지고 이를 담당하는 장비를 Router라고 함
- 라우팅 서비스는 네트워크 경로를 평가할 때 네트워크 토폴리지 정보를 사용
- 네트워크 토폴리지 정보는 네트워크 관리자에 의해 설정될 수 있고 네트워크에서 일어나는 동적인 과정을 통해서 수집될 수도 있음
- 경로 결정 방법은 위와 동일하게 수동으로 하는 방법과 자동으로 하는 방법 2가지가 존재
- 수동으로 하는 것을 static routing이라고 하고 자동으로 결정하는 것을 dynamic routing이라고 함
- 목적지까지 경로를 찾아서 routing table에 저장을 하는데 하나의 목적지까지 가는 경로는 하나만 저장
- 경로를 설정할 때는 시간이나 비용 등과 같은 기준이 있는데 이 기준을 메트릭이라고 함
- 라우팅 과정
  - 목적지 주소 확인
  - 라우팅 정보의 소스 파악: 목적지로 가는 경로를 라우터가 어디로부터 학습할 수 있는지 파악
  - 경로 탐색
  - 경로 선택
  - 라우팅 정보의 유지 및 검증
  - 패킷 전송
  - 경로 학습
- 현재 학습된 내용을 학습: 라우팅 테이블을 확인
  - `show ip route`
- 메트릭 계산 방법: 한 가지 정보 또는 여러 가지 정보를 같이 이용
  - 대역폭(bandwidth): 링크의 데이터 전송 속도
  - 지연(delay): 하나의 패킷이 링크를 따라 발신지에서 목적지까지 이동하는데 소요되는 시간
  - 지연은 중간에 있는 링크의 대역폭, 각 라우터의 포트에 쌓인 큐, 네트워크 혼잡 정도, 물리적인 거리에 따라 결정
  - 부하(load): 라우터나 링크와 같은 네트워크 자원의 사용량
  - 신뢰성(reliability): 네트워크 링크의 오류율
  - 홉 카운트(hop count): 라우터의 개수
  - 비용(cost): 네트워크 관리자나 운영체제에 의해 할당되는 값
- 자율 시스템
  - AS(Autonomous System): 단일 기관의 관리 및 제어 아래 있는 네트워크 또는 네트워크의 일부분
  - IGP와 EGP
  - IGP(Interior Gateway Protocol): 자율 시스템 내에서 동작하는 라우팅 프로토콜
  - EGP(Exterior Gateway Protocol): 자율 시스템 외부에서 동작하는 라우팅 프로토콜
  - 이렇게 나누는 이유는 비용문제와 이기종의 문제
- 관리 거리(administrative distance)
  - 경로의 신뢰도로 낮은 값이 더 신뢰성이 있는 것
  - 직접 연결된 인터페이스: 0
  - 정적 경로: 1
  - BGP: 20
  - EIGRP: 90
  - OSPF: 110
  - IS-IS: 115
  - RIP: 120
  - 사용 불가: 255
- 알고리즘에 따른 분류
  - 거리 벡터 알고리즘
    - 방향과 거리를 기준으로 경로를 선택
    - 일정한 주기를 가지고 자신이 가진 모든 라우팅 정보를 이웃한 라우터에게 전송
    - 변경 내역이 없어도 모든 라우팅 정보를 전송
    - 이 방식을 사용하는 알고리즘이 RIP
    - 초창기에는 라우터가 많지 않았기 때문에 이 방식이 별 문제가 없어서 사용
  - 링크 상태 알고리즘
    - 네트워크에 변화가 발생한 경우에만 트리거 업데이트를 하고 주기도 거리 벡터 알고리즘에 비해서 길게 설정(30분 이상)
    - 링크 상태 라우터는 SPF(Shortest Path First)트리 생성을 위해서 토폴리지 데이터베이스에 Dijkstra 알고리즘을 적용(하나의 최단 거리를 구할 때 그 이전까지 구했던 최단 거리 정보를 그대로 이용)을 적용

### 정적 경로 설정
- `ip route 목적지네트워크 [서브넷마스크] {주소 | interface} | [distance] [permanent]`
  - 주소를 설정할 때는 다음 HOP의 라우터의 주소를 설정하고 인터페이스를 설정할 때는 현재 라우터에 연결된 인터페이스를 설정
  - 기본 경로 설정
    - 라우터는 라우팅 과정 중에서 각 패킷의 목적지 IP주소를 라우팅 테이블에서 찾는데 일치하는 경로가 없으면 라우터는 패킷을 폐기
    - 라우터가 모든 경로를 가지고 있지 않으면 폐기되는 패킷이 발생
    - 패킷이 폐기되는 것을 방지하기 위해서 설정하는 것이 기본 경로 설정
    - 이 설정을 하게되면 잘 알지 못하는 목적지를 가진 패킷을 버리지 않고 더 잘 처리할 수 있는 라우터로 보내게 됨
    - `ip route 0.0.0.0 0.0.0.0 다음 라우터의 IP 또는 라우터와 연결된 인터페이스 이름`
```
R1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R1(config)#interface fa0/1
R1(config-if)#ip address 192.168.1.1 255.255.255.0
R1(config-if)#no shutdown
R1(config-if)#
*Mar  1 01:42:35.831: %LINK-3-UPDOWN: Interface FastEthernet0/1, changed state to up
*Mar  1 01:42:36.831: %LINEPROTO-5-UPDOWN: Line protocol on Interface FastEthernet0/1, changed state to up
R1(config-if)#exit
R1(config)#exit
```
- `R2#ping 192.168.1.1` 명령을 수행하면 패킷이 도달하지 않음
- 정적 라우팅을 할 때는 목적지의 IP를 사용하는 것이 아니라 목적지를 포함하는 네트워크 주소를 입력해야 함
```
R2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.

R2(config)#ip route 192.168.1.0 255.255.255.0 192.168.0.1
R2(config)#exit
R2#
*Mar  1 01:48:34.539: %SYS-5-CONFIG_I: Configured from console by console
R2#ping 192.168.1.1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.1.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 16/28/32 ms
```
- R2에서 192.168.1.1로 패킷이 도달 가능한 것을 알 수 있음
- 확인 `show ip route static`
- default gateway 설정 
```
configure terminal
ip route 0.0.0.0 0.0.0.0 192.168.0.1
```

### RIP
- 동적 라우팅 알고리즘은 목적지로 가는 여러가지 경로들 중에서 최상의 경로를 선택해서 라우팅 테이블에 기록
- 라우터는 자신이 알고 있는 경로를 광고를 하는데 인접한 라우터들은 그 정보를 받아서 자신의 라우팅 테이블을 업데이트
- 거리 벡터 알고리즘을 사용하고 라우팅 메트릭으로 hop count(중간에 있는 라우터의 개수)를 사용
- 최대 hop count가 15 -  16개 이상은 도달 불가능
- 경로의 비용이 같은 경우 최대 16개 기본적으로는 4개까지 load balancing을 수행
- 버전이 2개가 있는데 v1은 classful이고 v2는 classless
- v1에서는 네트워크 마스크를 생략해도 되지만 v2는 네트워크 마스크가 필수
- 클래스리스가 되면 많은 네트워크를 가질 수도 있지만 라우팅 테이블의 크기를 줄일 수도 있음
- 10.0.0.0 - classful 방식이라면 이 대역은 서브넷 마스크가 255.0.0.0
- 10으로 시작하는 네트워크 대역은 하나만 생성
- 클래스리스 방식 - 서브넷 마스크를 마음대로 설정
- 10.0.0.0 255.128.0.0으로 설정
- 10.128.0.0 255.128.0.0으로 대역을 추가할 수 있음
- 라우팅 테이블을 만드는 경우
- 192.168.0.0 255.255.255.0
- 192.168.1.0 255.255.255.0
- 이런 경우 하나로 합칠 수 있음
- 192.168.0.0 255.255.254.0
- 255.255.254.0: 11111111.11111111.11111110.00000000
- 192.168.0.0: 11000000.10101000.00000000.00000000
- 192.168.0.0: 11000000.10101000.00000001.00000000
- 과정
  - 전체 설정 모드에서 `router rip`을 입력
  - 라우터 설정 모드로 진입하게 되는데 여기서 version을 설정
  - RIP을 실행할 인터페이스를 지정
- 동적 라우팅 프로토콜을 동작
  - R2에서 현재 설정된 라우팅을 확인 `show ip route`
- 정적 라우팅 제거
```
R2#configure terminal
R2(config)#no ip route 192.168.1.0 255.255.255.0 192.168.0.1
R2(config)#exit
R2#show ip route
R2#ping 192.168.1.1 -> 실패
```
- R2에서 작업
```
R2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R2(config)#router rip
R2(config-router)#version 2
R2(config-router)#192.168.0.2
R2(config-router)#exit
R2(config)#exit
```
- R1에서 작업
```
R1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R1(config)#router rip
R1(config-router)#version 2
R1(config-router)#network 192.168.0.0
R1(config-router)#network 192.168.1.0
R1(config-router)#exit
R1(config)#exit
```
- R2에서 확인
```
R2#show ip route
R2#ping 192.168.1.1 -> 성공
```
- R2에서 프로토콜 확인
```
R2#show ip protocols
```
