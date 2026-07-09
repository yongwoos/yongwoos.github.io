---
title: Sinc 함수
---
$$\text{sinc}(t) = \frac{\sin(\pi t)}{\pi t}$$

1. **제로 교차점**: Sinc 함수는 $t = n$ ($n$은 0이 아닌 정수)에서 제로 교차점을 가집니다.
2. **주요 최대값**: Sinc 함수는 $t = 0$에서 최대값을 가지며, 이 값은 1입니다.
3. **주기성**: Sinc 함수는 주기적이지 않지만, 주기적인 신호의 스펙트럼을 나타내는 데 사용됩니다.
4. **적분**: Sinc 함수의 적분은 다음과 같습니다.
$$\int_{-\infty}^{\infty} \text{sinc}(t) dt = 1$$


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

## 응용
시간 영역에서 연속인 신호
$g(t) = \operatorname{sinc}(2t)$의 **에너지**는?

연속 신호 $g(t)$의 에너지 $E$는

$$
E = \int_{-\infty}^{\infty} |g(t)|^2 \, dt
$$


### 기본 성질


$$
\int_{-\infty}^{\infty} \operatorname{sinc}^2(t)\,dt = 1
$$

그리고 **시간 스케일링 성질**:

$$
g(t) = \operatorname{sinc}(at) \quad\Rightarrow\quad E = \frac{1}{|a|}
$$
여기서는
$$
g(t) = \operatorname{sinc}(2t)
$$

따라서 에너지는

$$
E = \frac{1}{2}
$$

* $\operatorname{sinc}^2(t)$ 적분값 = $1$
* $\operatorname{sinc}(at)$ → 에너지 = $\frac{1}{|a|}$
* **주파수 늘어나면(시간 압축) → 에너지 감소**