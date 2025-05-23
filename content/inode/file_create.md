---
title: 파일이 생성되는 과정
weight: 2
---
### 1. 파일 생성 시 발생하는 과정
```bash
touch myfile.txt
```
이 명령어를 실행하면 다음과 같은 일이 발생합니다.

#### 1. 새로운 Inode 할당  
- 파일 시스템은 사용 가능한 **빈 inode**를 찾아 새 파일을 위한 inode를 할당합니다.  
- `ls -i myfile.txt`로 확인 가능.

#### 2. Inode에 파일 메타데이터 기록  
- 파일의 **소유자, 권한, 타임스탬프, 링크 수, 크기(0바이트), 데이터 블록 포인터** 등이 inode에 저장됩니다.  
- `stat myfile.txt`로 확인 가능.

#### 3. 디렉토리 엔트리 생성 (파일 이름과 inode 연결)  
- `myfile.txt`라는 파일 이름이 현재 디렉토리(`.`)에 저장되며, **해당 파일이 가리키는 inode 번호**가 매핑됩니다.  
- `ls -i`를 사용하면 `myfile.txt`가 특정 inode 번호를 가리키고 있는 것을 확인할 수 있습니다.

#### 4. 파일 크기가 0보다 크면 데이터 블록 할당  
- `touch myfile.txt`는 빈 파일을 생성하므로 데이터 블록 할당이 필요하지 않지만,  
  `echo "hello" > myfile.txt`처럼 데이터를 추가하면, 파일 시스템이 **데이터 블록을 할당**하고 이를 inode에 기록합니다.

---

### 2. 파일 생성 후 구조 예시  
`touch myfile.txt` 실행 후 `ls -i myfile.txt`
```bash
ls -i myfile.txt
# 출력 예시: 123456 myfile.txt
```
- 여기서 `123456`은 inode 번호입니다.  
- 해당 inode 정보를 확인하면 아래와 같은 데이터가 보입니다.

```bash
stat myfile.txt
```
출력 예시:
```
  File: myfile.txt
  Size: 0          Blocks: 0          IO Block: 4096   regular file
Device: 802h/2050d    Inode: 123456      Links: 1
Access: 2025-03-26 12:34:56
Modify: 2025-03-26 12:34:56
Change: 2025-03-26 12:34:56
```
- 파일 이름이 디렉토리 엔트리에서 inode(123456)와 연결됨  
- 데이터 블록이 할당되지 않음 (Size: 0, Blocks: 0)  

---

### 3. 파일에 데이터를 쓰면 어떤 일이 일어나는가?
```bash
echo "Hello, World!" > myfile.txt
```
이제 데이터가 추가되었으므로 inode와 데이터 블록에 변화가 생깁니다.

#### 1. 데이터 블록 할당
- 파일 시스템은 빈 데이터 블록을 찾아 데이터를 저장하고,  
- 해당 블록의 위치를 inode에 기록합니다.

#### 2. Inode 정보 업데이트
- 파일 크기(Size) 변경  
- 데이터 블록 포인터 기록  
- 마지막 변경 시간(mtime), 변경된 inode 시간(ctime) 업데이트  

```bash
stat myfile.txt
```
출력 예시:
```
  File: myfile.txt
  Size: 13         Blocks: 8          IO Block: 4096   regular file
Device: 802h/2050d    Inode: 123456      Links: 1
Access: 2025-03-26 12:35:12
Modify: 2025-03-26 12:35:12
Change: 2025-03-26 12:35:12
```
- 파일 크기 증가 (Size: 13)  
- 데이터 블록 할당 (Blocks: 8, 보통 최소 블록 크기가 4KB)  
- inode는 그대로지만 내용 변경됨  

---

### 4. 디렉토리 내부에서는 어떻게 저장될까?
디렉토리는 파일 목록을 inode와 연결하는 역할을 합니다.  
즉, `ls -l`에서 보이는 파일 목록은 **디렉토리 파일의 데이터 블록에 저장된 inode 번호와 파일 이름 목록**입니다.

#### 예제: `ls -il`을 사용해 현재 디렉토리 inode 정보 확인
```bash
ls -il
```
출력 예시:
```
654321 drwxr-xr-x  2 user user 4096 Mar 26 12:30 mydir
123456 -rw-r--r--  1 user user   13 Mar 26 12:35 myfile.txt
```
- `myfile.txt`가 inode `123456`을 가리키고 있음  
- 디렉토리 자체도 inode(654321)를 가짐  

```bash
ls -id .
```
출력 예시:
```
654321 .
```
- 현재 디렉토리 자체도 inode를 가짐 (디렉토리도 파일!)

---

### 5. 정리: 파일 생성 시 내부 동작
1. 파일 생성 요청 → 빈 inode 할당  
2. inode에 파일 정보 저장 (소유자, 권한, 크기 등)  
3. 디렉토리 엔트리에 파일 이름과 inode 연결  
4. 파일 크기가 0이 아니면 데이터 블록을 찾아 할당  
5. 파일 크기 변경 시 inode 메타데이터 갱신  