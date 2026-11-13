---
title: OFDM스펙
---
# **OFDM / 5G NR 스펙 정리**

OFDM(Orthogonal Frequency Division Multiplexing)은 하나의 넓은 주파수 대역을 여러 개의 좁은 부반송파(Subcarrier)로 나누고, 여러 데이터를 병렬로 전송하는 다중 반송파 변조 방식이다.

5G NR은 OFDM을 기반으로 하며, 하향링크(Downlink)는 CP-OFDM, 상향링크(Uplink)는 CP-OFDM 또는 DFT-s-OFDM을 사용한다.

## **1. OFDM 핵심 구성요소**

| 용어                | 의미                       | 5G 기준 예시 |
| ----------------- | ------------------------ | -------- |
| Channel Bandwidth | 기지국이 사용하는 전체 채널 폭        | 100MHz   |
| Subcarrier        | 데이터를 전송하는 개별 주파수 성분      | 간격 30kHz |
| SCS               | 부반송파 간격                  | 30kHz    |
| OFDM Symbol       | 여러 부반송파가 동시에 전송하는 시간 단위  | 약 35.7μs |
| RB                | 부반송파 12개 묶음              | 360kHz   |
| RE                | 부반송파 1개와 OFDM 심볼 1개의 교차점 | 최소 자원 단위 |
| Slot              | OFDM 심볼 14개로 구성된 시간 단위   | 0.5ms    |

## **2. 시간 및 주파수 구조**

OFDM은 시간축과 주파수축으로 자원을 나눈다.

![5G basic understanding for RB, PRB, RE - 5G NR - telecomHall Forum](https://images.openai.com/static-rsc-4/cWmJM4d_jaVfMDUXR7rIcg65SQGp-WYEcWjh4ckI1lQ5EsQDY1E_DohjLWdijq_P2XVLu_EJLrrnTsC8xQhmq5z0LhOdEEGfw8kyV_r58bDK3HF1LjKrVU4Er9BECeX6QItO3q_-o49iHP605TKavGzyasKkWzq4shvwKdBzKbM?purpose=inline)

![telecomhall.net](https://www.telecomhall.net/t/5g-basic-understanding-for-rb-prb-re/9323?utm_source=chatgpt.com)

- 주파수축: 부반송파 단위로 분할
- 시간축: OFDM 심볼 단위로 분할
- RE: 두 축이 교차하는 한 칸
- RB: 주파수축의 연속된 부반송파 12개

따라서 RB 하나를 슬롯 전체에 걸쳐 사용하면 다음과 같다.

\\[ 12 \times 14 = 168\ RE \\]

## **3. 주요 수식**

### **① 부반송파 간격**

5G NR의 부반송파 간격은 다음과 같이 결정된다.

\\[ \Delta f = 15 \times 2^\mu\ kHz \\]

| Numerology \\(\mu\\) | SCS    | 슬롯 길이    |
| -------------------- | ------ | -------- |
| 0                    | 15kHz  | 1ms      |
| 1                    | 30kHz  | 0.5ms    |
| 2                    | 60kHz  | 0.25ms   |
| 3                    | 120kHz | 0.125ms  |
| 4                    | 240kHz | 0.0625ms |

부반송파 간격이 커질수록 심볼 길이와 슬롯 길이는 짧아진다.

### **② OFDM 심볼 유효 시간**

\\[ T_u = \frac{1}{\Delta f} \\]

30kHz인 경우:

\\[ T_u = \frac{1}{30000} \approx 33.33\mu s \\]

여기에 CP(Cyclic Prefix)가 추가된다.

### **③ RB 대역폭**

\\[ B\_{RB}=12\times\Delta f \\]

30kHz인 경우:

\\[ B\_{RB}=12\times30=360kHz \\]

## **4. 5G 100MHz 대역폭 계산 예시**

3.5GHz 대역에서 100MHz 채널, SCS 30kHz를 사용한다고 가정하자.

| 항목          | 계산         | 결과     |
| ----------- | ---------- | ------ |
| RB 개수       | NR 규격 기준   | 273개   |
| RB당 부반송파    | 고정         | 12개    |
| 전체 부반송파     | 273 × 12   | 3,276개 |
| RB당 대역폭     | 12 × 30kHz | 360kHz |
| 슬롯당 OFDM 심볼 | Normal CP  | 14개    |
| 슬롯 길이       | 1ms ÷ 2    | 0.5ms  |
| 초당 슬롯       | 1 ÷ 0.0005 | 2,000개 |

## **5. 변조 방식과 데이터 전송량**

각 RE에 QAM 변조 심볼 하나를 실을 수 있다.

| 변조 방식   | 심볼당 비트 수 |
| ------- | -------- |
| QPSK    | 2bit     |
| 16-QAM  | 4bit     |
| 64-QAM  | 6bit     |
| 256-QAM | 8bit     |

전송 가능한 원시 비트 수는 다음과 같이 계산한다.

\\[ N\_{\text{bits}} = N\_{RB}\times12\times N\_{\text{symbol}}\times Q_m \\]

예를 들어 RB 273개, OFDM 심볼 14개, 256-QAM이라면:

\\[ 273\times12\times14\times8 =366,912bit \\]

이를 0.5ms로 나누면 약 733.8Mbps가 된다.

단, 이것은 모든 RE가 데이터 전송에 사용된다고 가정한 부호화 전 원시 전송량이다. 실제 전송률은 채널 코딩률, DM-RS, 제어채널, 기타 오버헤드 등에 따라 낮아진다.

## **6. CP(Cyclic Prefix)**

![OFDM](https://images.openai.com/static-rsc-4/UxSts7usS_HWtvpPzeOC92iZ4-Je1z2CAUmWIZMTnOCveqtsvf7qhBkQE8js7IOgR2lV2DEiDtgnDsGeOSNILDjhH3tNlU_w-JHX2HDqcEWqvzgp_xJucR2XEfyGPR_ua3kOB81ae3dXO-txBpBUK_Mpwwq_I3-3kGCfj1sIovw?purpose=inline)

OFDM은 여러 부반송파를 동시에 전송하기 때문에 다중경로로 인해 이전 심볼의 신호가 다음 심볼에 간섭을 일으킬 수 있다.

이를 해결하기 위해 OFDM 심볼 앞부분에 CP라는 보호 구간을 추가한다.

CP의 역할은 다음과 같다.

1. 다중경로에 의한 심볼 간 간섭(ISI) 방지
2. 주파수 영역에서 직교성 유지에 도움
3. 수신기에서 FFT 처리를 통한 신호 복원 용이

CP는 데이터를 추가로 전달하는 구간이 아니라 보호를 위한 구간이다.

## **7. OFDM의 장단점**

| 장점                 | 단점              |
| ------------------ | --------------- |
| 다중경로 페이딩에 강함       | PAPR이 높음        |
| 주파수 자원을 효율적으로 사용   | 주파수 오차에 민감      |
| 다수의 사용자에게 자원 할당 용이 | 송신기 선형성 요구      |
| 주파수 선택적 페이딩 대응 용이  | CP로 인한 전송 효율 감소 |

\*\*PAPR(Peak-to-Average Power Ratio)\*\*은 신호의 최대 순간 전력이 평균 전력보다 얼마나 큰지를 나타낸다. OFDM은 여러 부반송파 신호가 합쳐지면서 순간적으로 큰 진폭이 발생할 수 있다.

## **8. OFDM과 OFDMA 차이**

이 둘은 구분해서 알아두는 것이 좋아.

| 구분 | OFDM           | OFDMA                |
| -- | -------------- | -------------------- |
| 의미 | 직교 주파수 분할 다중화  | 직교 주파수 분할 다중 접속      |
| 목적 | 데이터를 병렬 전송     | 여러 사용자에게 자원 할당       |
| 특징 | 여러 부반송파 사용     | 사용자별 부반송파 및 시간 자원 할당 |
| 활용 | 5G 무선 전송 기반 기술 | 5G 다중 사용자 스케줄링       |

예를 들어 273개 RB가 있는 기지국에서 A에게 100개, B에게 100개, C에게 73개를 할당하는 방식이 OFDMA의 사용자 자원 할당 개념이야.

## **9. 전체 개념 연결**

## **5G NR 자원 구조 계층**

**채널 대역폭**

# **100MHz**

**Resource Block**

# **273개**

각 RB = 부반송파 12개

**Resource Element**

# **RB × OFDM 심볼**

부반송파 1개 × OFDM 심볼 1개

**QAM 변조**

# **2\~8bit**

RE 하나에 변조 심볼 하나

**면접에서 기억할 핵심 5가지**

1. OFDM은 직교성을 이용해 여러 부반송파를 병렬 전송하는 기술이다.
2. SCS는 부반송파 사이의 주파수 간격이다.
3. RB는 12개의 연속된 부반송파로 구성된다.
4. RE는 부반송파와 OFDM 심볼이 만나는 최소 자원 단위다.
5. CP는 다중경로로 발생하는 심볼 간 간섭을 방지하기 위한 보호 구간이다.