---
title: COMMAND vs ARGS
weight: -1
---
두 방식 모두 **Kubernetes Pod 혹은 Docker 컨테이너의 `command`와 `args` 설정**에서 사용되는 형식인데, 실제로는 **동일한 쉘 명령어를 실행**하지만 **구문적으로 차이**

### 1. `command`와 `args`를 분리한 형태
```yaml
command: ["/bin/sh"]
args: ["-c", "while true; do echo hello; sleep 10;done"]
```

- `/bin/sh`를 **실행 파일(command)** 로 설정
- `args`는 **실행 파일에 넘겨줄 인자(argument)** 목록
  - 첫 번째 인자 `-c`: 뒤의 문자열을 명령어로 실행하라는 의미
  - 두 번째 인자 `"while true; do echo hello; sleep 10;done"`: 실제로 실행할 쉘 스크립트

**결론:** 이 방식은 **실행파일(command) + 인자(args)**를 명확히 나눔.

---

### 2. command에서 한 번에 정의한 형태
```yaml
command: ["/bin/sh", "-c", "while true; do echo hello; sleep 10;done"]
```

- `command`에 실행파일과 인자를 **한꺼번에 정의**
- `args`는 생략됨 (또는 없어도 됨)

이 방식도 결국 `/bin/sh`를 실행하고 `-c` 옵션과 함께 쉘 명령어를 전달.

---

### 어떤 차이가 있을까?
실제로 **컨테이너 런타임에서 실행되는 명령어는 똑같음**. 하지만:

| 구분 | `command + args` 분리 | `command`만 사용 |
|------|------------------------|-------------------|
| 구성 | 명확하게 분리됨        | 단순한 구성       |
| 유연성 | Dockerfile의 `ENTRYPOINT`와 `CMD` 분리 적용 가능 | 덮어쓰기 어려움 |
| 실수 가능성 | 덜함 (`command`가 확실히 `/bin/sh`) | `command`가 길어져서 헷갈릴 수 있음 |

---

### 요약
- 둘 다 **같은 명령을 실행**한다.
- 첫 번째 방식은 `command`와 `args`를 명확하게 나눠서 가독성과 구조적 명확성에서 유리.
- 두 번째 방식은 간결하지만, `command`가 길어질 경우 디버깅이 어렵고 실수할 여지가 있음.

---

실제로 쿠버네티스에서 뭔가 복잡한 명령어를 실행할 땐 **첫 번째 방식(`command`와 `args`를 나누는)** 형식이 **더 권장**


`args`는 Dockerfile의 `CMD`처럼 오버라이드 가능.

정리하자면:

---

## Dockerfile

```Dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
```

- 이 이미지를 컨테이너로 실행하면 기본적으로 `python app.py`가 실행됨.
- `CMD`는 기본 인자이기 때문에 `docker run myimage something.py`처럼 실행하면 **`app.py` 대신 `something.py`로 덮어씌워짐**.

---

## Kubernetes에서는

```yaml
command: ["python"]
args: ["main.py"]
```

이건 Dockerfile로 따지면:

```Dockerfile
ENTRYPOINT ["python"]
CMD ["main.py"]
```

즉:

| Dockerfile | Kubernetes |
|------------|------------|
| ENTRYPOINT | `command` |
| CMD        | `args`    |

---

## 그래서 정답:

### `args`는 Dockerfile의 `CMD`처럼 오버라이드된다

### 예시

**Dockerfile:**
```Dockerfile
FROM python:3.10
ENTRYPOINT ["python"]
CMD ["default.py"]
```

**Kubernetes Pod:**
```yaml
containers:
- name: test
  image: my-image
  args: ["override.py"]
```

→ 실행 결과: `python override.py`

---

## 반대로도 가능

**Dockerfile에 ENTRYPOINT만 있고 CMD 없음:**
```Dockerfile
ENTRYPOINT ["python"]
```

**Kubernetes에서 `args`만 주면:**
```yaml
args: ["script.py"]
```

→ 실행 결과: `python script.py`