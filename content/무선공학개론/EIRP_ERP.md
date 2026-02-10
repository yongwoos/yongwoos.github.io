---
title: EIRP와 ERP
---
## 📡 EIRP란?

**EIRP (Equivalent Isotropically Radiated Power)**
👉 **등방성 안테나가 방사한다고 가정했을 때,
같은 최대 전력 밀도를 만들기 위해 필요한 방사 전력**

즉,

> **“이 안테나 + 송신 전력 조합을
> 등방성 안테나로 환산하면 얼마냐”**

---

## 🔢 기본 공식

### dB 단위 (가장 중요)

$$
\boxed{\text{EIRP(dBm)} = P_\text{tx}(dBm) + G_\text{ant}(dBi) - L(dB)}
$$

* $$(P_\text{tx})$$: 송신기(중계기기) 출력
* $$(G_\text{ant})$$: 안테나 이득 (**반드시 dBi**)
* $$(L)$$: 케이블·커넥터 손실

---

## 🔁 왜 dBi만 쓰냐?

EIRP는 **“등방성 기준”** 이기 때문.

* 안테나 이득이 dBd로 주어지면:
  $$
  G(dBi) = G(dBd) + 2.15
  $$

---

## 📌 예제

### 예제 1

* 송신 전력: **30 dBm (1 W)**
* 안테나 이득: **15 dBi**
* 손실: **2 dB**

$$
\text{EIRP} = 30 + 15 - 2 = \boxed{43\ \text{dBm}}
$$

👉 등방성 안테나가 **20 W**로 쏘는 것과 같은 최대 전력 밀도

---

### 예제 2 (dBd → dBi 변환)

* 안테나 이득: **20 dBd**
  $$
  = 22.15\ \text{dBi}
  $$

송신 전력 10 dBm, 손실 0 dB라면:
$$
\text{EIRP} = 10 + 22.15 = \boxed{32.15\ \text{dBm}}
$$

---

## ⚠️ 왜 중요하냐?

* **전파법 규제**는 대부분 **EIRP 기준**
* Wi-Fi, LTE, 위성통신, 레이더 전부 EIRP로 제한

---

## 📡 EIRP vs ERP 한눈에 비교

| 구분        | **EIRP**                                | **ERP**                  |
| --------- | --------------------------------------- | ------------------------ |
| 풀네임       | Equivalent **Isotropic** Radiated Power | Effective Radiated Power |
| 기준 안테나    | **등방성 안테나**                             | **반파장 다이폴 안테나**          |
| 안테나 이득 기준 | dBi                                     | dBd                      |
| 국제 표준     | ✅ (대부분 국가/규격)                           | 일부 방송·레거시 규격             |
| 값의 크기     | ERP + **2.15 dB**                       | EIRP − **2.15 dB**       |

---

## 🔢 공식

### EIRP

$$
\boxed{\text{EIRP(dBm)} = P_\text{tx}(dBm) + G(dBi) - L}
$$

### ERP

$$
\boxed{\text{ERP(dBm)} = P_\text{tx}(dBm) + G(dBd) - L}
$$


## 🔁 변환 관계 (중요)

$$
\boxed{\text{EIRP} = \text{ERP} + 2.15\ \text{dB}}
$$
$$
\boxed{\text{ERP} = \text{EIRP} - 2.15\ \text{dB}}
$$


## 📌 예제

### 예제 1

* ERP = **20 dBm**
  $$
  \Rightarrow \text{EIRP} = 22.15\ \text{dBm}
  $$

### 예제 2

* 송신기: 30 dBm
* 안테나: 15 dBi
* 손실: 3 dB

$$
\text{EIRP} = 30 + 15 - 3 = 42\ \text{dBm}
$$
$$
\text{ERP} = 42 - 2.15 = 39.85\ \text{dBm}
$$


## ⚠️ 실무에서 주의할 점

* **규제 문서가 EIRP인지 ERP인지 반드시 확인**
* Wi-Fi / LTE / 5G / 위성 → 거의 **EIRP**
* 지상파 방송, FM → **ERP** 쓰는 경우 많음


## 🧠 한 줄 요약

> **EIRP = 등방성 기준
> ERP = 다이폴 기준
> 차이는 항상 2.15 dB**
