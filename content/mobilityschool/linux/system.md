---
title: 시스템 관리
linkTitle: 시스템 관리
weight: 3
layout: wide
cascade:
  type: docs
sidebar:
  open: true
---
## 디스크 사용량 설정
- 리눅스는 기본적으로 여러 사용자가 한꺼번에 사용하는 시스템
- 디스크 사용량을 제한하는 기능을 제공: 디스크 쿼터
- 설정 방식
  - 사용자가 사용할 수 있는 파일의 전체 용량을 설정
  - 파일의 개수를 제한
- 쿼터 설정 시 한계치 설정
  - hard limit: 절대로 넘어설 수 없는 용량을 설정
  - soft limit: 일정 시간 동안은 용량을 넘어설 수 있는 방식

### 사용하는 패키지: quota
- 스크립트로 자동화시 `-y`옵션 필수, 대화상자 뜨면 안됨
```bash
sudo apt upgrade
sudo apt install -y quota
```

### 준비
- 파일 시스템의 마운트 옵션에 쿼터 속성을 설정
  - usrquota: 개별 사용자의 쿼터를 제한할 수 있는 속성
  - grpquota: 개별 그룹의 쿼터를 제한할 수 있는 속성
- 쿼터 속성 설정은 /etc/fstab 파일에 설정
```
df -TH # 현재 파일 시스템 확인
ls /dev # 디바이스 확인
```

### 실습
- 루트에 실습 위한 디렉터리와 계정 생성
  ```
  sudo mkdir /home2
  
  sudo mount /dev/sda2 /home2 # 마운트: 디렉터리를 어떤 디스크에 생성할 것인지 설정

  sudo useradd -m -d /home2/qtest1 qtest1
  sudo useradd -m -d /home2/qtest2 qtest2

  ls /home2
  tail -2 /etc/passwd
  ```

### 쿼터 속성 설정 - /etc/fstab 
```
파일시스템이름 디렉터리경로 파일시스템종류 defaults,usrquota 1
/dev/sda2 /home2 ext4 default,usrquota 1 1
```
- remount `sudo mount -o remount`
- mount 정보 확인 `mount` 

### 쿼터 데이터베이스 파일을 생성
- 명령 - `quotacheck`
- 쿼터 파일을 생성 및 확인 그리고 수정하기 위해서 파일 시스템을 스캔하는 명령
- 형식: `quotacheck [옵션] [파일시스템]`
- 옵션:
  ```
  a: 전체 파일 시스템을 체크
  u: 사용자 쿼터를 확인
  g: 그룹 쿼터를 확인
  m: 파일 시스템을 리마운트하지 않음
  v: 명령 진행 상황을 상세하게 출력
  ```
- 명령 실행 `quotacheck -ugvm /home`
  - 2개의 데이터베이스 파일이 생성
    - aquota.usr: 사용자 쿼터 데이터베이스 파일
    - aquota.group: 그룹 쿼터 데이터베이스 파일
- 쿼터 사용 활성화: `quotaon`
  - `quotaon [옵션] [파일시스템]`
  - 옵션
  ```
  a: 전체 파일 시스템에 적용
  u: 사용자 쿼터 활성화
  g: 그룹 쿼터 활성화
  v: 명령 진행 상황을 상세히 출력
  ```
- 명령 수행 `sudo quotaon -uv /home2`
- 쿼터 설정 및 확인
  - 명령: edquota
  - 형식: `edquota [옵션] [사용자계정이나 그룹]`
  - 옵션
  ```
  u: 사용자쿼터 설정
  g: 그룹 쿼터 설정
  p: 쿼터 설정 복사
  ```
- `-u`옵션을 이용하면 쿼터 편집 창이 나오게 되는데 원하는 크기를 soft와 hard에 설정하고 저장한 후 빠져나오면 됨
- 주의할 점은 단위가 KB, 설정할 때 값을 0으로 설정하면 무한대
- 쿼터 확인 `quota [옵션] [사용자계정 및 그룹]`
  - 옵션은 u 와 g

## 네트워크 서비스 관리
### 네트워크 설정
- 리눅스에서 네트워크를 사용하기 위한 준비:
  - IP: 현재 컴퓨터를 인터넷 또는 LAN에서 구분하기 위한 주소
  - Netmask: 동일한 네트워크를 구분하기 위한 주소
  - Broadcast 주소: 동일한 네트워크에 있는 모든 컴퓨터에 데이터를 전송하기 위한 주소
  - 게이트웨이 주소: 내부 네트워크에서 외부 네트워크로 나가가 위한 주소
  - DNS 주소: 도메인 네임 서비스로 설정이 안되어 있으면 도메인을 사용할 수 없음

### 네트워크 관리자
- 네트워크 제어와 설정을 관리하는 데몬(백그라운드 작업으로 대기하고 있다가 사용자 요청이 오면 처리하는 프로세스)
- 네트워크 관리자를 이용해서 IP주소설정, 고정 라우터 설정, DNS 설정이 가능
- 예전에는 네트워크 설정을 관리자를 이용하지 않고 ifcfg 라는 설정 파일을 이용
- 현재는 이러한 설정 파일도 지원
- 지원하는 도구
  - 네트워크 관리자: 기본 네트워킹 데몬
  - nmcli 명령: 네트워크 관리자를 사용하는 명령 기반 도구
  - [설정] - [네트워크]: GUI 도구
  - nm-connection-editor: 네트워크 관리자를 사용하는 GUI 기반 도구
- 설치가 안된 경우 network-manager를 설치
  - `sudo apt install network-manager`
- 서비스 실행 여부 확인
  - `systemctl status NetworkManager`
  - active 상태가 아니라면 start 명령으로 시작해주어야 함
  - `sudo systemctl start NetworkManager`
  - `sudo systemctl enable NetworkManager`
- GUI로 설정
  - [설정] - [네트워크]
  - 터미널에서 `nm-connection-editor` 명령 수행

### nmcli 명령으로 네트워크 설정
- `nmcli`: 명령 기반으로 네트워크 관리자를 설정
- 기본 형식 `nmcli [옵션] 명령 [서브 명령]`
- 옵션
  ```
  t: 실행 결과를 간단히
  p: 사용자가 읽기 좋게
  v: 버젼
  h: 도움말
  ```
- 서브명령 
- `general [status | hostname]` - 네트워크 관리자의 전체적인 상태를 출력
- `networking {on | off | connectivity}` - 네트워크를 시작하고 연결 상태를 출력
- `connection {show | up | down | modify | add | delete | reload | load}` - 네트워크 설정
- `device {status | show}` - 네트워크 장치의 상태를 조회

- 전체 상태 확인: `nmcli general`
- 네트워크 실행 및 중지: `nmcli networking on 또는 off`
- 네트워크 설정: connection(con)
  - 서브명령
  ```
  show: 기본 옵션으로 네트워크 연결 프로파일을 출력
  up: 네트워크 연결 시작
  down: 네트워크 연결 중지
  modify: 연결 프로파일에서 속성을 추가 및 수정 그리고 삭제
  add: 새로운 연결 생성
  delete: 연결 삭제
  reload: 연결과 관련된 파일 다시 읽기
  load: 연결 파일 읽기
  ```
- 연결 확인 `nmcli con show`
  - UUID(Universally Unique IDentifier) - 네트워크 상에서 고유성을 보장하기 위한 구별하기 위한 문자열, 128비트의 숫자인데 32자리의 16진수로 표현하는 것이 일반적
  - DEVICE: 외부와 통신할 때 사용하는 네트워크 인터페이스의 명칭
- 연결 중지 `nmcli con down 이름`
- 사용 `nmcli con up 이름`
- 연결 추구 
  `nmcli connection add type ethernet con-name 이름 ifname 인터페이스이름 ip4 주소/넷마스크비트수 gw 게이트웨이주소`
- 연결 수정
  `nmcli connection modify 커넥션이름 속성 값`
  - 수정은 게이트웨이나 IP를 수정
- IP 주소 변경
  - `nmcli con mod 연결이름 ipv4.address IP주소`
- 게이트웨이
  - `nmcli con mod 연결이름 ipv4.gateway IP주소`
- 특정 네트워크로 가는 경로를 지정
  - `nmcli con mod 연결이름 ipv4.routes "네트워크경로 거쳐갈 라우터"`
  - `nmcli con mod 연결이름 ipv4.routes "192.168.122.2.0/24 192.168.122.1"`
  - 192.168.2.0 네트워크에 갈 때는 192.168.122.1을 거쳐서 이동
- 연결 삭제
  - `nmcli connection delete 컨넥션이름`
- 연결 다시 읽어오기
  - `nmcli connection reload`
  - `nmcli connection load 컨넥션이름`
- 네트워크 장치 상태 보기
  - 상태 확인: `nmcli dev status`
  - 상세한 정보 보기: `nmcli dev show`

### IP명령으로 네트워크 설정
- 형식 `ip [옵션] 객체 [서브명령]`
- 옵션
  ```
  V: 버전을 출력
  s: 자세히 출력
  ```
- 서브명령
  ```
  address [add | del | show | help] : 장치의 IP Address 관리
  route [add | del | help] : 라우팅 테이블 관리
  link [set] : 네트워크 인터페이스를 활성화하거나 비활성화
  ```
- **ip route** 명령을 static routing 이라고 함
  - 최근에 추가한 네트워크의 경우 동적 라우팅이라고 인식하는데 시간이 걸릴 수 있기 때문에 정적 라우팅을 이용해서 직접 등록을 해서 사용하는 경우가 있음
  - 동적 라우팅은 다른 라우터가 광고한 내역을 업데이트 해야만 그 네트워크를 인식할 수 있음
- IP 확인 `ip addr show`
- IP 주소 설정 `sudo ip addr add 아이피/서브넷비트수 dev 컨넥션`
- IP 주소 삭제 `sudo ip addr del 아이피/서브넷비트수 dev 컨넥션`
- 라우팅 테이블 확인 `ip route show`
- 기본 게이트웨이 주소 설정 `sudo ip route add default via 게이트웨이주소 dev 커넥션`

### ifconfig 명령
- 이 명령은 리눅스에서 설치가 안되어 있음
- net-tools 패키지를 설치해야만 함
- 이 명령을 단독으로 사용하면 모든 커넥션 정보를 조회
- 이 명령은 MAC Address 조회 가능

## 네트워크 상태 확인

### ping
- 시스템이 외부와 통신이 되는지 확인하거나 서버가 동작하는지 확인할 때 사용
- 형식 `ping [옵션] [네트워크주소 - IP주소 또는 Domain]`
- 옵션
  ```
  a: 통신이 되면 소리를 냄
  q: 테스트 결과를 지속적으로 보여주지 않고 종합 결과만 출력
  c숫자: 보낼 패킷 수를 지정
  ```
- 아무런 옵션 없이 사용하면 56Byte의 패킷을 계속 보냄
- ping 명령을 이용해서 패킷을 전송했는데 응답이 오지 않는 경우가 있는데 이 경우 보안을 강화하기 위해서 ping 명령에 응답하지 않도록 했을 수도 있음

### netstat (중요)
- 네트워크 연결 상태, 라우팅 테이블, 인터페이스 관련 통계 정보를 출력
- 열려있는 포트 정보도 조회
  - 윈도우즈에서 특정 포트가 열려있는지 확인한 후 그 포트를 닫고자 하는 경우에도 사용 (`netstat -ano`, `taskkill /f /pid 포트번호`)
- 기본 형식 `netstat [옵션]`
- 옵션
  ```
  a: 모든 소켓 정보를 출력
  r: 라우팅 정보 출력
  n: 호스트 이름 대신에 IP를 출력
  i: 모든 네트워크 인터페이스 정보
  s: 프로토콜 별로 네트워크 통계 정보
  p: 해당 소켓과 관련된 프로세스의 이름과 PID 출력
  ```
- 현재 열려 있는 포트 확인 `netstat -an | grep LISTEN`
- 현재 열려 있는 포트를 사용중인 프로세스 확인 `sudo netstat -p`

### MAC주소와 IP주소 확인
- 같은 네트워크에 연결된 시스템 정보 조회
- Address Resolution Protocol 명령 이용
- 명령 `arp`

### 패킷 캡쳐 명령
- 패킷을 캡쳐해서 확인하는 명령은 `tcpdump`
- 네트워크의 상태를 확인하기 위해 패킷을 캡쳐해서 분석할 때 사용
- 이 명령으로 덤프한 데이터는 해킹의 도구가 될 수 있으므로 주의해야 함
- 기본형식 `tcpdump [옵션]`
- 옵션
  ```
  c 패킷수: 패킷수 만큼만 덤프받고 종료
  i 인터페이스: 특정 인터페이스의 패킷을 캡쳐
  n: IP 주소를 호스트명으로 변경하지 않음
  q: 간단한 형태로 보여줌
  X: 16진수와 ASCII로 출력
  w 파일경로: 덤프한 내용을 파일에 저장
  r 파일경로: 덤프한 내용을 지정한 파일에서 읽어옴
  host 호스트이름 또는 IP주소: 지정한 호스트와 주고받은 패킷만 캡쳐
  tcp 포트번호: 지정한 포트번호 패킷만 덤프
  ip: ip패킷만 덤프
  ex) sudo tcpdump -c 개수 -w 파일경로
  ```

## 서버 관리
### 원격 접속
- 서버는 로컬에 위치하는 경우가 거의 없음
- 서버는 대부분 원격에 위치하게 되고 이 경우 원격에서 접속해서 작접을 수행

### telnet
- 원격 접속 프로토콜의 이름
- 텔넷을 설치한 원격지 서버를 만들고 외부에서 접속을 해서 사용
- 서버 설치 확인 `dpkg -l | grep telnet`
  - 기본적으로 telnet client가 설치되어 있음
- 서버 설치
  - telnet서버는 standalone데몬(독자적으로 동작하는)이 아님
  - 텔넷 서버는 슈퍼 데몬(혼자서 동작하지 않고 다른 데몬과 같이 동작)
  - 설치를 하게 되면 inetd 라는 슈퍼 데몬과 같이 설치됨
  - `sudo apt -y install telnetd`
  - 설치가 되면 서비스가 바로 시작
  - 설치 및 실행 확인 `systemctl status inetd`
- 리눅스에서 텔넷 접속
  - 로컬 접속: `telnet 0`
  - 다른 컴퓨터의 telnet 접속 `telnet> open 아이피나(10.0.2.15) 도메인`
  - Mac은 telnet 클라이언트가 설치되어 있어서 telnet 아이디와 컴퓨터 주소를 이용해서 접속을 하면 됨
  - Windows는 텔네 접속 도구가 포함되어 있는데 기본 설치를 하면 처음 열리지 않음
  - Windows 기능에서 텔넷 클라이언트를 추가해주어야 함
  - virtual box에 리눅스를 설치한 경우에는 포트 포워딩을 해줘야 함
  - 현재 컴퓨터의 IP(192.168.202.207)와 포트번호(23)를 가상 머신의 리눅스의 IP(10.0.2.15)와 포트번호(23)를 매핑
  - 현재 컴퓨터의 IP를 이용해서 접속하면 가상 머신의 리눅스에 접속을 하게 됨

### SSH
- 텔넷으로 원격에서 접속할 수 있는 서버를 만들 수 있음
- 텔넷은 데이터가 암호화되서 전송되지 않음
  - 패킷을 캡쳐하면 전송되는 데이터를 알 수 있음
- Secure SHell 은 데이터를 암호화해서 전송
  - 텔넷보다 보안이 우수
- 우분투에서는 SSH가 기본 데몬이 아니므로 설치를 해야 함
  - 패키지 이름은 openssh-server
  - 서비스 이름은 ssh
  - 기본 포트는 22번, tcp 프로토콜 사용
- 설치 및 시작
  - openssh도 슈퍼데몬이므로 일반적으로 설치와 동시에 실행
  - `sudo apt -y install openssh-server`
- 재시작하고 처음부터 가동되는 서비스로 등록하고 확인
```
sudo systemctl start ssh
sudo systemctl enable ssh
systemctl status ssh
```
- 방화벽에 22번 포트를 추가해서 외부에서 22번으로 접속할 수 있도록 설정 `ufw allow 포트번호/프로토콜`
- ip > tcp,udp > telnet, ftp, http, https, dhcp, dns, snmp, icmp, smtp, pop3
- openssh-server 대신에 ssh 패키지 설치해도 됨
- virtualbox를 사용하는 경우는 포트 포워딩을 해줘야 함
- 클라이언트에서 접속
  - `ssh 아이디@IP`
- windows에서 접속이 안되는 경우는 키가 중복되서 에러가 발생하는 경우가 있음
  - `ssh-keygen -R IP주소`
  - 명령을 이용해서 키를 제거한 후 다시 접속하면 됨

### XDRP
- 원격 데스크탑
- GUI 환경의 리눅스를 외부에서 접속해서 사용하기 위한 기능
- 패키지 이름과 서비스 모두 xdrp 이고 포트번호는 3389번
```bash
sudo apt install xdrp

sudo systemctl start xdrp
sudo systemctl enable xdrp
sudo systemctl status xdrp

ufw allow 6389/tcp
6389번 포트 포트포워딩
외부의 원격 데스크탑 프로그램에서 접속
```

## 데이터베이스 서버
### mariadb
- mysql의 fork
- 패키지 이름: mariadb-server, mariadb-client
- 서비스이름: mariadb
  - mysql fork라서 mysql이나 mysqld로 해도 됨
- 설정파일 위치
  - linux: /etc/mysql/mariadb.conf.d/50-server.cnf
  - 옵션: bind-address-접속가능IP, datadir-데이터저장위치
- 리눅스에서 mysql접속
  - `sudo mysql` 명령을 실행하면 root로 접속
- 관리자 비밀번호 설정
  - 외부에서 접속이 가능하도록 하려면 비밀번호 필요
  - `mysqladmin -u root password '비밀번호'`
- 외부 접속이 가능하도록 설정
  - 3306번 포트를 방화벽에 추가
  - virtualbox의 경우는 포트포워딩을 수행
  - mysql 설정 파일을 열어서 bind-address를 접속할 클라이언트의 IP나 0.0.0.0으로 수정
  - 되도록이면 root 유저를 직접 접속하도록 하는 것보다는 새로운 유저를 생성을 해서 외부 접속 권한을 부여하고 접속하는 것이 좋음
  - mariadb 버전이 최신 버전이면 접속할 때 암호화 때문에 비밀번호가 틀렸다고 할 수 있음

## 방화벽
- 외부에서 접근하는 트래픽을 제어하기 위한 소프트웨어가 방화벽
- 내부에서 외부로 나가는 트래픽을 제어하기 위한 소프트웨어는 proxy
  - 자바스크립트는 브라우져 내부에서만 동작하기 때문에 브라우져 외부의 데이터에 접근 못함
  - 자바스크립트를 이용해 외부 데이터 가져올려면 프록시 서버를 이용

### 방화벽 상태 확인 - 패키지와 서비스 이름이 ufw
- 설치되어 있는지 확인 `dpkg -l | grep ufw`
- 서비스 상태 확인 `systemctl status ufw`
- 방화벽 시작 `sudo ufw enable`
- 방화벽 종료 `sudo ufw disable`

### 관련 명령
- ufw 서브명령
  ```
  enale
  disale
  default all | deny | reject [incoming | outgoing] : 기본 동작 설정
  status [verbose] : 방화벽의 상태 출력
  allow 서비스 | 포트/프로토콜 : 허용
  deny 서비스 | 포트/프로토콜 : 거부
  delete 명령 : 명령으로 설정한 규칙을 삭제
  ```
- 웹 서버를 구동해서 외부에서 접근이 가능하도록 방화벽을 설정
  - `sudo ufw allow http(80/tcp)`
  - `sudo ufw allow https(443/tcp)`
- telnet(23 - tcp) 접속을 거부하도록 방화벽을 설정 `sudo ufw deny telnet`
- telnet 거부 규칙을 제거 `sudo ufw delete deny telnet`
- 포트를 직접 설정할 때는 tcp나 udp 같은 *프로토콜*을 같이 기재
- 특정 IP 를 가진 곳에만 적용
  - ftp 서비스에 192.168.200.207만 접속이 가능하도록 설정
  - `sudo ufw allow from 192.168.200.207 to any port ftp`

### 데이터베이스 (mariadb, mysql) 서버 외부에 접속 가능하도록 하기
- 방화벽에 데이터베이스 서버 애플리케이션의 포트를 허용
  - `sudo ufw allow 3306/tcp`
  - `sudo ufw allow 3306/udp`
- 데이터베이스 애플리케이션들은 로컬 호스트에 접속하도록 되어있는데 이 부분을 외부에서 접근이 가능하도록 수정
  - 127.0.0.1로 되엉 있는 부분은 0.0.0.0이나 접속하고자 하는 컴퓨터의 IP로 수정
- MySQL의 경우는 각 유저별로 접속할 수 있는 IP 대역과 데이터베이스를 설정해주어야 함
- 루트비밀번호 설정 `sudo mysqladmin -u root password '비밀번호'`
- `grant all on *.* to 'root'@'%' identified by '00000000';`
- 접속 `mysql -u root -p`
- 유저가 사용할 수 있는 IP대역과 데이터베이스 설정
  ```
  use mysql;
  grant all on 데이터베이스이름 to '유저명'@'IP' identified by '비밀번호';
  flush privileges;
  ```
- virtualbox에서는 포트포워딩을 해줘야 함

## 웹서버
- 웹 브라우저에서 DOMAIN이나 IP 주소를 가지고 접속할 수 있도록 해주는 서버
- 리눅스나 윈도우즈는 기본적으로 웹 서버 기능을 제공
- 기본적인 웹서버는 html만 서비스가 가능
- 대부분의 경우는 WAS(Web Application Server - Web Server + Application Server)를 이용해서 서비스를 제공

### 설정
- `sudo apt install apache2`
- `systemctl status apache2`
- 기본 디렉터리: /var/www/html