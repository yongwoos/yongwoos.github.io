---
title: 방화벽
weight: 10
---
### 교재에서 사용한 방화벽 실습
- 컴퓨터의 NIC가 2개
- VMWare를 설치: Virtual Box를 가지고 된다고 나와 있는데 현재는 설치
  - VMWare Player를 검색해서 다운로드 받아서 설치
- Untangle 16.1 버전의 iso 파일 다운로드
https://wiki.edge.arista.com/index.php/NG_Firewall_Downloads

### 방화벽
- 4계층에서 동작하는 패킷 필터링 장비
- 3, 4계층 정보를 기반으로 정책을 세울 수 있고 정책에 따라 매칭되는 패킷을 방화벽에서 허용하거나 거부할 수 있음
- 라우터 바로 뒤에 스위치 앞에 위치하는데 경우에 따라서는 DDoS 장비 바로 뒤에 놓기도 함
- 일반적인 컴퓨터에 Linux를 설치한 후 소프트웨어를 이용해서 구축하기도 하고 ASIC이나 FPGA같은 전용 칩을 이용해 가속하는 형태의 컴퓨터를 이용하기도 함
- 전용 컴퓨터를 이용하는 경우는 대용량을 요구하는 데이터센터에서 사용
- 동작 과정
  - 장비에 패킷이 들어오면 세션 상태 테이블을 확인
  - 조건에 맞는 세션 정보가 세션 테이블에 있으면 포워딩 테이블(라우이나 ARP포함)을 확인
  - 조건에 맞는 세션 정보가 세션 테이블에 없으면 방화벽 정책을 확인
  - 방화벽 정책은 맨 위의 정책부터 확인해서 최종 정책까지 확인한 후 없을 때 암시적인 거부 규칙을 참고해서 차단
  - 허용 규칙이 있으면 내용을 세션 테이블에 기록
  - 포워딩 테이블을 확인
  - 조건에 맞는 정보가 포워딩 테이블에 있을 때 적절한 인터페이스로 패킷을 포워딩
  - 조건에 맞는 정보가 포워딩 테이블에 없으면 패킷을 폐기
- 방화벽의 한계
  - 바이러스를 감지하거나 백도어나 인터넷 웜을 방어할 수 없음
  - 바이러스나 백도어나 인터넷 웜은 애플리케이션 계층의 프로토콜에서 보유하고 있기 때문에 애플리케이션 영역을 검사하지 못하는 방화벽으로는 대응이 불가능
  - 이러한 문제를 해결하기 위한 장비가 IPS

```
%%
IDS : 
Loadbalancer / Firewall : 4계층 장비
Router : 3계층 장비
%%
```
### Untangle 설치
- VMWare 설치
- 다운로드 받은 Untangle 이미지를 이용해서 Debian 리눅스를 GUI모드로 설치
- 설치하고나면 재부팅이 되고 설정화면으로 이동, 기본 설정을 수행
- 설정을 전부 하고 나면 Dash Board 화면을 볼 수 있는데 이 때는 Untangle에 회원 가입을 해야 함
- Dash Board 옆의 Apps 버튼을 눌러서 필요한 모듈을 설치할 수 있음, 이 때 lite가 붙은 것은 기능 사용하는 것으로 데이터베이스를 제공하지 않음

### 모듈
- Web Filter: 유해 사이트, 콘텐츠, 파일 형식을 가지고 접근을 제어
- Web Monitor: 웹 트래픽 모니터링 도구
- Firewall: 방화벽

### 방화벽 사용: Firewall
- Rules 부분을 클릭해서 정책을 생성하는 것이 가능
- Condition에 조건을 작성할 수 있는데 조건의 종류가 다양
- Destination Address, Destination Port, Interface
- Source Address, Source Interface
- Protocol
- Username: 유저 이름
- Hostname: 서버 이름
- Client MAC Address
- Server MAC Address

### 운영체제(서버)의 방화벽
- 운영체제 차원에서 사용하는 방화벽
- 운용 상의 불편함 때문에 기능 자체를 끄고 사용하는 경우도 있지만 반드시 사용해야 하는 경우도 있음
- 데이터 센터 서버의 접근 제한 및 이력 관리를 위해서 사용하는 접근 통제 솔루션이나 데이터베이스의 접근 및 세부 쿼리에 대한 제어를 위해서 사용하는 데이터베이스 접근 통제 솔루션을 사용하는 경우 서버 방화벽에서 해당 솔루션의 IP주소와 포트 번호만 허용하고 나머지 주소를 차단해야만 해당 솔루션을 제외한 허용되지 않는 접근을 막을 수가 있음
- 리눅스의 방화벽은 iptables
- ubuntu에서는 ufw 그리고 centos에서는 firewalld 등을 이용하는데 이 둘은 iptables의 Front End 역할
- iptables가 패킷을 차단하고 허용하는 기능을 수행하는 것은 아니고 실제로는 리눅스 커널의 netfilter 모듈을 이용해서 필터링이 실제 수행됨
- 리눅스에서 기존 방화벽을 종료
- Cent OS
```
# systemctl disable firewalld
# systemctl stop firewalld
```
- Ubuntu
```
ufw 상태 확인: sudo systemctl status ufw
ufw 중지: sudo systemctl disable --now ufw
재부팅: reboot
ufw 상태 확인: sudo systemctl status ufw
```
- iptables를 설치
  - Cent OS
    - `yum install iptables-services`
  - Ubuntu
    - `sudo apt install iptables-persistent`
    - 중간에 메시지가 뜨는데 ipv4와 ipv6에 대한 설정이므로 yes선택
  - 확인: `sudo systemctl status iptables`
  - 시작: `sudo systemctl start iptables`
  - 중지: `sudo systemctl stop iptables`
  - 부팅하자마자 실행: `sudo systemctl enable iptables`
  - 부팅할 때 실행 안되도록: `sudo systemctl disable iptables`
- 방화벽 정책 확인 `sudo iptables -L`
- INPUT(호스트가 목적지), OUTPUT(호스트가 출발지), FORWARD(호스트를 거쳐가는 경우)
- target이 허용 여부로 ACCEPT와 REJECT로 구분
- prot가 프로토콜
- opt source가 출발지
- destination이 목적지
- 정책 추가
- 이 호스트의 80번 포트로 접근하는 것을 허용
```
sudo iptables -A input -p tcp --dport 80 -j ACCEPT`
  -A나 --append옵션이 추가
  INPUT은 들어오는 곳에
  -p tcp는 tcp프로토콜을 --dport(출발지이면 sport) 80는 80번 포트로
  -j ACCEPT는 허용함
  출발지 주소나 목적지 주소는 -s와 -d 옵션으로 설정
```
- 정책 삭제는 -A 대신에 -D
- 주의할 점은 위에서 아래로 적용
  - 상단에 REJECT all anyware가 있으면 ACCEPT는 적용되지 않음
  - 라인 넘버 확인해야
  - `iptables -L --line-number`
- 특정 라인에 추가할 때는 `-A` 옵션 대신에 `-I`옵션을 이용
  - `iptables -I INPUT 1 -p tcp -d 20 -j ACCEPT`
- 모든 정책 삭제 `iptables -F(--flush)`
- 체인 단위로 삭제
```
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptablese -P FORWARD DROP
```