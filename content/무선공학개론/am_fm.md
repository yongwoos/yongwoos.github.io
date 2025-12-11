---
title: AM / FM 정리
---

## DSB-LC (AM, Double SideBand – Large Carrier)

### **스펙트럼**

$$\text{캐리어: } f_c,\quad \text{측파대: } f_c \pm f_m$$

### **AM 신호전력**

$$P_m = \left(1 + \frac{\mu^2}{2}\right) P_c$$

### **상·하측파대 전력**

$$P_{\text{side}} = \frac{\mu^2}{4} P_c$$

### **변조도**

$$\mu = \frac{A_m}{A_c}$$

### **효율 (측파대 전력이 총 전력에서 차지하는 비율)**

$$\eta = \frac{P_{\text{side}}}{P_m} = \frac{\mu^2/2}{2+\mu^2}$$


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