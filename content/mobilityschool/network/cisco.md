---
title: CISCO 장비 명령어
weight: 3
---
## CISCO 장비 명령어 사용
### Cisco Router 구성 요소
- CPU, MotherBoard
- RAM, ROM, Flash
- Ports(Console, Ethernet, AUX)

### 연결
- 로컬: 콘솔 포트를 이용해서 시리얼 케이블을 연결해서 조작
- 원격: AUX 포트에 모뎀을 연결해서 원격에서 접속

### CISCO IOS
- CISCO Internetwork Operating System: 라우터의 운영체제

### 실행 모드
- 사용자 실행 모드: 라우터나 스위치의 상태만 볼 수 있고 무엇인가를 중단하거나 변경하지는 못함
  - 특권 실행 모드로 변경: enable
- 특권 실행 모드: 설정 변경
  - 사용자 실행 모드로 변경: disable

### 명령어 목록 확인
- ?

### 명령어 자동 완성 기능이 있음
- 명령어 전체를 입력하지 않고 명령의 일부분만 입력하고 이 명령의 일부로 시작하는 명령이 하나밖에 없으면 줄여쓰기가 가능
- 명령어 일부를 입력하고 ?를 입력하면 입력한 명령의 일부로 시작하는 모든 명령을 확인시켜 줌
- 명령어 도움말은 show 명령어 ?

### 자주 보여지는 에러 메시지
- % Ambiguous command: show con -> 명령어를 구분할 수 있을 정도로 충분한 글자를 입력하지 않음
- % Incomplete command -> 명령어가 필요로 하는 키워드나 값을 모두 입력하지 않음
- % Invalid Input Detected at ^ marker -> 명령어가 부정확하게 입력되었는데 ^ 가 이상할 때

### 초기 시동 상태 확인
- 버전 확인: `show version`
- 시작 설정 확인: `show startup-config` : ROM(NVRAM)에 설정된 내용 - 초기 상태
- 현재 설정 확인: `show running-config` : RAM에 설정된 내용 - 동작 중인 상태

### 라우터의 설정 모드
- 특권 명령 모드에서 `configure terminal` 명령을 수행하면 설정 모드로 진입하고 빠져 나올 때는 `exit`

### 객체 설정 모드
```
Router(config-if)# 인터페이스(포트) 설정
Router(config-subif)# 서브 인터페이스(포트) 설정
Router(config-controller)# 컨트롤러 설정
Router(config-line)# Line 설정
Router(config-router)# 라우터 설정
```
```
R1#config terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R1(config)#interface fa0/0
R1(config-if)#line console 0
R1(config-line)#password cisco
R1(config-line)#router rip
R1(config-router)#network 10.0.0.0
R1(config-router)#exit
R1(config)#exit
```
- 설정을 한 후 다음 부팅때도 이 내용을 유지하고자 하면 nvram에 저장해야 하는데 이 명령이 `copy running-config startup-config`

### 라우터의 이름과 로그인 배너 설정
- 라우터가 여러개일 때는 라우터의 이름을 수정해서 라우터를 구분할 수 있어야 함
- `configure terminal`을 먼저 수행해서 설정 모드로 진입하고 수행
  - `hostname 라우터이름`
- 로그인 배너는 라우터에 접속했을 때 보여지는 메시지임
  - `banner login 메시지`
- 설정 후 항상 `copy running-config startup-config` 명령으로 저장해야 다음 실행시에도 저장됨

### 인터페이스 설정
- 설정 모드로 진입: `configure terminal`
- 인터페이스로 진입: `interface 이름`
- ip 설정: `ip address ip subnetmask`
  - 동적 할당 IP라면 `ip address dhcp`
- 인터페이스 활성화: `noshutdown`
  - 라우터나 스위치의 인터페이스는 기본이 shutdown
- 인터페이스 확인
  - `show ip interface brief`
  - `show interfaces`
  - `show interface 인터페이스이름`
- static route 설정
  - `ip route 네트워크대역 서브넷마스크 실제나가는라우터IP(Gateway)`
- nat 설정
  - 인터넷이 연결된 인터페이스에서 `ip nat outside`
  - 내부망에 연결된 인터페이스에서 `ip nat inside`

### 라우터에 IP설정과 NAT 설정
- 라우터에서 작업
- `configure terminal`로 설정 모드로 진입
- 외부망을 설정 
```
R1(config)#interface fa0/0
R1(config-if)#ip address 10.0.0.1 255.255.255.0
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)# exit
R1#show ip interface brief
```
- 내부망 인터페이스 설정
```
R1(config)#interface fa0/1
R1(config-if)#ip address 192.168.0.1 255.255.255.0
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)# exit
R1#show ip interface brief
```
- static route 설정: 내부에 있는 장비들은 라우터의 gateway를 이용해서 외부로 접근하므로 router의 내부 인터페이스에 설정
  - 설정 모드에서 `ip route 0.0.0.0 0.0.0.0 192.168.10.1`
- nat 설정
  - 외부로 나가는 인터페이스에 `ip nat outside` 명령을 수행
  - 내부 게이트웨이에 해당하는 인터페이스에 `ip nat inside` 명령을 수행
  - PAT까지 설정하고자 하는 경우는 설정 모드에서 `ip nat inside source list 번호 interface 외부인터페이스 overload`
```
외부 - ip nat outside - ROUTER - ip nat inside (Gateway) - PC
```
```
Router(static route next hop)-------------(공인IP)Router(공인/사설IP)-----------SW, PC
사설IP일 경우                 (공인IP)(NAT OUTSIDE)Router(NAT INSIDE)(사설IP)
```
- PC가 연결되지 않은 라우터에 설정
```
R1#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R1(config)#interface fa0/0
R1(config-if)#ip address 100.0.0.1 255.0.0.0
R1(config-if)#no shutdown
R1(config-if)#exit
R1(config)#exit
R1#show ip interface brief
```
- PC가 연결된 라우터 설정
```
R2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R2(config)#interface fa0/0
R2(config-if)#ip address 200.0.0.1 255.0.0.0
R2(config-if)#no shutdown
R2(config-if)#exit
R2(config)#exit
R2#show ip interface brief
```
- PC와 연결된 쪽의 인터페이스
```
R2#configure terminal
Enter configuration commands, one per line.  End with CNTL/Z.
R2(config)#interface fa0/1
R2(config-if)#ip address 192.168.0.1 255.255.255.0
R2(config-if)#no shutdown
R2(config-if)#exit
R2(config)#exit
R2#show ip interface brief
```
- static routing 설정
```
R2(config)#interface fa0/0
R2(config-if)#ip nat outside

*Mar  1 00:16:24.803: %LINEPROTO-5-UPDOWN: Line protocol on Interface NVI0, changed state to up
R2(config-if)#
R2(config-if)#interface fa0/1
R2(config-if)#ip nat inside
R2(config-if)#exit
R2(config)#exit
R2#copy running-config startup-config
```