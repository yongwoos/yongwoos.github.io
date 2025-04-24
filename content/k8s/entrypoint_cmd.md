---
title: ENTRYPOINT vs CMD
weight: -2
---
`Dockerfile`의 `ENTRYPOINT`와 `CMD`는 컨테이너가 **시작할 때 실행할 명령어**를 정의하는데 사용하는 두 가지 지시어

## ENTRYPOINT vs CMD

| 항목 | `ENTRYPOINT` | `CMD` |
|------|--------------|-------|
| 역할 | **기본 실행 명령어** 지정 | **기본 인자** 지정 |
| 우선순위 | 항상 실행됨 | `docker run` 시 인자로 **덮어쓸 수 있음** |
| 목적 | 이 이미지가 실행될 때 항상 수행할 **고정된 명령어** | 사용자나 실행 환경이 바꾸고 싶은 **유연한 값** |
| 형태 | exec 형식 (`["executable", "param1"]`) 또는 shell 형식 (`"some command"`) | exec 또는 shell 형식 |
| 함께 사용 | 보통 `ENTRYPOINT` + `CMD` 조합으로 사용 | 단독 사용도 가능 |

---

### 예제 1: CMD만 사용하는 경우

```Dockerfile
FROM ubuntu
CMD ["echo", "Hello World"]
```

```bash
docker run my-image
# 출력: Hello World

docker run my-image echo Bye
# 출력: Bye ← CMD는 덮어쓰기됨
```

---

### 예제 2: ENTRYPOINT만 사용하는 경우

```Dockerfile
FROM ubuntu
ENTRYPOINT ["echo", "Hello"]
```

```bash
docker run my-image
# 출력: Hello

docker run my-image World
# 출력: Hello World ← ENTRYPOINT는 고정, 인자만 추가됨
```

---

### 예제 3: ENTRYPOINT + CMD 조합

```Dockerfile
FROM ubuntu
ENTRYPOINT ["echo"]
CMD ["Hello World"]
```

```bash
docker run my-image
# 출력: Hello World

docker run my-image Bye
# 출력: Bye ← CMD가 덮어씌워짐, ENTRYPOINT는 그대로
```

---

## Kubernetes에서의 관계

Kubernetes의 `command`와 `args`는 Docker의 `ENTRYPOINT`와 `CMD`를 오버라이드할 수 있음:

| Dockerfile 지시어 | Kubernetes 필드 |
|------------------|-----------------|
| `ENTRYPOINT`     | `command`       |
| `CMD`            | `args`          |

예를 들어:

```Dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
```

이런 Dockerfile을 기반으로 만든 이미지를 Kubernetes에서 이렇게 쓴다면:

```yaml
command: ["python3"]
args: ["server.py"]
```

→ 컨테이너는 `python3 server.py`를 실행

---

## 요약

- `ENTRYPOINT`: 항상 실행할 명령어 (덮어쓰기 어려움)
- `CMD`: 기본 인자 (필요하면 덮어쓰기 가능)
- Kubernetes에서는 `command` → ENTRYPOINT, `args` → CMD 오버라이드