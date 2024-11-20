
## 1. 기본 환경 구성
### 1)Hostname 설정
- `hostnamectl set-hostname 호스트이름`
- 이름을 설정하면 /etc/hostname에 작성되어 있습니다.

### 2)NetworkManager
- 네트워크 설정을 위한 도구
- 설치 여부 확인: `rpm -q NetworkManager`
- 네트워크 명령 도구 인 nmcli 사용법: `nmcli --help`
- 현재 네트워크 상태 확인: `nmcli connection show`
- 전체 네트워크 상태 확인: `nmcli general status`
- 디바이스 상태 확인: `nmcli device status`
- 디바이스 설정 정보 확인: /etc/sysconfig/network-scripts/ifcfg-디바이스이름

### 3)NTP 설정
- 서로 다른 시스템 및 그 위의 애플리케이션 간 연결, 수 많은 로그 상의 정확한 타임 스탬프를 위해서 각 계층 및 구성 요소들의 일관된 시간 유지가 중요
- 인터넷 시간 서버, GPS 같은 비교적 정확한 소스로부터 시간을 제공받고 동기화하려면 NTP(Network Time Protocol)
- chrony
  - Cent OS 8 이상에서 NTP를 구현하는 기본 도구이며 이전의 ntpd는 더 이상 사용할 수 없음

- 두 개의 프로그램으로 구성
  - Chronyd: 부팅 할 때 바로 시작할 수 있도록 해주는 데몬
  - Chronyc: 성능을 모니터링하고 실행 중 다양한 작동 매개변수를 변경하는데 사용할 수 있는 명령 줄 인터페이스 프로그램

- 인스톨: `dnf install chrony`

- 서비스 활성화: `systemctl enable --now chronyd`

- 서비스 상태 확인: `systemctl status chronyd`

- 클라이언트의 ntp 요청을 허용하는 방화벽 규칙을 추가
```
firewall-cmd --add-service=ntp --permanent

firewall-cmd --reload
```

- chrony를 이용한 NTP 구성: /etc/chrony.conf 파일이 chrony의 설정 파일

  - 기본적으로 2.rocky.pool.ntp.org iburst 가 설정되어 있는데 이 부분을 한국으로 수정(https://www.pool.ntp.org/zone/kr)
```
server 1.kr.pool.ntp.org
server 2.asia.pool.ntp.org
server 3.asia.pool.ntp.org
```
- NTP 동기화를 설정: `timedatectl set-ntp true`

- chromy를 재시작: `systemctl restart chronyd`

- 확인: `chronyc sources`

### 4)Selinux 비활성화
- Selinux(Security-Enhanced Linux): 관리자가 시스템 액세스 권한을 효과적으로 제어할 수 있는 Linux 시스템용 보안 아키텍쳐
Linux 커널에 대한 일련의 패치로 개발한 것
- Open Stack 이나 가상화를 하고자 할 때는 이 서비스를 중지 시킵니다.
- 중지 시키는 방법은 명령어로 중지를 시킬 수 있고 /etc/selinux/config 파일에서 disabled 를 설정해서 중지시키는 방법이 있습니다.

`sudo vi /etc/selinux/config 명령으로 파일을 열어서 SELINUX=disabled`

### 5)Repository 설정
-  Cent OS(Rocky)의 패키지 repository는 기본적으로 12개로 구성되어 있으며 그 중 3개의 repository가 활성화되어 있으며 Cent OS 8 DNF로 변경되었으며 RPM 기반 패키지 관리 도구

- repository 확인: `/etc/yum.repo.d/` 또는 `dnf repolist`
- dnf
  - yum(Yellowdog, Updater, Modified) 명령어는 RPM을 관리하기 위해서 Cent OS 7까지 사용된 프론트 앤드 도구
  - 성능이 나쁘고 메모리를 과도하게 사용하고 종속성 패키지 조회 및 제공에 있어서도 속도 감소의 문제가 발생
  - 위의 문제를 해결하기 위해서 재작성한 것이 dnf
  - 개선 사항   
    YUM은 종속성 해결을 위해 Public API를 사용하는 반면 DNS는 SUSE에서 개발 및 유지 관리하는 libsolv를 사용해서 성능 향상을 이끌어 냄   
    DNF의 API는 완전히 문서화   
    YUM은 python 만으로 작성된 반면 DNF C, C++, Python 으로 작성

## 2.가상화
- 실습을 하고자 하는 경우는 리눅스를 직접 설치해야 합니다.
### 1)가상화
- 실제 물리 머신에서 하이퍼바이저를 이용해서 추상호된 하드웨어로 구성된 가상의 시스템 인스턴스를 실행하는 방식
- 가상의 시스템을 VM 또는 Guest 라고 하고 실제 물리 머신을 host 라고 합니다.
- 가상화를 사용하게 되면 하나의 물리 머신에 다양한 운영체제를 동시에 사용할 수 있습니다.
- 컴퓨팅 리소스를 여러 작은 부분으로 나누어 사용함으로써 더욱 효율적이고 경제적인 운용이 가능
- VM 안에서 레거시 환경에서 동작하는 소프트웨어의 설정 과 기능을 테스트해보거나 격리된 network 환경을 구성해 보안적으로 더욱 안전한 워크로드를 구성할 수 있음
- 종류
  - Full Virtualization(전가상화): Guest VM OS의 커널을 수정하지 않는 방식으로 Guest VM이 직접 물리 머신 과 매핑될 수 없고 반드시 하이퍼바이저를 거쳐야 합니다.   
  KVM이 전가상화의 대표적인 형태
  - Para Virtualization(반가상화): 성능 향상을 목적으로 Guest VM OS의 커널을 수정하여 가상 하드웨어 실제 하드웨어의 매핑을 단축 시키는 방식

### 2)가상화 장점
- 유연하고 세분화된 리소스 할당
  - 가상화를 사용하지 않는 경우에는 물리적 리소스 할당을 하드웨어 수준에서 수행하지만 가상화를 하게되면 소프트웨어 수준에서 할 수 있으므로 유연
  - Guest OS는 디스크로 보여지는 부분이 Host OS에서는 하나의 파일로 보여집니다.

- 소프트웨어 제어 구성
  - VM의 전체 구성은 Host에 데이터로 저장되고 소프트웨어 제어를 받음
  - 생성, 제거, 복제, 마이그레이션, 원격 운영 또는 원격 Storage에 연결할 수 있음

- Host에서 분리
  - Guest OS는 Host OS 와 별도로 가상화된 커널에서 실행
  - Guest OS가 불안정해지거나 손상되더라도 host 는 어떤 방식으로도 영향을 받지 않습니다.

- 공간 및 비용 효율성
  - 하나의 물리적 시스템이 많은 수의 VM을 호스팅 하는 것이 가능
  - 동일한 작업을 동시에 여러 개 수행하더라도 여러 물리적 시스템이 필요하지 않기 때문에 물리적 하드웨어 와 관련된 공간, 전력, 유지관리 요구사항이 줄어듬

- 소프트웨어 호환성
  - Host OS 용으로 출시되지 않은 애플리케이션도 가상화를 통해 실행하는 것이 가능

### 3)하이퍼바이저
- host 의 물리적 시스템을 파티셔닝하여 여러 개의 OS를 동시에 작동시키기 위한 논리적 플랫폼
- 하이퍼바이저는 물리 시스템의 memory, network, CPU 과 같은 컴퓨팅 자원을 더 효과적으로 사용할 수 있도록 도와줍니다.
- 종류
  - Type1(bare-metal hypervisor): OS가 없는 물리 머신위에서 바로 동작하는 하이퍼바이저
  - Type2(hosted hypervisor): 물리 머신위에 OS를 설치하고 그 OS 위에서 동작하는 하이퍼바이저

### 4)KVM(Kernel-based Virtual Machine)
- VM을 여러 개 생성하고 동시에 운영할 수 있도록 하드웨어를 가상화할 수 있는 오픈 소스 기술
- 커널 수준의 VM 이라고도 하는데 KVM 모듈이 시스템 커널에 장착이되서 Linux 시스템을 하이퍼바이저로 변경을 합니다
- KVM은 커널 수준의 하이퍼바이저이기 때문에 Type 1 하이퍼바이저에 해당하기도 하지만 KVM 환경에서 Host OS가 완전하게 동작하기 때문에 Type 2로 분류하기도 함

### 5)QEMU
- Host OS에서 동작하는 에뮬레이터

### 6) QEMU + KVM
- KVM은 일반적으로 QEMU와 같이 사용
- QEMU는 하드웨어를 에뮬레이트하고 KVM이 게스트 시스템을 실행할 때 최대 성능을 나타내도록 함

### 7)Libvit
- 가상화 플랫폼을 관리하는 API
- 클라우드기반 하이퍼바이저를 관리할 때 사용됨

### 8)가상화 아키텍쳐
- KVM 전가상화 아키텍쳐
```
      App
       |
    Guest OS<-----|
------||------    |
|Guest Memory|<---|
-------------     |
------------------|------------
하이퍼바이저 KVM->-|    
--------------------------------
OS(Host OS) | Driver(Hypervisor와 통신)
---------------------------------
HardWare(CPU, Memory, I/O Device)
```
```
VM     VM
--     --
eth    eth
 |      |
가상화 스위치
    ||
  Host OS
  -------
  enp0s3(물리적NIC)
    ||
    SW

Pod생성은 VLAN 생성과 유사
서비스는 가상화 스위치와 유사
```
## 3.KVM
### 1)KVM 환경 확인
- KVM은 x86 하드웨어에 설치된 Linux에서 동작하는 전가상화 솔루션
- x86 머신이 Virtualization Extensions를 지원해야 합니다.   
  `lscpu | grep Virtualization`
- KVM 가상화 모듈이 탑재되었는지 확인
  `lsmod | grep kvm`
- 모듈을 실행   
  `modprobe kvm_intel amd`
- CPU가 하드웨어 가상화를 지원하는지 체크
  - CPU 정보에 vmx나 svm라는 단어가 포함되었는지 체크

- /proc/cpuinfo 라는 파일이 cpu 정보를 가지고 있습니다.   
  `grep -E 'vmx|svm' /proc/cpuinfo`

### 2)Network 설정
- 외부에서 게스트 VM의 network에 접속할려면 NAT 또는 브릿지 network를 이용해야 합니다.
- 종류
  - NAT를 이용한 가상 network
  - Host 내부 게스트 VM들 간에만 통신 가능한 Hosted network
  - 시스템의 물리적 network 와 직접 연결된 브릿지 network
- 패키지 설치   
  `virt-managaer`   
  `virt-install`   
  `virt-viewer`   
  `qemu-kvm`   
  `libvirt`   
  `libvirt-client`
- `sudo dnf -y 패키지리스트`
- libvirtd 서비스 시작
  - `systemctl start libvirt`
  - systemctl start -> 재부팅 후 시작
  - systemctl enable -> 직접 재부팅 해야
- 네트워크 확인: `nmcli con show`

## 4. Open Stack 설치
### 1)설치
- 패키지 관리자 업데이트: `sudo yum update`
- Powertools를 설치
```
dnf install dnf-plugins-core
dnf config-manage --setenabled crb
```
- Open Stack 저장소를 활성화   
  `dnf install centos-release-openstack-릴리스이름`
  - 릴리스이름은 zed 나 antelope, bobcat
  - 인터넷에서 검색하면 rocky 나 ocata 가 있는데 조회가 안됨
- hostname 변경   
  수정 명령: `hostnamectl set-hostname controller`   
  확인: `hostnamectl`

- 네트워크 수정: `vi /etc/sysconfig/network-scripts/ifcfg-enp0s3`
```
TYPE=Ethernet
BOOTPORTO=none
NAME=enp0s3
DEVICE=enp0s3
ONBOOT=yes
IPADDR=10.0.2.15
PREFIX=24
GATEWAY=10.0.2.2
DNS1=8.8.8.8 
```
- 수정한 내용 반영: `sudo systemctl restart NetworkManager`

- Controller Node에 Python 종속성 설치   
`sudo dnf -y install python3-devel libffi-devel gcc openssl-devel python3-libselinux`

- Kolla ansible 2.9 버전 이상 설치
```
python3 -m venv ~/kolla

source ~/kolla/bin/activate

pip install -U pip

pip install ‘ansible<3.0’
```
- 설정 파일을 생성하고 작성:
```
sudo mkdir /etc/ansible
sudo vi /etc/ansible/ansible.cfg

[defaults]
host_key_checking=False
pipelining=True
forks=100

=>Kolla-Ansible을 다운로드
pip install kolla-ansible
```
- Kolla-Ansible 사용 디렉토리를 만들고 소유권을 현재 접속한 유저로 변경
```
sudo mkdir -p /etc/kolla

sudo chown $USER:$USER /etc/kolla

cp -r ~/kolla/share/kolla-ansible/etc_examples/kolla/* /etc/kolla

cp -r ~/kolla/share/kolla-ansible/ansible/inventory/* /etc/kolla
```
- multinode 파일을 편집해서 노드를 등록
```
[control]
controller ansible_host=IP ansible_become=true

[compute]
compute1 ansible_host=IP ansible_become=true

compute2 ansible_host=IP ansible_become=true

[network]
network ansible_host=IP ansible_become=true

[storage]
storage ansible_host=IP ansible_become=true
```
### 2)Ansible은 SSH를 사용하여 배포 host 와 대상 host를 연결합니다.
- ssh-keygen 명령을 public key를 생성합니다.
- public key를 각 node에 배포합니다.   
  `ssh-copy-id $USER@IP(자신의 컴퓨터는 localhost)`
- 배포에 사용된 비밀번호는 /etc/kolla/passwords.yml 파일에 저장   
  임의 password 생성기를 사용하면 복잡한 password로 생성되기 때문에 간편한 로그인을 위해서는 password를 직접 설정하는 것이 좋습니다.
  ```
  kolla-genpwd

  nano /etc/kolla/passwords.yml
  ```
  ```
  kolla_base_distro: "centos"
  kolla_install_type: "binary"
  openstack_release: "victoria"
  kolla_internal_vip_address: "192.168.210.250"
  kolla_external_vip_address: "192.168.210.250"
  network_interface: "enp0s3"
  kolla_external_vip_interface: "eth0"
  neuron_external_interface: "eth2"
  enable_cinder: "yes"
  enable_cinder_backend_lvm: "yes"
  glance_backend_file: "yes"
  nova_compute_virt_type: "qemu"
  ```