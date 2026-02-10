---
title: FM
---
## FM 평균 전력
    $$P_{FM} = \frac{A_c^2}{2}$$
    * 특징: FM은 포락선(Envelope)이 일정하므로 **전력은 변조도와 무관하게 일정**합니다.

## FM 주요 현상
* 포획 효과 (Capture Effect)
    * 동일 주파수 대역 내에 두 개의 신호가 있을 때, 더 강한 FM 신호가 약한 신호를 억누르고 채널을 독점하는 현상 (간섭 배제 능력 우수).
* 임계 현상 (Threshold Effect)
    * 수신 입력 SNR이 특정 임계값 이하로 떨어지면 출력 SNR이 급격히 나빠지는 현상.


## 수신기 주파수 계획 (Superheterodyne)
* **국부 발진 주파수 (Local Oscillator, %%f_{LO}%%):**
    $$f_{LO} = f_{RF} + f_{IF} \quad (\text{High-side injection})$$
    * %%f_{RF}%%: 수신 주파수, %%f_{IF}%%: 중간 주파수

* **영상 주파수 (Image Frequency, %%f_{img}%%):**
    원하지 않는 간섭 신호가 수신되는 주파수입니다.
    $$f_{img} = f_{RF} + 2f_{IF}$$
    *(필기에 "수신주파수 + 2 %%\times%% 중간주파수"로 정확히 기재되어 있습니다)*

## FM 대역폭 - 칼슨 법칙
$$B_{FM} \approx 2(\Delta f + f_m) = 2f_m(1 + \beta_f)$$