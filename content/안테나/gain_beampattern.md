---
title: Gain/Beam Pattern
---
> 특정 방향으로 기준 안테나보다 전력을 얼마나 더 집중해서 보내는지 나타내는 지표

특정 방향에서의 방사 **전력밀도**를 기준으로 측정

* 안테나에 일정한 입력전력 $P_{in}$을 넣는다.
* 안테나로부터 충분히 먼 거리(Far-field)에서 특정 방향의 **전력밀도** (S)를 측정한다.
* 같은 입력전력을 넣은 기준 안테나(등방성 안테나 또는 반파장 다이폴)와 비교한다.

$$
G=\frac{\text{시험 안테나의 전력밀도}}{\text{기준 안테나의 전력밀도}}
$$

## 예시

입력전력 : 1 W

거리 : 10 m

정면 방향에서

* 등방성 안테나 → 0.8 mW/㎡
* 시험 안테나 → 8 mW/㎡

라면

$$G=\frac{8}{0.8}=10
$$

즉


$$10\log_{10}(10)=10\text{ dBi}
$$

실제로는 **전력밀도를 직접 측정하기보다 전계강도를 측정하는 경우가 많다.**

왜냐하면 자유공간에서는

$$S=\frac{E^2}{377}
$$

이므로 전계강도만 측정하면 전력밀도를 바로 계산할 수 있다.

## 절대이득 상대이득
절대 이득 (dBi): 등방성 안테나를 기준으로 한 이득

상대 이득 (dBd): 반파장 다이폴 안테나를 기준으로 한 이득

빔패턴 (dB): 자기 자신의 최대 전력밀도 기준

## dBi (decibel isotropic)
기준 안테나: 등방성 안테나

**특징**

* 모든 방향으로 **균일하게 방사**
* 방향성 없음
* 이득의 **절대 기준(reference)**

## dBd (decibel dipole)

**기준 안테나**

* 반파장 다이폴 안테나 ($\lambda/2$ dipole)

**특징**

* 실제 물리적으로 제작 가능한 안테나
* 도넛 모양 방사 패턴
* 등방성 안테나보다 **최대 방향에서 2.15 dB 더 큼**

## dBi-dBd 변환
$$
\boxed{x\ \text{dBd} = (2.15+x)\ \text{dBi}}
$$

$$
\boxed{x\ \text{dBi} = (x-2.15)\ \text{dBd}}
$$

항상 **최대 방사 방향 기준 변환**이라는 점이 핵심

## 예시

* **0 dBd = 2.15 dBi**
* **5 dBd = 7.15 dBi**
* **8 dBi = 5.85 dBd**

즉,

> **20 dBd 안테나**
> → **22.15 dBi 안테나** (등방성 기준)


## 왜 다이폴이 더 큰가?

### 등방성 안테나

* 모든 방향으로 동일하게 방사
* 최대값 = 평균값

### 반파장 다이폴 안테나

* 위·아래(안테나 축 방향)는 거의 방사하지 않음
* 전력을 **수평 방향으로 집중**
* 특정 방향의 전력 밀도가 증가

그래서 **최대 방사 방향에서만** 더 큰 이득을 가짐

## 2.15 dB

* 반파장 다이폴 최대 지향성:
  $$
  D_{\text{dipole}} \approx 1.64
  $$

* dB 변환:
  $$
  10 \log_{10}(1.64) \approx 2.15 \text{ dB}
  $$

## 중요 포인트
모든 방향에서 2.15 dB 증가가 아닌

**최대 방사 방향에서만** 2.15 dB 증가

> **안테나 이득은 전력을 “새로 만드는 것”이 아니라
> 기존 전력을 특정 방향으로 “몰아주는 것”이다.**

> **반파장 다이폴 안테나는
> 등방성 안테나 대비 최대 방사 방향에서
> 약 2.15 dB 더 큰 이득을 가진다.**

$$
\boxed{0\ \text{dBd} = 2.15\ \text{dBi}}
$$

# 빔패턴(Beam Pattern)
빔 패턴은 안테나가 방향별로 전파를 얼마나 강하게 방사하거나 수신하는지를 나타낸 그림이다.

일반적으로 방사 패턴은 최대 방사 방향의 전력밀도를 기준으로 정규화해서 표시한다.

$$P\_{\text{normalized}}(\theta,\phi) = \frac{S(\theta,\phi)}{S\_{\max}}$$

- $(S(\theta,\phi))$: 해당 방향의 전력밀도
- $(S\_{\max}\\)$: 최대 방향의 전력밀도

[Antenna Radiation Pattern at Cheryl Franklin blog](https://images.openai.com/static-rsc-4/79OjfTJffwK7i_vB-g6hIvUxvdfEJvlMZfK-kD2Z3CXKI8siJOMN11d0wpCKgV_up5DHQmGYKXyNwLDXzdT9Nym8bT9tLwOQkMKbe9U1GMxTc6_Ai-zhaEEZXomC_CXjhC37TzasF0qeGzI7Nwvyfnitm2s3BfRxfnOBBcQOzdM?purpose=inline)

[storage.googleapis.com](https://storage.googleapis.com/dsnavjzsqbjtse/antenna-radiation-pattern.html?utm_source=chatgpt.com)

1. 등방성 안테나 기준: 안테나 이득(Gain)을 dBi로 표현할 때 사용하는 기준
2. 최대 전력밀도 기준: 빔 패턴을 정규화해서 방향별 상대적인 방사 강도를 표시할 때 사용하는 기준

예를 들어 최대 방향을 0 dB로 놓으면 다른 방향은 다음처럼 표현할 수 있다.

| 방향       | 상대 전력  |
| -------- | ------ |
| 최대 방사 방향 | 0 dB   |
| 측면 방향    | -10 dB |
| 후방 방향    | -20 dB |