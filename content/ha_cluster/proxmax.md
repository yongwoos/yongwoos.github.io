---
title: Proxmax 홈클러스터 구성
weight: 1
---
## 미니PC에 Proxmax 설치
미니PC를 이용해 클러스터를 구성한다. 미니PC는 Texhoo R5-4500U 모델로 RAM 16G, SSD 256GB이다.

가상화 툴로 Type1 Hypervisor인 Proxmax를 설치한다. Proxmax는 Host OS가 없이 바로 게스트 OS를 가상화할 수 있어 하드웨어 측면에서 효율적이다.

Proxmax ISO 이미지를 다운받은 후 USB에 Rufus를 이용해 ISO 이미지를 굽는다. 그리고 미니PC BIOS로 진입 후 USB로 부팅을 선택한다. Proxmax 설치 옵션이 나오고 네트워크 대역을 공유기의 대역을 참조해 설정한다. Proxmax를 설치 후 원격 접속이 되지 않으면 게이트웨이 주소가 공유기의 게이트웨주소와 일치하는지 확인해본다. 또한 네트워크 대역이 같은지도 확인해본다.

다음 명령어를 이용해 적절히 네트워크를 수정한다. address가 Proxmax의 IP이고 gateway, netmask를 공유기 설정과 일치하게 작성한다.
```
root# nano /etc/network/interfaces

auto lo
iface lo inet loopback

auto eno1
iface eno1 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
```


설정 후 서비스 재시작 및 재부팅을 실행한다.
```
systemctl restart networking

reboot
```

## Proxmax Web 초기설정
모든 설정이 완료되면 미니PC는 모니터와 키보드 연결을 해제해도 된다. 원격으로 Proxmax Web UI에 http:/ProxmaxIP:8006 으로 접속한다. 접속 시 Proxmax 설정 시 입력한 ID와 비밀번호를 입력한다.

Shell에서 Enterprise 버전 패키지를 주석 처리한다.
```
root# /etc/apt/sources.list.d/pve-enterprise.list
```

/etc/apt/sources.list 에 무료 구독 패키지를 추가한다.
```
deb http://download.proxmox.com/debian/pve bullseye pve-no-subscription
```

업데이트 및 업그레이드를 한다.
```
apt update
apt upgrade
```

### 도메인 연결
도메인을 연결하고 공유기 설정에서 443번 포트를 미니PC의 8006번 포트와 매핑시켜 준다.

## User 생성
## 방화벽 설치

## 노드 연결