---
title: LVM
weight: 8
---
"디스크", "파티션", "LVM"은 리눅스 시스템이나 서버 관리에서 자주 다루는 저장장치 관련 개념

---

### 1. **디스크 (Disk)**
- **물리적인 저장 장치**입니다.
- 예시: `/dev/sda`, `/dev/nvme0n1`, `/dev/vdb` 등.
- 하드디스크(HDD), SSD, NVMe 등 물리적으로 존재하는 저장 매체

---

### 2. **파티션 (Partition)**
- **디스크를 논리적으로 나눈 구역**
- 예시: `/dev/sda1`, `/dev/sda2` 등 (`/dev/sda` 디스크의 첫 번째, 두 번째 파티션).
- 하나의 디스크에 여러 개의 파티션을 만들어, OS, 스왑, 데이터 용도 등으로 나눌 수 있음
- 파티션 테이블 종류: `MBR`, `GPT`

---

### 3. **LVM (Logical Volume Manager)**
- **디스크 관리를 유연하게 해주는 논리 볼륨 관리 기술**
- 파티션보다 더 유동적인 디스크 공간 관리를 가능하게 함.

**LVM 구조는 다음과 같습니다:**
1. **Physical Volume (PV)**: 실제 디스크나 파티션을 LVM에 등록한 것 (`/dev/sda2` 등).
2. **Volume Group (VG)**: 여러 PV를 묶어 하나의 큰 저장 공간을 만듦.
3. **Logical Volume (LV)**: VG에서 필요한 만큼 잘라서 만든 논리 볼륨. 이것을 파일 시스템으로 포맷해서 사용 (`/dev/myvg/mylv` 등).

**장점:**
- LV 크기 조절(확장/축소)이 쉬움
- 여러 디스크를 하나로 묶을 수 있음
- 스냅샷 기능 가능

---

### 예시 그림 구조:

```
디스크 (/dev/sda)
 └── 파티션 (/dev/sda1)
      └── Physical Volume (PV)
           └── Volume Group (VG)
                └── Logical Volume (LV)
                     └── 파일 시스템 (ext4 등)
```