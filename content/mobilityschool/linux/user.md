---
title: Ubuntu 사용자 관리
linkTitle: 사용자 관리
weight: 2
layout: wide
cascade:
  type: docs
sidebar:
  open: true
---

## 사용자 계정 관련 파일
### /etc/passwd
- 사용자 계정 정보가 저장된 기본 파일
- 초창기에는 암호도 저장되었지만 지금은 암호는 /etc/shadow 파일에 저장
- 구조
  - 7개의 항목으로 구성, 콜론으로 구분
  - 로그인ID:x:UID:GID:설명:홈디렉터리:로그인쉘
  - x는 예전에 비밀번호 저장하던 영역인데 호환성 문제 때문에 남아있음
  - UID는 사용자를 구분하기 위한 번호로 일반적으로 0~9999 번과 65534는 시스템 사용자를 위한 UID로 예약되어 있고 일반 사용자는 1000번 부터 할당
    - UID가 똑같은 계정은 같은 /home 디렉터리에서 작업
  - root가 0번, 시스템 데몬이 1, 명령어를 위한 관리 계정이 2
  - GID는 사용자가 속한 그룹의 ID로 사용자를 등록할 때 정해지고 특별히 소속 그룹을 지정하지 않는 경우 로그인 ID가 그룹으로 등록
  - 그룹에 대한 정보는 /etc/group 에 저장
  - 설명은 사용자의 실제 이름이나 부서명 같은 것을 적을 수 있는 부분
  - 홈디렉터리: 로그인을 했을 때 자동으로 로그인 되는 디렉터리의 절대 경로
  - 로그인 쉘은 로그인했을 때 처음 보여지는 쉘
  - 로그인 쉘

### /etc/shadow
- 사용자 암호에 대한 정보를 저장하는 파일
- 9개 영역으로 구성 -> ID:비밀번호:비밀번호 변경날짜:비밀번호 변경하고 사용해야 하는 최소 날짜:비밀번호 변경하고 사용해야 하는 최대 날짜:경고 발생할 날짜:비밀번호가 유효한 마지막 날짜:미래를 위해서 만든 항목
- 비밀번호 영역은 단방향 암호화를 이용해서 저장, 시스템계정은 *
- 단방향 암호화: 암호화한 내용과 평문 비교해서 일치 여부는 알 수 있지만 복원은 안됨
- 양방향 암호화: 암호화한 내용을 기반으로 원래 내용을 만들 수 있는 방식
- 비밀번호 변경 날짜: 1970/1/1 을 기준으로 지나온 날짜
```bash
dh@dh:~$ sudo cat /etc/shadow  | grep user3
[sudo] password for dh: 
user3:$y$j9T$TDKiiNpxhl096xX71cg0W1$k1dnZsYuMuXn4mchUNSqZtRl6f7OCi1NztcQExFQqIC:19975:0:99999:7::20088:
```

### /etc/login.defs
- 로그인과 기본 설정 파일
- 주요 설정 값
  - MAIL_DIR -> /var/mail : 기본 메일 디렉터리
  - PASS_MAX_DAYS -> 99999
  - PASS_MIN_DAYS -> 0
  - PASS_WARN_AGE -> 7
  - UID_MIN, UID_MAX -> 1000~60000: 사용자 계정의 UID 범위
  - SYS_UID_MIN, SYS_UID_MAX -> 100~699: 사용자 계정의 UID 범위
  - GID_MIN, GID_MAX -> 1000~60000: 사용자 계정의 GID 범위
  - SYS_GID_MIN, SYS_GID_MAX -> 100~699: 사용자 계정의 GID 범위
  - DEFAULT_HOME -> yes: 사용자 홈 디렉터리 생성 여부
  - UMASK -> 0002: umask 값 설정
  - USERGROUP_ENAB: yes: 계정 삭제 시 그룹 삭제 여부
  - ENCRYPT_METHOD -> SHA512: 암호화 기법

### /etc/group
- 그룹의 정보가 저장된 파일
- 리눅스에서 사용자는 하나 이상의 그룹에 속해야 함
- 기본 그룹은 /etc/passwd에 작성되어 있고 2차 그룹에 대한 내용을 /etc/group에 작성
- 그룹이름:x:GID:그룹멤버

### /etc/gshadow
- 그룹 암호가 저장된 파일
- 유닉스에는 없는 파일

## 계정 관리 명령
### 사용자 계정 생성
- 형식
  - `useradd [옵션] [로그인ID]`
  - 옵션
  ```
  u: UID 지정
  o: UID 중복 허용
  g: GID 지정
  G: 2차 그룹 지정
  d: 홈 디렉터리 지정
  s: 기본 쉘
  c: 부가적인 설명
  D: 기본값을 설정하거나 출력
  e: EXPIRE 항목을 설정
  f: 비활성 설정
  k: 계정 생성할 때 사용할 초기화 파일을 저장한 디렉터리 설정
  ```
- 사용자 계정 시 설정된 옵션은 vi를 이용해서 /etc/default/user 파일을 수정해서 변경할 수 있지만 되도록이면 -b, -e, -f -g, -s 와 같은 옵션을 이용해서 수정하는 것을 권장
- 옵션을 이용한 사용자 계정 설정
```bash
dh@dh:~$ sudo useradd -s /bin/bash -m -d /home/user2 -u 2000 -g 1000 -G 3 user2
[sudo] password for dh: 
dh@dh:~$ grep user2 /etc/passwd
user2:x:2000:1000::/home/user2:/bin/bash
```
- 사용자 계정을 생성할 때는 `sudo passwd 새유저` 명령을 이용해서 비밀번호를 설정을 해야함
- 사용자 계정이 만들어질 때의 옵션 확인: `useradd -D`
- EXPIRE 변경: `sudo useradd -D -e 2024-12-31`
```bash
dh@dh:~$ useradd -D
GROUP=100               # 그룹 ID
HOME=/home              # 홈 디렉터리 생성 위치
INACTIVE=-1             # 0으로 설정하면 암호가 만료되자 마자 바로 계정이 잠김, -1: 1의 2의 보수 (1111, 음수가 없을 때 가장 큰 수 의미)
EXPIRE=                 # 계정 종료일
SHELL=/bin/bash         # 기본 로그인 쉘을 설정
SKEL=/etc/skel          # 홈 디렉터리에 복사할 기본 환경 파일의 경로
CREATE_MAIL_SPOOL=no    # 메일 디렉터리 생성 여부 
LOG_INIT=yes            # 로그
```

```bash
/etc/skel 디렉터리

dh@dh:~$ ls -al /etc/skel
total 28
drwxr-xr-x   2 root root  4096 Aug 28 00:37 .
drwxr-xr-x 139 root root 12288 Sep  9 12:33 ..
-rw-r--r--   1 root root   220 Mar 31 17:41 .bash_logout
-rw-r--r--   1 root root  3771 Mar 31 17:41 .bashrc
-rw-r--r--   1 root root   807 Mar 31 17:41 .profile
```
- adduser 명령
- 사용자계정을 생성하는 명령
- 형식
  ```
  adduser [옵션] 로그인ID
  옵션
    --uid
    --gid
    --home
    --shell: 
    --gecos: 설명을 붙여주는 옵션
  ```
- 생성할 때 옵션 적용 내용이 출력됨
```bash
dh@dh:~$ sudo adduser user3
info: Adding user `user3' ...
info: Selecting UID/GID from range 1000 to 59999 ...
info: Adding new group `user3' (1002) ...
info: Adding new user `user3' (1002) with group `user3 (1002)' ...
info: Creating home directory `/home/user3' ...
info: Copying files from `/etc/skel' ...
New password: 
BAD PASSWORD: The password is a palindrome
Retype new password:
passwd: password updated successfully
Changing the user information for user3
Enter the new value, or press ENTER for the default
        Full Name []: userdh
        Room Number []: none
        Work Phone []: none
        Home Phone []: none
        Other []: none
Is the information correct? [Y/n] y
info: Adding new user `user3' to supplemental / extra groups `users' ...
info: Adding user `user3' to group `users' ...
```
- 생성한 유저 확인
```bash
dh@dh:~$ tail -3 /etc/passwd
newdh:x:1001:1001::/home/newdh:/bin/sh
user2:x:2000:1000::/home/user2:/bin/bash
user3:x:1002:1002:userdh,none,none,none,none:/home/user3:/bin/bash
dh@dh:~$ cat /etc/passwd | grep user3
user3:x:1002:1002:userdh,none,none,none,none:/home/user3:/bin/bash
```
- adduser로 유저를 생성할 때는 /etc/adduser.conf 파일을 기반으로 함, useradd와 달리 bash shell 사용

### 계정 수정
- 명령 형식 `usermod [옵션] [로그인ID]`
- 옵션
  ```
  u: UID 수정
  o: UID 중복 허용
  g: 기본 그룹 수정
  G: 2차 그룹 수정
  d: 홈 디렉터리 수정
  s: 기본 쉘 수정
  c: 보충 설명 수정
  f: 계정 비활성화 날짜를 수정
  e: 계정 만료날짜 수정
  i: 계정 이름 변경
  ```
- UID를 수정해서 중복을 허용하게 되면 사용자ID가 달라도 동일한 계정으로 로그인 한 것으로 간주

### 패스워드 에이징
- aging - 시간이 지남에 따라 기다린 시간 만큼 우선순위가 높아지는 것 ( 작업시간 + 대기시간 / 대기시간)
- 패스워드 에이징: 비밀번호의 유효 기간을 설정하는 것
- 관련 명령
```
            useradd, usermod, passwd 명령 수정          change 명령으로 수정
  - MIN         passwd -n 날짜                              change -m
  - MAX         passwd -x 날짜                              change -M
  - WARNING     passwd -w 날짜                              change -W
  - INACTIVE    useradd -f 날수, usermod -f 날수            change -I
  - EXPIRE      useradd -e 날짜, usermod -e 날짜            change -E
```
```bash
dh@dh:~$ sudo usermod -u 3003 user2
[sudo] password for dh:
dh@dh:~$ cat /etc/passwd | grep user2
user2:x:3003:1000::/home/user2:/bin/bash
```
### 계정 변경
- 기존의 값을 확인 `sudo cat /etc/shadow | grep user3`
- 변경: `sudo usermod -f 10 -e 2024-12-31 user3`
```bash
dh@dh:~$ sudo cat /etc/shadow | grep user3
user3:$y$j9T$TDKiiNpxhl096xX71cg0W1$k1dnZsYuMuXn4mchUNSqZtRl6f7OCi1NztcQExFQqIC:19975:0:99999:7:10:20088:
```

### 계정 삭제
- 형식
  - `userdel [옵션] [로그인ID]`
  - 옵션
  ```
  r: 홈 디렉터리까지 삭제
  f: 로그인 중이어도 강제 삭제
  ```

### 사용자 계정 명령 실습
- useradd 명령으로 test01, test02 계정을 생성: 비밀번호 설정 없이 계정을 생성(원격 접속 불가)하고 계정이 생성될 때 수행하는 기본 작업을 보여주지 않음
```
로그인ID    로그인쉘        UID     2차그룹     성명
test01      sh(본 쉘)      2100     3           test01.user
test02      bash           2200     4           test02.user
=>
sudo useradd -m -u 2100 -G 3 -s /bin/sh -c "test01 user" test01
sudo useradd -m -u 2200 -G 4 -s /bin/bash -c "test02 user" test02
```
- adduser 명령으로 test03 계정을 생성: 초기 설정 과정이 화면에 출력되고 비밀번호 설정 메시지가 제공됨
```
로그인ID    로그인쉘        UID       성명
test03      sh(본 쉘)      2300      test03.user
=>
sudo adduser --uid 2300 --shell /bin/bash --gecos "test03 user" test03
```
- 패스워드 에이징(유효 기간 수정)
  -  chage 명령으로 수행
```
- 항목 MIN(m) MAX(M) WARNING(W) INACTIVE(I) EXPIRE(E)
      4       200   10          5           2024-12-09
```
```bash
dh@dh:~$ sudo chage -m 4 -M 200 -W 10 -I 5 -E 2024-12-09 test01
dh@dh:~$ sudo cat /etc/shadow | grep test01
test01:!:19975:4:200:10:5:20066:
```
- test03 계정의 UID를 2010으로 계정의 이름을 test33으로 수정
- usermod 명령을 이용
- uid를 u 옵션을 이용
- 계정의 이름 변경은 l 옵션 사용
```bash
dh@dh:~$ sudo usermod -u 2010 -l test33 test03
dh@dh:~$ sudo cat /etc/passwd | grep test03
test33:x:2010:1001:,,,:/home/test03:/bin/bash
```

- test02 계정을 삭제 - 사용자의 홈 디렉터리까지 삭제
- `sudo userdel -r test02`
- public cloud에서 IaaS로 머신을 제공할 때 계정을 추가할 수 있도록 하는데 이 경우 계정만 추가하도록 해주는 경우도 있고 /home 디렉터리를 만들어주는 경우도 있음, /home 디렉터리가 필요없는 경우 UID만 같게 하면 같은 /home 디렉터리에서 작업 가능

## 그룹 관리 명령
- 리눅스는 모든 유저가 하나 이상의 그룹에 속하도록 함
- 시스템을 사용하는 사용자가 많아지면 업무나 기능에 따라 사용자들을 적절히 나누고 권한을 조정해야 함
- 관련 명령은 `groupadd, addgroup, groupmod, groupdel`

### 그룹 생성
- groupadd
  - `groupadd [옵션] [그룹이름]`
  - 옵션
    - `g: 그룹아이디`
    - `o: 그룹아이디 중복 허용`
    - 옵션 없이 생성하면 마지막에 생성된 그룹 아이디 다음 번호로 그룹 아이디를 설정해서 생성
  - 옵션 없이 그룹 생성 `sudo groupadd gtest01`
  - 그룹 아이디를 직접 설정 `sudo groupadd -g 3000 gtest02`
```bash
dh@dh:~$ sudo groupadd -g 3000 gtest02
[sudo] password for dh: 
dh@dh:~$ sudo cat /etc/group | grep gtest02
gtest02:x:3000:

dh@dh:~$ sudo groupadd -o -g 3000 gtest03
dh@dh:~$ sudo tail /etc/group
nm-openvpn:x:122:
lxd:x:123:
gamemode:x:986:
gnome-initial-setup:x:985:
dh:x:1000:
plocate:x:124:
test01:x:2100:
test03:x:1001:
gtest02:x:3000:
gtest03:x:3000:
```
- addgroup 명령으로 생성 가능한데 이 때는 옵션이 --gid
`sudo addgroup --gid 3001 gtest04`

### 그룹수정
- groupmod [옵션] [그룹아이디]
- -g 옵션을 이용해 그룹 아이디를 변경하는 것이 가능
- -n 옵션을 이용해 그룹 이름을 변경하는 것이 가능
- `sudo groupmod -g 2500 -n gtest05 gtest04`

### 그룹삭제
- groupdel
`sudo groupdel gtest05`

### 그룹 암호 설정 및 사용
- `gpasswd [옵션] [그룹이름]`
- 옵션
  ```
  a: 사용자 계정을 그룹에 추가
  d: 사용자 계정을 그룹에서 삭제
  r: 그룹 암호를 삭제
  옵션이 없으면 암호 설정
  ```
- 그룹에 멤버 추가 `sudo gpasswd -a test01 gtest02`
- 그룹에서 멤버 삭제 `sudo gpasswd -d test01 gtest02`
- 그룹 암호 설정 `sudo gpasswd gtest02`

- 암호를 설정하는 이유는 한 명의 유저가 서로 다른 2개 이상의 그룹에 소속된 경우 그룹을 변경하고자 할 때 사용
이 때 사용하는 명령은 `newgrp [그룹이름]`

## 사용자 정보 관리 명령
### UID와 EUID
- UID(RUID): 사용자가 로그인 할 때 사용한 계정의 UID
- EUID: 현재 명령을 수행하는 주체의 UID
- 대부분의 경우는 UID와 EUID가 일치하지만 달라지는 경우
  - 실행 파일에 setuid가 설정된 경우
  - su 명령을 이용해서 계정을 변경한 경우

### who와 w
- `who`: 현재 로그인한 사용자 정보를 출력
  - 옵션을 설정하면 일부 정보만 확인 가능
- `w` 명령은 현재 시스템에 로그인 한 사용자의 정보 외에 사용자가 현재 실행 중인 작업에 대한 정보를 출력
  - 옵션에 사용자 이름을 설정하면 사용자 이름에 해당하는 작업만 출력
- `last` 명령을 이용하면 시스템에 로그인하고 로그아웃 정보를 출력

### UID와 EUID 확인
- 현재 사용 중인 유저 확인(EUID 출력): `whoami`
- 로그인한 유저 확인(RUID 또는 UID 출력): `who am i`
- 아이디 확인: `id`
- 소속 그룹 확인: `groups [유저아이디]`
- 유저아이디를 생략하면 현재 사용자 계정이 속한 그룹

### 권한 수정
- 다른 계정으로 전환해서 권한을 사용
  - 대표적인 su 명령으로 root 계정으로 전환해서 기능 사용
  - root 계정으로 전환해서 권한을 사용하는 것은 위험한데 이는 시스템 관리 권한을 갖기 때문
- 계정 별로 특정한 작업을 수행할 수 있도록 권한을 부여
  - sudo 명령으로 root 권한을 실행하려면 특정 권한을 부여받아야 하는데 이 권한은 /etc/sudoers 파일에 설정
  - 사용자계정 호스트=명령어 형태로 설정
  - sudoers 파일은 기본적으로 읽기 전용이므로 수정을 하고자 하면 `sudo chmod` 명령으로 w 권한을 설정하고 해야 함
  ```
  root ALL=(ALL) ALL
  ```
  - user2에게 유저를 생성하고 유저를 수정하는 권한을 갖도록 수정
  ```
  user2 ALL=/usr/sbin/useradd, /usr/sbin/usermod
  ```

  - ex
  ```
  dh@dh:~$ sudo chmod 640 /etc/sudoers
  dh@dh:~$ sudo vi /etc/sudoers
  user2 ALL=/usr/sbin/useradd, /usr/sbin/usermod
  dh@dh:~$ su - user2
  dh@dh:~$ sudo useradd john
  => john 추가 가능
  ```
  - 처음 로그인 한 유저가 관리자 명령 실행 권한이 없어서 명령을 수행 못하는 경우 위처럼 sudoers 파일을 수정해서 해도 되고 su 를 이용해서 관리자로 로그인 하고 `usermod -aG sudo 계정`으로 계정에 모든 관리자 명령을 수행할 수 있도록 수정하기도 함

### 파일 및 디렉터리 소유자와 소유 그룹 변경
- 파일이나 디렉터리를 생성하면 생성한 사용자의 계정과 그룹이 소유자와 소유 그룹으로 설정됨
- 파일이나 디렉터리의 소유자를 변경할 필요가 있을 때 사용하는 명령
- 파일 소유자를 변경하는 `chown`
- 파일의 소유 그룹을 변경하는 `chgrp`
- 형식 `chown [옵션] [사용자계정] [파일이나 디렉터리 경로]`
- 옵션은 R이 있는데 이 옵션은 서브 디렉터리까지 적용
- 예시
```bash
chown user2 file1         # file1의 소유자를 user2로 변경
chonw user2:grp01 file1   # file1의 소유자를 grp01의 user2로 변경
chown -R user2 file1      # file1의 소유자를 user2로 변경하는데 하위 디렉터리가 있으면 같이 변경
```
- 소유자 변경보다는 권한 변경을 하는 경우가 많음

```
  실습: 홈 디렉터리에 linux_ex 디렉터리를 생성
  - linux_ex 디렉터리 안에 autoever 라는 디렉터리를 생성 => mkdir -p  ~/linux_ex/autoever/temp(웹 서버 만들어서 파일 업로드 기능을 만드는 경우나 Datalake를 구성하는 경우 
  날짜를 가지고 디렉터리를 만들어 데이터를 보관하는 경우가 있는데 이 경우 디렉터리 생성할 때 날짜를 계층별로 이용해서 디렉터리 생성)
  - autoever 디렉터리안에 temp라는 디렉터리를 생성
  - temp 디렉터리 안에 /etc/hosts 디렉터리의 모든 내용을 복사 => cp /etc/hosts ~/linux_ex/autoever/temp
  - temp 디렉터리 안에 /etc/services 디렉터리의 모든 내용을 복사 => cp /etc/services ~/linux_ex/autoever/temp
  - 소유자와 그룹 확인(소유자와 그룹이 파일을 복사할 때 로그인 중인 유저가 됨): ls -l
  - hosts 파일의 소유자를 owner1으로 수정 => sudo chown owner1 hosts
  - services 파일의 소유자를 owner1으로 소유 그룹도 owner1으로 변경 => sudo chown owner1:owner1 services
```
- 파일의 소유 그룹을 변경하는 `chgrp`
- 형식 `chgrp [옵션] [사용자계정] [파일이나 디렉터리경로]`
- 스크립트를 이용해서 자동화하는 경우 권한 문제가 발생할 수 있음
- chown 명령을 사용하는 스크립트의 경우는 앞에 sudo를 추가해서 필요한 권한을 전부 취득하고 하는 것이 좋음
- 디렉터리 관련 작업을 할 때 -R 옵션을 추가하면 하위 디렉터리까지 같이 작업을 수행하게 되는데 필터링을 수행한 후 할 수 있다면 find 명령 같은 필터링 명령을 수행하고 하는 것이 바람직, 성능 이슈가 발생할 수 있기 때문

