---
title: FM
---
송신신호가 %%cos(2\pi f_m t)%%, 반송파신호가 %%A_c \cos(2\pi f_c t)%%인 경우

$$
s(t) = A_c \cos(2\pi f_c t + \beta_f \int_0^t \cos(2\pi f_m \tau) d\tau)
$$
$$
=
A_c \cos(2\pi f_c t + \beta_f \sin(2\pi f_m t))
$$
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

## 수신기 주파수 계획 (Superheterodyne)
중간주파수=수신주파수+-국부발진기주파수

* **영상 주파수 (Image Frequency, %%f_{img}%%):**
원하지 않는 간섭 신호가 수신되는 주파수

영상주파수=수신주파수+-중간주파수*2

## FM 대역폭 - 칼슨 법칙
$$B_{FM} \approx 2(\Delta f + f_m) = 2f_m(1 + \beta_f)$$