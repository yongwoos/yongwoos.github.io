---
title: FM
---
**직접 FM**: 발진 주파수를 직접 변화시킵니다.

**간접 FM (Armstrong 방식)**: **수정 발진기**의 안정된 주파수를 사용하여 위상을 변화시킨 후 FM 신호를 얻습니다.

주파수 안정도가 매우 높습니다. 수정 발진기를 사용하여 주파수 안정도를 높인 뒤, **위상 변조기** 를 거쳐 FM 파를 얻는 방식입니다.

송신신호가 %%cos(2\pi f_m t)%%, 반송파신호가 %%A_c \cos(2\pi f_c t)%%인 경우

$$
s(t) = A_c \cos(2\pi f_c t + \beta_f \int_0^t \cos(2\pi f_m \tau) d\tau)
$$

$$
= A_c \cos(2\pi f_c t + \beta_f \sin(2\pi f_m t))
$$

\[
s(t)=A_c\cos\left(2\pi f_ct+2\pi k_f\int_0^tm(\tau)d\tau\right)
\]

순시 주파수

\[
f_i(t)=f_c+k_fm(t)
\]

최대 주파수 편이

\[
\Delta f=k_fA_m
\]


## FM 평균 전력
$$P_{FM} = \frac{A_c^2}{2}$$

FM은 포락선(Envelope)이 일정하므로 **전력은 변조도와 무관하게 일정**

## FM 주요 현상
* 포획 효과 (Capture Effect)
    * 동일 주파수 대역 내에 두 개의 신호가 있을 때, 더 강한 FM 신호가 약한 신호를 억누르고 채널을 독점하는 현상 (간섭 배제 능력 우수).
* 임계 현상 (Threshold Effect)
    * 수신 입력 SNR이 특정 임계값 이하로 떨어지면 출력 SNR이 급격히 나빠지는 현상.

## 프리엠페시스와 디엠페시스
* **프리엠페시스 (Pre-emphasis):** 송신기에서 고주파 성분을 강조하여 잡음 영향을 줄이는 기법.   
* **디엠페시스 (De-emphasis):** 수신기에서 프리엠페시스된 신호를 원래대로 복원하는 기법.

## 수퍼헤테로다인 수신기
수신된 고주파(RF) 신호를 **중간 주파수(IF, Intermediate Frequency)** 로 변환하여 처리하는 방식입니다. 직접 증폭 방식보다 훨씬 안정적이고 선택도가 높습니다.

**1. RF 증폭기 (RF Amplifier)**
안테나로 수신된 미약한 신호를 1차 증폭. 잡음 지수(NF)에 직접 영향을 줍니다.

**2. 국부 발진기 (Local Oscillator, LO)**
수신 주파수보다 IF만큼 높은(또는 낮은) 신호를 생성합니다.
$$f_{LO} = f_{RF} + f_{IF} \quad \text{(high-side injection)}$$

**3. 혼합기 (Mixer)**
RF 신호와 LO 신호를 곱하여 IF 신호로 변환합니다.
$$f_{IF} = |f_{LO} - f_{RF}|$$

**4. IF 필터 & 증폭기**
고정된 IF에서 대역통과 필터링 및 주 증폭을 수행합니다. 선택도(Selectivity)의 핵심.

**5. 복조기 (Demodulator)**
IF 신호에서 원래 정보(음성, 데이터 등)를 복원합니다.

**6. AGC (Automatic Gain Control)**
수신 신호 강도에 따라 이득을 자동 조절합니다.

### 신호 흐름

```
안테나 → RF Amp → Mixer → IF Filter/Amp → Demodulator → 출력
                     ↑
                Local Oscillator
```

### 핵심 장점

| 항목 | 설명 |
|------|------|
| **고선택도** | 고정 IF에서 날카로운 필터 설계 가능 |
| **고감도** | 다단 IF 증폭으로 미약 신호 처리 |
| **안정성** | 주 증폭이 IF에서 이루어져 발진 위험 낮음 |
| **조정 용이** | LO 주파수만 바꿔 채널 선택 |

### 주요 문제점

* **영상 주파수 간섭 (Image Frequency)**: $f_{image} = f_{RF} + 2f_{IF}$ 에서 들어오는 불요 신호. RF단 앞에 image reject filter 필요
* **IF 피드스루**: LO 신호가 안테나로 역방사될 수 있음
* **스퍼리어스 응답**: 혼합 과정에서 생기는 불필요한 주파수 성분

### 일반적인 IF 주파수

* AM 방송: **455 kHz**
* FM 방송: **10.7 MHz**
* TV/위성: **70 MHz, 140 MHz**
* GPS 수신기: **4.092 MHz**

### 현대적 발전

더블 슈퍼헤테로다인(두 번 주파수 변환), SDR(Software Defined Radio)과의 결합, 그리고 직접 변환(Direct Conversion) 방식과의 경쟁 속에서도 슈퍼헤테로다인 구조는 고성능 수신기의 표준으로 널리 사용되고 있습니다.

## FM 대역폭 - 칼슨 법칙
$$B_{FM} \approx 2(\Delta f + f_m) = 2f_m(1 + \beta_f)$$