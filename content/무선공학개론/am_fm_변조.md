---
title: AM FM 변조
---

## DSB-LC (AM, Double SideBand – Large Carrier)

### **스펙트럼**

$$\text{캐리어: } f_c,\quad \text{측파대: } f_c \pm f_m$$

### **AM 신호전력**

$$P_{LC} = \left(1 + \frac{\text{a}^2}{2}\right) P_c$$

### **상·하측파대 전력**

$$P_{\text{side}} = \frac{\text{a}^2}{4} P_c$$

### **변조도**

$$\text{a} = \frac{A_m}{A_c}$$

### **효율 (측파대 전력이 총 전력에서 차지하는 비율)**

$$\eta = \frac{P_{\text{side}}}{P_m} = \frac{\text{a}^2/2}{2+\text{a}^2}$$


# **FM (Frequency Modulation)**

### **주파수 편차**

$$\Delta f = K_f A_m$$

### **변조지수**

$$\beta = \frac{\Delta f}{f_m}$$

### **FM 평균 전력**

$$P = \frac{A_c^2}{2}$$


## **FM 대역폭 (카슨의 법칙)**

$$B = 2(f_m + \Delta f)$$


## **Q 값**

$$Q = \frac{f_0}{\Delta f} \quad \text{또는} \quad Q = \frac{f_0}{f_2 - f_1}$$

### **자유공간 경로손실**

$$\left(\frac{4\pi d}{\lambda}\right)^2 \quad \text{또는} \quad 20\log\left(\frac{4\pi d}{\lambda}\right)\text{ dB}$$


### **이득 관련 식**

* **유효높이**
  $$\text{수신전력} = \text{송신전력} \times \text{안테나 효율}$$
* **직류전류 → 동작이득(Directivity)**
  $$\text{이득} = \text{효율} \times \text{지향성}$$


## 1. **주파수 대역 (Frequency Bands)**

| Band | 이름                       | 특징 / 사용              |
| ---- | ------------------------ | -------------------- |
| LF   | Low Frequency            | 항해 통신                |
| MF   | Medium Frequency         | AM 방송                |
| HF   | High Frequency           | 3–30 MHz, 단파 통신      |
| VHF  | Very High Frequency      | FM 라디오, TV           |
| UHF  | Ultra High Frequency     | TV, LTE, WiFi 일부     |
| SHF  | Super High Frequency     | 마이크로파(레이다), 3–30 GHz |
| EHF  | Extremely High Frequency | 밀리미터파, 30–300 GHz    |

---

## 2. **Shannon 용량 (잡음 존재)**

$$C = B \log_2(1 + \text{SNR})$$

---

## 3. **Nyquist 용량 (잡음 없고, 레벨 L개)**

$$C = 2B \log_2 L$$

---

## 4. **파장 λ, 주파수 f 관계**

$$\lambda  f = c$$

예: $$f = \frac{3 \times 10^8}{1\text{ m}} = 300\text{ MHz}$$

---

## 5. **전계 E, 자계 H 관계 (임피던스)**

전파의 파동 임피던스:

$$\eta = \frac{E}{H} = \sqrt{\frac{\mu}{\epsilon}} \approx 120\pi \, \Omega \approx 377 \, \Omega$$

---

## 6. **자유공간 감쇄 (FSPL, Free Space Path Loss)**

$$\left(\frac{4\pi d}{\lambda}\right)^2$$

dB로는: $$L_{fs} = 20\log \left(\frac{4\pi d}{\lambda}\right)$$

---

## 7. **전력 전달 반사계수 Γ**

부하 임피던스 %%Z_L%%, 특성임피던스 %%Z_0%%:

$$\Gamma = \frac{Z_L - Z_0}{Z_L + Z_0}$$

반사 전력 비율: $$|\Gamma|^2$$

---

## 8. **안테나 이득 (Gain)**

전계 세기로 나타낼 때:

$$G = \frac{P_0}{P} \left(\frac{E}{E_0}\right)^2$$

또는 일반적 표현: $$G = D \times \eta$$ (지향성 × 효율)

---

## 9. **EIRP (Effective Isotropic Radiated Power)**

$$\text{EIRP} = P_t \cdot G_t$$

(송신 전력 × 안테나 이득)

---

## 10. **안테나 종류**

* **전반사 이득**: 트럼펫(혼) 안테나가 큼
* **참조안테나**: 반파장 다이폴(dipole) 기준