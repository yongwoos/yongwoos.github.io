---
title: Sinc 함수
---
# Sinc 함수
Sinc 함수는 신호처리 및 통신 이론에서 중요한 역할을 하는 함수로, 주로 이상적인 저역통과 필터의 임펄스 응답으로 사용됩니다. Sinc 함수는 다음과 같이 정의됩니다.

$$\text{sinc}(t) = \frac{\sin(\pi t)}{\pi t}$$

여기서 %%t%%는 시간 변수입니다. Sinc 함수는 %%t = 0%%에서 정의되지 않지만, 극한값을 사용하여 %%\text{sinc}(0) = 1%%로 정의됩니다.
## 주요 특성
1. **제로 교차점**: Sinc 함수는 %%t = n%% (%%n%%은 0이 아닌 정수)에서 제로 교차점을 가집니다.
2. **주요 최대값**: Sinc 함수는 %%t = 0%%에서 최대값을 가지며, 이 값은 1입니다.
3. **주기성**: Sinc 함수는 주기적이지 않지만, 주기적인 신호의 스펙트럼을 나타내는 데 사용됩니다.
4. **적분**: Sinc 함수의 적분은 다음과 같습니다.
$$\int_{-\infty}^{\infty} \text{sinc}(t) dt = 1$$

## ✅ 최종 요약 (시험 직전 암기)

$$
\boxed{
\begin{aligned}
\operatorname{rect}\left(\frac{t}{a}\right) &\leftrightarrow |a|\,\operatorname{sinc}(af) \\
\operatorname{rect}(at) &\leftrightarrow \frac{1}{|a|}\,\operatorname{sinc}\left(\frac{f}{a}\right) \\
\operatorname{sinc}\left(\frac{f}{a}\right) &\leftrightarrow |a|\,\operatorname{rect}(at) \\
\operatorname{sinc}(af) &\leftrightarrow \frac{1}{|a|}\,\operatorname{rect}\left(\frac{t}{a}\right)
\end{aligned}
}
$$