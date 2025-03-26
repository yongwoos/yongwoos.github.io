---
title: inode table
weight: 3
---
# 📌 **inode들은 어디에 저장될까? (리눅스 파일 시스템 구조)**  

파일 시스템에서 **inode는 파일의 메타데이터를 저장하는 구조체**이며, 파일 시스템 내부에서 **특정한 영역(inode table)**에 저장됩니다.  

---

## **1️⃣ inode가 저장되는 위치**  

**inode는 파일 시스템이 생성될 때 미리 정해진 크기만큼 할당되며, 보통 데이터 블록과는 별도의 "inode table(아이노드 테이블)"이라는 영역에 저장됩니다.**  

✅ **inode는 데이터 블록과 별개로 존재**  
✅ **파일 시스템이 생성될 때 미리 예약된 공간**  

📌 **파일 시스템 구조 개요**  
리눅스의 대표적인 파일 시스템인 **ext4**(ext2/ext3도 유사) 기준으로 보면, 디스크는 여러 영역으로 나뉩니다.

```
|-----------------|-----------------|-----------------|-----------------|-----------------|
|  Boot Block    | Superblock      | Inode Table    | Data Blocks    | Free Space      |
|-----------------|-----------------|-----------------|-----------------|-----------------|
```
- **Boot Block**: 부팅에 필요한 데이터 저장  
- **Superblock**: 파일 시스템 정보(블록 크기, inode 개수 등) 저장  
- **Inode Table**: 파일들의 inode 정보 저장  
- **Data Blocks**: 실제 파일 내용 저장  

> 📍 **inode table은 데이터 블록과 분리되어 있음**  
> 📍 **각 블록 그룹에 inode table이 따로 존재**  

---

## **2️⃣ inode table 확인하는 방법**  
### **📌 (1) 파일 시스템 정보를 확인하는 방법**
```bash
sudo dumpe2fs /dev/sda1 | grep -i "inode"
```
출력 예시:
```
Inode count:              61054976
Free inodes:              61054321
Inodes per group:         16384
Inode size:               256
```
✅ **총 61054976개의 inode가 존재**  
✅ **inode는 256바이트 크기로 저장됨**  
✅ **각 블록 그룹마다 16384개씩 inode가 배치됨**  

---

### **📌 (2) 특정 inode의 위치 확인**
```bash
stat myfile.txt
```
출력 예시:
```
  File: myfile.txt
  Size: 13         Blocks: 8          IO Block: 4096   regular file
Device: 802h/2050d    Inode: 123456      Links: 1
```
✅ `myfile.txt`는 **inode 123456**에 저장되어 있음  
✅ 하지만 inode table이 어디 있는지는 아직 모름  

inode가 저장된 블록 그룹을 찾으려면?
```bash
debugfs /dev/sda1
```
그다음 **inode 번호를 검색**
```bash
stat /123456
```
출력 예시:
```
Inode: 123456   Type: regular  Mode:  0644  Flags: 0
Generation: 294563890
User: 1000   Group: 1000
File ACL: 0
```
✅ **inode 123456이 실제로 존재하는지 확인 가능**  

---

## **3️⃣ inode table은 어떻게 관리될까?**
파일 시스템에서는 inode를 **그룹 단위(block group)**로 나누어 관리합니다.  

📌 **ext4 파일 시스템에서 inode table 위치 예시**
```
Block Group 0:
    Superblock 위치
    Group Descriptor Table
    Inode Bitmap
    Block Bitmap
    Inode Table  ⬅️ (여기에 inode들이 저장됨)
    Data Blocks
```
- **Inode Bitmap**: 사용 중인 inode를 관리 (0: 사용 안 함, 1: 사용 중)  
- **Block Bitmap**: 데이터 블록 사용 여부 관리  
- **Inode Table**: 실제 inode 메타데이터 저장  

---

## **4️⃣ inode table의 크기와 한계**
inode는 파일 시스템이 생성될 때 미리 할당되므로, **파일 시스템을 만들 때 정해진 inode 개수 이상 파일을 생성할 수 없음**  

### **📌 inode 개수 확인**
```bash
df -i
```
출력 예시:
```
Filesystem      Inodes   IUsed    IFree  IUse% Mounted on
/dev/sda1     61054976  123456 60931520   0%   /
```
✅ **현재 61054976개의 inode 중 123456개 사용됨**  
✅ **inode가 부족하면 새 파일을 만들 수 없음**  

> 📍 **디스크 용량이 남아 있어도 inode가 부족하면 더 이상 파일을 생성할 수 없음**  
> 📍 **이 문제를 피하려면 파일 시스템을 생성할 때 inode 개수를 충분히 설정해야 함**  

---

## **📌 5️⃣ 정리**
1️⃣ **inode는 파일 시스템의 "inode table" 영역에 저장됨**  
2️⃣ **각 블록 그룹별로 inode table이 존재하며, 파일 시스템 생성 시 미리 정해짐**  
3️⃣ **df -i, dumpe2fs, debugfs 명령어로 inode 정보를 확인 가능**  
4️⃣ **inode가 부족하면 디스크 용량이 남아 있어도 파일을 생성할 수 없음**  

🔥 **즉, inode는 파일 시스템의 중요한 관리 구조이며, 디스크 공간뿐만 아니라 inode 개수도 고려해야 한다!** 🔥