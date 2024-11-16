---
title: OSPF
weight: 6
---
### OSPF
- Open Shortest Path First는 링크 상태 라우팅 프로토콜
- 클래스리스 라우팅 프로토콜
- RIP은 전체 토폴리지에 대하여 알 수 없고 홉의 개수를 가지고 선택하므로 반드시 속도가 빠르다는 보장을 못함
- 링크 상태 프로토콜은 속도, CPU, 메모리 등의 성능을 기반으로 라우팅
- 영역을 나누어서 설정하는 것도 가능
- 설정을 할 때 서브넷 마스크가 아니라 와일드 카드 마스크를 이용
- 와일드 카드 마스크는 서브넷 마스크 반대
- 설정 방법
```
(config)#router ospf 프로세스아이디
(config-router)#network 네트워크주소 와일드카드마스크 area-id
```
```
R1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R1(config)#router ospf 1
R1(config-router)#network 192.168.0.0 0.0.0.255 area 0
R1(config-router)#network 192.168.10.0 0.0.0.255 area 0
```
```
R2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R2(config)#router ospf 1
R2(config-router)#network 192.168.0.0 0.0.0.255 area 0
R2(config-router)#network 192.168.20.0 0.0.0.255 area 0
```
```
R3#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R3(config)#router ospf 1
R3(config-router)#network 192.168.10.0 0.0.0.255 area 0
R3(config-router)#network 192.168.30.0 0.0.0.255 area 0
```
```
R4#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R4(config)#router ospf 1
R4(config-router)#network 192.168.20.0 0.0.0.255 area 0
R4(config-router)#network 192.168.30.0 0.0.0.255 area 0
```
## Switch 개요
### 공유 매체 환경
- 여러 호스트가 같은 매체(회선 - 전선이나 광섬유, 대기공간 등)에 연결되어 있는 환경
- 동일한 충돌 영역을 공유
- 예전 버스 기반의 이더넷이나 허브 기반의 이더넷 등이 공유 매체 환경
- 두 대 이상의 호스트가 동시에 데이터를 전송하고자 하면 충돌이 발생
- 허브를 사용하는 경우 동시에 전송을 하면 충돌이 발생하고 충돌이 발생하면 전송하고자 하는 모든 프레임을 버리며 보내는 호스트는 충돌 이벤트를 인지하고 혼잡 신호를 송신하게 되는데 이 때 모든 장비를 프레임에 오류가 발생했고 충돌이 발생했다는 사실을 인지하고 통신을 중단, 일정 시간 동안 대기한 후 다시 전송
- 스위치를 사용하게 되면 여러 개의 트래픽 경로를 생성 가능
- 스위치는 이렇게 하나의 매체를 나누어서 전송할 수 있는데 나누는 단위를 마이크로 세그먼테이션이라 함
- 스위치는 처음에는 플러딩하지만 보내는 소스를 기억, 학습
- 허브는 무조건 다 보냄, 기억 기능 없음

### 기본 명령어
- 활성화: `enable`
- 설정 모드: `configure terminal`
- 이름 설정: `hostname 이름`
- 원격에서 사용을 하기 위해서는 vlan1에 IP를 할당해야 함
- 스위치에서 외부 네트워크와 통신하기 위해서는 default-gateway가 설정되어야 함
- `ip default-gateway` 명령을 사용해서 IP를 설정하면 되는데 이 때 설정되는 IP는 연결된 라우터의 IP
- 스위치 포트 설정
  - 속도 설정: `speed (10 | 100 | 1000 | auto)
  - 듀플렉스 모드 설정: duplex
  - 통신 분류 모드
    - Simplex: 단향 통신이라고도 하는데 한 방향으로만 전송이 가능한 방식
    - Half Duplex: 반 이중 통신이라고도 하는데 양방향 전송이 가능하지만 어느 한 순간에는 한 방향으로만 통신 가능, 2선식
    - Full Duplex: 전 이중 통신이라고도 하는데 동시에 양방향 전송이 가능, 4선식
```
라우터 R1 설정
R1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R1(config)#interface fa0/0
R1(config-if)#ip address 172.30.137.1 255.255.255.0
R1(config-if)#no shutdown
```
```
스위치 설정
ESW1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
ESW1(config)#hostname dh-switch

dh-switch#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
dh-switch(config)#interface vlan 1
dh-switch(config-if)#ip address 10.5.5.1 255.255.255.0
dh-switch(config-if)#no shutdown
dh-switch(config-if)#ip default-gateway 172.30.137.1

dh-switch(config)#interface fa0/0
dh-switch(config-if)#speed 100
dh-switch(config-if)#duplex full
```

- 스위치의 모든 포트는 라우터와 다르게 기본적으로 모두 활성화
  - 사용하지 않는 포트를 아무런 설정없이 그대로 방치하면 보안에 심각한 위협이 될 수 있어 shutdown 시키는 게 좋음
  - `interface range 인터페이스 - 인터페이스번호`를 이용하면 한꺼번에 설정이 가능
- 15개 인터페이스를 셧다운
```
dh-switch(config)#interface range fa 1/1 - 15
dh-switch(config-if-range)#shutdown
```
- 특정 인터페이스의 정보 확인
  - `show interfaces 인터페이스이름`
  - `show interfaces fa0/0`
- 포트 보안 설정: 특정 MAC Address를 가진 장비만 접속이 가능하도록 할 수 있음
```
dh-switch#configure terminal
dh-switch(config)#interface fa1/5
dh-switch(config-if)#switchport mode access
dh-switch(config-if)#switchport port-security
dh-switch(config-if)#switchport port-security mac-address 실제MAC
```
- MAC 주소를 모르는 경우는 sticky를 설정하면 처음 연결된 장비의 MAC주소를 설정
`dh-switch(config-if)#switchport port-security mac-address sticky`
- 장비를 여러 개 설정
`dh-switch(config-if)#switchport port-security maximum 최대연결개수`
- 설정한 장비 이외의 장비가 접속하는 경우 shutdown 시키기
`dh-switch(config-if)#switchport port-security violation shutdown(protect나 restrict도 설정 가능)`
- protect는 트래픽을 폐기만 수행
- restrict는 트래픽을 폐기하고 경고 메시지 전송을 수행
- shutdown은 트래픽을 폐기하고 경고 메시지 전송을 수행하고 인터페이스를 비활성화까지 수행
- 보안 설정 때문에 shutdown이 되는 경우는 secure-shutdown 상태인데 이 상태에서 바로 no shutdown이 안되므로 shutdown을 하고 no shutdown을 수행

### VLAN
- 하나의 논리적인 브로드캐스트 영역으로 여러 개의 물리적 LAN 세그먼트에 걸쳐저 있을 수 있음
- VLAN을 이용하면 물리적으로 다른 곳에 있지만 함께 연결되어 데이터를 주고 받을 수 있도록 그룹을 생성하는 것이 가능
- 다른 세그먼트에 있는 호스트들도 VLAN을 사용하면 하나의 그룹으로 묶을 수 있고 하나의 스위치에 있는 포트들도 서로 다른 그룹으로 묶을 수 있음
- 하나의 LAN에 연결된 모든 장비는 동일한 브로드캐스트 도메인 내에 있다고 하는데 의미는 LAN의 어떤 장비가 브로드캐스트 프레임을 전송하면 다른 모든 장비가 이 프레임을 수신한다는 의미, LAN과 브로드캐스트 도메인은 동일한 개념
- 스위치는 VLAN을 사용하지 않으면 모두 동일한 브로드캐스트 도메인에 있다고 간주
- 트렁킹과 802.1Q
  - 스위치에서 구현된 VLAN은 출발지 포트와 동일한 VLAN에 속한 목적지로만 트래픽을 전송
  - 여러 개의 VLAN으로 구성된 스위치를 연결할려면 VLAN 개수만큼 연결 링크가 필요
  - 트렁크는 하나의 링크로 여러 개의 VLAN을 연결하는 것
  - 트렁크로 설정하고자 하는 경우 인터페이스에서 `switch mode trunk`명령을 수행한 후 `switchport trunk encapsulation dot1q`명령을 수행
  - 원래대로 되돌릴 경우에는 `switch mode access` 명령을 수행
- VLAN 생성 및 할당
  - 생성
  ```
  vlan 아이디
  name 이름
  ```
- 인터페이스를 할당
  ```
  switchport access vlan 아이디
  ```
- 기본(native) VLAN은 1
- VLAN은 2번 3번 99번을 생성
  ```
  switch(config)#vlan 2
  switch(config-vlan)#name adam

  switch(config)#vlan 3
  switch(config-vlan)#name eve

  switch(config)#vlan 99
  switch(config-vlan)#name basic
  ```
- 인터페이스를 포트에 할당
  - fastethernet 1/1 - 3 번을 vlan 2번에 할당
  - fastethernet 1/4 - 6 번을 vlan 3번에 할당
  ```
  switch(config)#interface range fa/1 - 3
  switch(config-if-range)#switchport access vlan 2
  dh-switch(config-if-range)#exit
  dh-switch(config)#interface range fa1/4 - 6
  dh-switch(config-if-range)#switchport access vlan 3
  ```
- 인터페이스의 VLAN 확인 `show interface 인터페이스 switchport`
- `show interface fa1/1 switchport`
- fa1/11 인터페이스를 trunk 모드로 설정
  ```
  dh-switch(config)#interface fa1/11
  dh-switch(config-if)#switchport mode trunk
  dh-switch(config-if)#switchport trunk encapsulation dot1q
  ```
- fa1/11 인터페이스의 VLAN 확인
  `show interface fa1/11 switchport`
  `show interface fa1/11 trunk`
- native vlan 변경
  - `switch trunk native vlan 번호`