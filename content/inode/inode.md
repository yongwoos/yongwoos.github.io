---
title: inode
weight: 1
---
### 📌 **리눅스 Inode란?**  
`inode`(Index Node)는 리눅스 파일 시스템에서 파일의 메타데이터를 저장하는 데이터 구조입니다. 파일의 실제 데이터 블록을 가리키는 역할을 하며, 파일 시스템에서 파일을 식별하는 기본 요소입니다.

---

### 📂 **1. Inode에 저장되는 정보**  
`inode`는 파일의 데이터 자체를 저장하지 않으며, 다음과 같은 **메타데이터**를 포함합니다.

✔ **파일 유형(File Type)**: 일반 파일, 디렉토리, 심볼릭 링크 등  
✔ **파일 크기(Size)**  
✔ **파일 소유자(Owner, UID) & 그룹(GID)**  
✔ **파일 접근 권한(Permissions)**  
✔ **파일 생성, 수정, 접근 시간 (ctime, mtime, atime)**  
✔ **링크 수(Hard link count)**  
✔ **데이터 블록 위치(파일 내용이 저장된 블록 포인터)**  

📌 **저장하지 않는 정보:**  
✖ 파일 이름 → 파일 이름은 `inode`가 아닌 **디렉토리 엔트리**(directory entry)에 저장됩니다.  

---

### 📊 **2. Inode 확인하는 명령어**  
#### 1) `ls -i`: 파일의 inode 번호 확인  
```bash
ls -i 파일명
```
예제:
```bash
ls -i myfile.txt
# 출력 예시: 123456 myfile.txt
```

#### 2) `stat`: 상세 inode 정보 확인  
```bash
stat myfile.txt
```
출력 예시:
```
  File: myfile.txt
  Size: 1234          Blocks: 8          IO Block: 4096   regular file
Device: 802h/2050d    Inode: 654321      Links: 1
Access: 2025-03-26 12:34:56
Modify: 2025-03-25 11:22:33
Change: 2025-03-25 11:33:44
```
→ **Inode 번호(654321)**, 크기, 블록 수, 접근 시간 등을 확인 가능.

#### 3) `df -i`: 파일 시스템 전체 inode 사용량 확인  
```bash
df -i
```
출력 예시:
```
Filesystem      Inodes   IUsed   IFree IUse% Mounted on
/dev/sda1      1000000  250000  750000   25% /
```
→ **사용된 inode 개수와 남은 개수를 확인**할 수 있음.

---

### 📌 **3. Inode와 파일 삭제 관계**  
1️⃣ **파일을 삭제해도 inode는 남아 있을 수 있음**  
   - 파일이 삭제되더라도 다른 프로세스가 사용 중이라면 inode는 유지됨.  
   - 프로세스가 종료되면 inode와 데이터 블록이 해제됨.  
   - (예: `rm myfile.txt`를 해도 프로세스가 사용 중이면 `lsof | grep myfile.txt`로 확인 가능)

2️⃣ **Hard Link를 사용하면 inode 공유 가능**  
   ```bash
   ln myfile.txt myfile_hardlink
   ```
   - `myfile.txt`와 `myfile_hardlink`는 같은 inode를 공유 → 원본 파일을 삭제해도 내용 유지.

3️⃣ **파일 시스템에 inode가 부족하면 파일을 저장할 공간이 있어도 새 파일을 만들 수 없음**  
   - `No space left on device` 오류가 발생할 수 있음.
   - `df -i`로 inode 부족 여부를 확인하고 불필요한 파일 삭제 필요.

---

### 🚀 **4. Inode 관련 문제 해결**  
✅ **Inode가 부족할 때 해결 방법**  
- `df -i`로 inode 상태 확인  
- 불필요한 작은 파일 삭제  
- `find /path -xdev -type f | wc -l`로 특정 파티션의 파일 개수 확인  
- 파일 시스템 확장 또는 다시 마운트 시 inode 개수 조정  

✅ **파일이 삭제됐는데 디스크 공간이 해제되지 않을 때**  
```bash
lsof | grep deleted
```
- 프로세스가 파일을 계속 잡고 있으면 `kill -HUP <PID>`로 해제  

---

### ✅ **정리**  
🔹 `inode`는 파일 시스템에서 파일의 메타데이터를 관리하는 구조체  
🔹 `ls -i`, `stat`을 이용해 inode 번호 및 정보 확인 가능  
🔹 `df -i`로 inode 사용량 체크 가능  
🔹 파일 삭제 시 inode가 유지될 수도 있음 (Hard link, 열린 파일)  
🔹 inode 부족 시 디스크 공간이 남아도 파일 생성 불가  

📌 **inode 개념을 이해하면 파일 시스템 관리 및 문제 해결에 큰 도움이 됨!** 🚀