---
title: 동시성
weight: 5
---
## blocking non-blocking 차이
"Blocking"과 "Non-blocking"은 프로그래밍에서 주로 입출력(I/O) 작업과 관련하여 사용되는 개념입니다. 두 용어는 주로 멀티태스킹이나 비동기 작업 처리에 관련된 방식에서 차이를 보입니다. 그 차이를 이해하려면, 기본적으로 프로그램이 작업을 처리하는 방식이 어떻게 다른지 살펴보는 것이 중요합니다.

### 1. **Blocking (차단)**
   - **정의**: 블로킹 방식에서는 특정 작업이 완료될 때까지 프로그램의 흐름이 "차단"됩니다. 예를 들어, 네트워크 요청을 보내고 응답을 기다리는 동안, 프로그램은 그 작업이 끝날 때까지 다른 작업을 하지 않습니다.
   - **예시**: 파일을 읽을 때, 파일이 모두 읽혀질 때까지 프로그램은 멈춰서 기다립니다. 이 동안 다른 작업은 수행되지 않습니다.
   - **특징**:
     - 작업이 완료될 때까지 기다려야 하므로 처리 시간이 길어질 수 있습니다.
     - 프로그램이 동시에 여러 작업을 처리하려면 다중 스레드나 프로세스가 필요할 수 있습니다.

### 2. **Non-blocking (비차단)**
   - **정의**: 비차단 방식에서는 작업을 요청하고, 그 작업이 완료될 때까지 기다리지 않고 다른 작업을 계속 진행할 수 있습니다. 작업이 완료되면 알림을 통해 결과를 처리할 수 있습니다.
   - **예시**: 파일을 읽을 때, 파일을 읽는 동안 프로그램은 다른 작업을 계속할 수 있습니다. 읽기가 완료되면 그때 파일 데이터를 처리합니다.
   - **특징**:
     - 프로그램이 작업을 완료하는 데 시간이 걸리는 동안 다른 일을 할 수 있기 때문에 효율적입니다.
     - 비동기 프로그래밍을 통해 한 번에 여러 작업을 동시에 처리할 수 있습니다.

### 차이점 정리
| **특징**             | **Blocking**                                    | **Non-blocking**                                    |
|--------------------|------------------------------------------------|--------------------------------------------------|
| **작업 처리 방식**      | 요청이 완료될 때까지 기다린다.                       | 요청을 보내고, 작업이 완료되면 알림을 받는다.               |
| **효율성**             | 작업이 완료될 때까지 기다려야 하므로 다른 작업을 할 수 없다. | 다른 작업을 처리하면서 비동기적으로 작업을 처리할 수 있다.       |
| **사용 예시**           | 동기적 I/O, 전통적인 파일 시스템 읽기/쓰기            | 네트워크 요청, 비동기 데이터베이스 쿼리, GUI 이벤트 처리 등      |
| **프로그램 흐름**        | 작업을 기다리는 동안 프로그램이 멈추거나 대기 상태가 된다.  | 다른 작업을 처리하면서 요청의 결과를 기다린다.                |

### 예시 코드 (Python):
- **Blocking Example (블로킹)**: 
   ```python
   import time

   def blocking_task():
       print("작업 시작")
       time.sleep(2)  # 2초 동안 기다림 (차단)
       print("작업 완료")

   blocking_task()
   print("다음 작업")
   ```
   여기서 `blocking_task()`는 2초 동안 기다리기 때문에, 그 동안 다른 작업은 수행되지 않습니다.

- **Non-blocking Example (비차단)**:
   ```python
   import asyncio

   async def non_blocking_task():
       print("작업 시작")
       await asyncio.sleep(2)  # 2초 동안 기다리지만 다른 작업을 실행 가능
       print("작업 완료")

   async def main():
       task = asyncio.create_task(non_blocking_task())  # 비동기 작업 시작
       print("다음 작업")
       await task  # 비동기 작업이 완료될 때까지 기다림

   asyncio.run(main())
   ```
   여기서는 `await asyncio.sleep(2)`가 비동기적으로 처리되며, 그 동안 다른 작업을 할 수 있습니다.

### 결론
- **Blocking**은 동기식으로, 작업을 완료할 때까지 다른 작업을 멈추게 하는 방식입니다.
- **Non-blocking**은 비동기식으로, 작업이 진행되는 동안에도 다른 작업을 수행할 수 있게 하는 방식입니다.

## 비동기 스레드 차이점?
**비동기(Asynchronous)**와 **스레드(Thread)**는 모두 프로그램이 동시에 여러 작업을 처리할 수 있게 도와주는 방법이지만, 그 방식은 매우 다릅니다. 이 두 개념을 비교할 때 중요한 점은 "작업을 동시에 처리하는 방식"과 "리소스를 어떻게 사용하는지"입니다.

### 1. **스레드 (Thread)**
스레드는 **운영 체제**가 관리하는 **프로세스 내의 실행 단위**입니다. 여러 스레드는 같은 프로세스 내에서 독립적으로 실행됩니다. 각 스레드는 CPU 자원을 활용하여 동시에 작업을 처리할 수 있습니다.

- **특징**:
  - **병렬 처리(Parallel Processing)**: 여러 스레드는 각기 다른 CPU 코어에서 독립적으로 실행될 수 있습니다.
  - **자원 공유**: 같은 프로세스 내에서 실행되므로, 메모리 공간 등을 공유합니다. 이는 스레드 간의 데이터 교환이 빠르고 효율적이지만, 잘못된 관리로 **동기화 문제**가 발생할 수 있습니다.
  - **비용**: 새로운 스레드를 생성하고, 여러 스레드가 동시에 실행되기 때문에 **메모리와 CPU 리소스를 많이 소모**할 수 있습니다.
  - **블로킹**: 스레드는 동기식 또는 비동기식으로 작업을 처리할 수 있으며, 하나의 스레드가 차단(blocking)되면 다른 스레드도 영향을 받을 수 있습니다.

- **예시**:
  ```python
  import threading
  import time

  def task1():
      print("작업 1 시작")
      time.sleep(2)
      print("작업 1 완료")

  def task2():
      print("작업 2 시작")
      time.sleep(1)
      print("작업 2 완료")

  t1 = threading.Thread(target=task1)
  t2 = threading.Thread(target=task2)

  t1.start()
  t2.start()

  t1.join()
  t2.join()
  ```

  이 코드는 두 개의 스레드 `task1`과 `task2`를 동시에 실행하여 작업을 병렬로 처리합니다.

### 2. **비동기 (Asynchronous)**
비동기 방식은 **이벤트 루프(Event Loop)**를 사용하여 작업을 비동기적으로 처리하는 방식입니다. 비동기 작업은 **실행을 멈추지 않고**, **작업이 완료될 때까지 기다리지 않고** 다른 작업을 할 수 있게 도와줍니다.

- **특징**:
  - **비동기 I/O**: 비동기 방식은 주로 **입출력 작업(I/O)**에서 활용됩니다. 네트워크 요청이나 파일 입출력처럼 시간이 오래 걸리는 작업을 비동기적으로 처리하여, 다른 작업을 할 수 있도록 합니다.
  - **싱글 스레드**: 비동기 방식은 기본적으로 하나의 스레드에서 동작합니다. 여러 작업이 동시에 실행되는 것처럼 보이지만, 실제로는 **단일 스레드에서 이벤트 루프를 통해 작업을 순차적으로 처리**합니다.
  - **효율성**: CPU 자원을 많이 소모하지 않고, I/O가 기다리는 동안 다른 작업을 처리할 수 있으므로 **자원 효율적**입니다.
  - **컨텍스트 스위칭 없음**: 여러 스레드를 사용하는 것과 달리 비동기 프로그래밍에서는 **컨텍스트 스위칭**이 필요 없으므로 스레드를 관리하는 오버헤드가 적습니다.

- **예시**:
  ```python
  import asyncio

  async def task1():
      print("작업 1 시작")
      await asyncio.sleep(2)
      print("작업 1 완료")

  async def task2():
      print("작업 2 시작")
      await asyncio.sleep(1)
      print("작업 2 완료")

  async def main():
      await asyncio.gather(task1(), task2())  # 두 작업을 동시에 처리

  asyncio.run(main())
  ```

  이 코드는 비동기적으로 두 작업을 실행하며, I/O가 대기하는 동안 다른 작업을 처리할 수 있습니다.

### 비동기 vs 스레드: 주요 차이점

| **특징**                | **스레드 (Thread)**                         | **비동기 (Asynchronous)**                   |
|---------------------|---------------------------------------|----------------------------------------|
| **동시성**              | 여러 스레드가 동시에 실행됨 (병렬 처리)              | 단일 스레드에서 비동기적으로 여러 작업 처리          |
| **작업 처리 방식**       | CPU 자원을 사용하는 병렬 처리                  | 이벤트 루프를 사용하여 I/O 작업을 효율적으로 처리        |
| **자원 사용**            | 스레드를 위한 메모리 및 CPU 리소스를 많이 사용           | CPU 리소스를 적게 사용하고, I/O 대기 시간 동안 다른 작업을 처리 |
| **작업 블로킹**          | 각 스레드는 독립적으로 블로킹 작업을 처리할 수 있음         | 비동기 작업은 블로킹되지 않음, 대기 중에도 다른 작업을 처리      |
| **동기화 문제**          | 다수의 스레드에서 공유 자원에 대한 동기화가 필요함        | 동기화 문제는 비교적 적음 (싱글 스레드에서 실행)           |
| **복잡성**               | 스레드 간 동기화 및 관리가 복잡함                    | 코드 구조가 간단하지만 비동기 패턴을 이해하고 사용해야 함  |
| **주로 사용되는 경우**    | CPU 집약적 작업 (예: 복잡한 계산, 멀티코어 활용)         | I/O 집약적 작업 (예: 네트워크 요청, 파일 읽기/쓰기)           |

### 결론
- **스레드**는 주로 병렬로 실행되는 작업들에 적합하고, 멀티코어 시스템에서 여러 스레드를 동시에 실행하여 높은 처리 성능을 얻을 수 있습니다.
- **비동기**는 I/O 작업을 비효율적으로 기다리지 않게 하여 하나의 스레드로 많은 작업을 처리할 수 있게 합니다. 특히, 네트워크 요청이나 파일 입출력 등의 시간 소모가 큰 작업에서 유리합니다.

둘 중 어떤 방식이 적합한지는 작업의 특성과 필요한 성능에 따라 다릅니다.

## 비동기는 멀티스레드?
**비동기(Asynchronous)**와 **멀티스레드(Multi-threading)**는 모두 프로그램이 동시에 여러 작업을 처리할 수 있도록 도와주는 기법이지만, **동작 방식**과 **사용되는 자원**에서 중요한 차이가 있습니다. 

### 비동기(Asynchronous)는 멀티스레드일까?
**비동기** 방식은 **멀티스레드** 방식과 **다르지만**, 때로는 비슷한 결과를 가져올 수 있습니다. 비동기와 멀티스레드는 서로 다른 방식으로 작업을 동시에 처리하지만, **비동기 방식은 기본적으로 하나의 스레드에서 실행됩니다.**

### 차이점:
1. **비동기(Asynchronous)**:
   - **주요 특징**: 비동기 방식은 **하나의 스레드**에서 여러 작업을 처리합니다. 비동기 처리는 주로 **이벤트 루프(Event Loop)**를 사용하여, **I/O 작업**(예: 네트워크 요청, 파일 읽기 등)을 기다리는 동안 **다른 작업을 처리**할 수 있게 합니다.
   - **스레드 수**: 비동기 방식은 **하나의 스레드**에서 여러 작업을 비동기적으로 처리할 수 있습니다. 여러 작업이 동시에 실행되는 것처럼 보이지만, 실제로는 **단일 스레드**가 작업을 순차적으로 처리합니다. 
   - **사용 예시**: 네트워크 요청, 파일 I/O 처리 등. 예를 들어, Python의 `asyncio`가 비동기 프로그래밍을 지원합니다.

2. **멀티스레드(Multi-threading)**:
   - **주요 특징**: 멀티스레드는 **여러 스레드**를 사용하여 병렬로 작업을 처리합니다. 각각의 스레드는 독립적으로 실행되며, **CPU 자원을 병렬로 활용**하여 계산 집약적인 작업을 동시에 처리할 수 있습니다.
   - **스레드 수**: 여러 스레드를 생성하여 병렬 처리를 하므로, **여러 스레드가 동시에 작업**을 실행합니다. 각 스레드는 독립적인 실행 흐름을 가집니다.
   - **사용 예시**: CPU 집약적인 작업, 예를 들어 복잡한 계산을 병렬로 처리할 때 유용합니다.

### 비동기와 멀티스레드의 **핵심 차이점**

| **특징**                     | **비동기 (Asynchronous)**                                  | **멀티스레드 (Multi-threading)**                             |
|----------------------------|----------------------------------------------------------|----------------------------------------------------------|
| **동시성 처리**               | 하나의 스레드에서 여러 작업을 비동기적으로 처리 (이벤트 루프 사용) | 여러 스레드를 사용하여 병렬로 작업 처리                      |
| **스레드 사용**               | **1개 스레드**에서 작업을 처리                          | 여러 개의 스레드를 생성하여 병렬로 작업 처리                  |
| **작업 처리 방식**            | I/O 작업을 대기하는 동안 다른 작업을 처리                  | 각 스레드가 독립적으로 작업을 처리                           |
| **CPU 사용**                  | CPU를 많이 사용하지 않음 (I/O 대기 중에는 대기 상태)       | 여러 CPU 코어를 병렬로 사용하여 CPU 집약적인 작업을 처리       |
| **자원 소모**                 | 적은 자원 사용 (스레드가 하나로 관리되므로 오버헤드 적음)    | 각 스레드를 관리하기 위해 추가적인 자원 사용 (스레드 오버헤드) |
| **복잡성**                    | 코드가 간단할 수 있으나, 비동기 흐름을 이해하고 처리해야 함    | 스레드 간 동기화 문제, 데이터 경합, 데드락 등 관리가 필요       |
| **사용 사례**                 | 네트워크 요청, 파일 I/O 처리 등 I/O가 많은 작업               | 복잡한 계산, 병렬 데이터 처리, 멀티코어 CPU 활용 작업           |

### 비동기와 멀티스레드의 **상호작용**
비동기와 멀티스레드는 서로 **독립적인 개념**이지만, 경우에 따라 **같이 사용할 수 있습니다**. 예를 들어, 비동기 방식으로 I/O 작업을 처리하면서, **필요한 경우** 병렬로 계산 작업을 처리하기 위해 멀티스레드를 사용할 수도 있습니다.

- **예시**: 웹 서버에서 **비동기**적으로 여러 클라이언트의 요청을 처리하면서, 각 요청에 대해 **멀티스레드**를 이용해 계산 집약적인 작업을 처리하는 경우입니다.
- **Python**에서는 `asyncio`로 비동기 I/O 처리를 하고, `threading` 모듈을 이용해 멀티스레드 작업을 동시에 사용할 수 있습니다.

### 결론
- **비동기(Asynchronous)**는 **하나의 스레드**에서 여러 작업을 효율적으로 처리하는 방식입니다. 주로 I/O 작업을 처리할 때 유용하며, CPU 자원을 효율적으로 사용할 수 있습니다.
- **멀티스레드(Multi-threading)**는 **여러 스레드**를 활용하여 병렬로 작업을 처리하는 방식입니다. CPU 집약적인 작업에 적합하며, 여러 CPU 코어를 동시에 활용할 수 있습니다.

따라서 **비동기 방식은 멀티스레드가 아니며**, 여러 작업을 "동시에 실행되는 것처럼" 처리하는 기법입니다. 멀티스레드는 여러 스레드를 만들어 실제로 **동시** 작업을 처리하는 기법입니다.


## 스프링 부트에서 @Async 이용시 멀티스레드?

**Spring Boot에서 `@Async`를 사용할 때, 멀티스레드가 발생하는지**에 대해 궁금하시다면, **`@Async`는 기본적으로 멀티스레드를 사용합니다**. `@Async`는 Spring의 비동기 처리 기능으로, 주어진 메서드를 별도의 스레드에서 비동기적으로 실행하도록 합니다. 이때 **멀티스레드** 환경이 사용됩니다.

### `@Async` 사용 시 멀티스레드 처리

1. **비동기 실행**: `@Async`를 사용하면, 메서드가 호출된 후 해당 메서드는 **별도의 스레드**에서 비동기적으로 실행됩니다. 이때, 기본적으로 Spring은 비동기 작업을 처리하기 위해 별도의 스레드를 생성합니다.

2. **스레드 풀**: Spring은 비동기 메서드의 실행을 위해 **스레드 풀(Thread Pool)**을 사용합니다. 기본적으로 `@Async`는 `SimpleAsyncTaskExecutor`를 사용하지만, **커스텀 스레드 풀**을 설정하여 성능을 최적화할 수도 있습니다.

3. **스레드 생성 및 관리**: `@Async`로 실행되는 메서드는 기본적으로 **새로운 스레드**에서 실행됩니다. 이를 통해 멀티스레드 환경에서 여러 작업을 동시에 처리할 수 있게 됩니다.

### 예시

#### 1. **기본 사용 예시**
```java
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    @Async
    public void asyncMethod() {
        System.out.println(Thread.currentThread().getName() + " - 비동기 작업 시작");
        try {
            Thread.sleep(2000); // 2초 대기
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " - 비동기 작업 완료");
    }
}
```

위 코드에서 `asyncMethod()`는 `@Async`로 지정된 비동기 메서드입니다. 이 메서드가 호출되면, Spring은 새로운 스레드를 생성하여 비동기적으로 실행합니다. 출력 결과를 보면, **메인 스레드와 별도로 새로운 스레드에서 실행**되는 것을 확인할 수 있습니다.

#### 2. **스레드 풀 커스터마이징**

기본적으로 `@Async`는 `SimpleAsyncTaskExecutor`를 사용하지만, **스레드 풀을 커스터마이징**할 수 있습니다. 이를 통해 스레드 관리와 성능을 최적화할 수 있습니다.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);  // 기본 스레드 수
        executor.setMaxPoolSize(10);  // 최대 스레드 수
        executor.setQueueCapacity(25); // 대기 큐 크기
        executor.setThreadNamePrefix("Async-"); // 스레드 이름 접두어 설정
        return executor;
    }
}
```

이 설정을 통해 **스레드 풀을 커스터마이즈**하고, 비동기 작업을 처리하는 스레드의 수와 관련된 파라미터들을 조정할 수 있습니다.

#### 3. **`@Async` 사용 시 멀티스레드 환경**

`@Async`로 비동기 메서드를 호출할 때, **실제로 멀티스레드 환경이 발생합니다**. 예를 들어:

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyApplication implements CommandLineRunner {

    @Autowired
    private MyService myService;

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // 비동기 메서드 호출
        myService.asyncMethod();
        myService.asyncMethod();
        myService.asyncMethod();
    }
}
```

여기서 `asyncMethod()`가 3번 호출되면, 각 메서드는 **별도의 스레드**에서 비동기적으로 실행됩니다. 이때 `@Async`는 **멀티스레드를 사용하여 각 작업을 병렬로 실행**하게 됩니다.

### `@Async` 사용 시의 동작

- **멀티스레드 환경**: `@Async`로 지정된 메서드는 스프링이 관리하는 **스레드 풀**에서 실행되므로, 여러 메서드가 동시에 실행될 수 있습니다. 이 때 실제로 **스레드가 여러 개 생성**되어 멀티스레드 환경에서 작업이 병렬로 수행됩니다.
- **스레드 풀 사용**: 기본적으로 `@Async`는 `SimpleAsyncTaskExecutor`를 사용하지만, 위와 같이 `ThreadPoolTaskExecutor`로 커스터마이징하여 성능을 최적화할 수 있습니다.

### 중요한 점
- **동기적 호출**과 달리 `@Async` 메서드는 **비동기적으로 실행되므로, 메서드가 끝날 때까지 기다리지 않고** 다른 작업을 계속 진행할 수 있습니다.
- **스레드 관리**에 대한 제어가 필요하다면, **스레드 풀을 커스터마이즈**하여 효율적으로 자원을 사용할 수 있습니다.
- 비동기 작업이 **스레드를 생성하여 처리**하기 때문에 **CPU와 메모리 자원을 사용**하게 됩니다. 적절한 스레드 수와 스레드 풀 설정이 중요합니다.

### 결론

Spring Boot에서 `@Async`를 사용하면 **멀티스레드** 환경이 실제로 발생합니다. 비동기 메서드는 **별도의 스레드에서 실행**되므로, 여러 작업을 동시에 병렬로 처리할 수 있습니다. 이때 `ThreadPoolTaskExecutor`와 같은 **스레드 풀**을 사용하여 효율적으로 스레드를 관리할 수 있습니다.

## 그럼 @Async 함수가 호출될 때 마다 스레드가 새로 생성?
**`@Async`** 함수가 호출될 때마다 **새로운 스레드**가 생성되는 것은 아닙니다. `@Async`로 비동기 메서드를 호출할 때, **Spring은 스레드 풀(Thread Pool)**을 사용하여 실행할 스레드를 할당합니다. 기본적으로 **스레드 풀**에서 스레드를 재사용하여 효율적으로 작업을 처리합니다.

### 1. **스레드 풀(Thread Pool) 사용**
`@Async`는 기본적으로 **스레드 풀**을 사용하여 비동기 메서드를 실행합니다. 이는 매번 새로운 스레드를 생성하는 대신, 스레드를 재사용하여 성능을 최적화하려는 방식입니다.

- **스레드 풀**: `@Async`는 스레드 풀을 통해 여러 비동기 작업을 관리합니다. 스레드 풀은 **미리 일정 개수의 스레드를 생성**해 놓고, 이들 스레드를 재사용하여 작업을 실행합니다.
- **스레드 재사용**: 비동기 메서드가 호출될 때마다 새로운 스레드가 생성되는 것이 아니라, 스레드 풀 내에서 사용 가능한 스레드가 있다면 그 스레드가 재사용됩니다. 만약 사용 가능한 스레드가 없다면, 스레드 풀에서 새로운 스레드를 생성합니다.

### 2. **`@Async` 기본 설정**
Spring에서 `@Async`를 사용할 때, 기본적으로 **`SimpleAsyncTaskExecutor`**가 사용됩니다. 이 실행자는 새로 호출될 때마다 새로운 스레드를 생성하는 방식입니다. 그러나 이는 실제 서비스에서는 비효율적일 수 있기 때문에, **스레드 풀**을 사용하는 것이 일반적입니다.

### 3. **스레드 풀 커스터마이징**
스프링에서 `@Async`를 사용할 때 **스레드 풀**을 사용하려면, `ThreadPoolTaskExecutor`와 같은 스레드 풀을 정의하여 커스터마이징할 수 있습니다.

예를 들어:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);  // 기본 스레드 수
        executor.setMaxPoolSize(10);  // 최대 스레드 수
        executor.setQueueCapacity(25); // 대기 큐 크기
        executor.setThreadNamePrefix("Async-"); // 스레드 이름 접두어 설정
        return executor;
    }
}
```

이 설정을 통해 `@Async`로 호출되는 메서드는 위에서 정의한 **스레드 풀**에서 스레드를 가져와 실행됩니다.

### 4. **비동기 함수 호출 흐름**
1. `@Async`가 적용된 메서드가 호출되면, Spring은 **스레드 풀**에서 작업을 처리할 수 있는 스레드를 찾습니다.
2. 스레드 풀에 사용 가능한 스레드가 있다면, 해당 스레드에서 작업을 실행합니다.
3. 만약 스레드 풀이 가득 차 있어 새로운 스레드를 만들어야 하는 경우, **최대 스레드 수**를 초과하면 **큐에 대기**시키거나, **스레드 수가 부족**하면 **새로운 스레드를 생성**하여 실행할 수 있습니다.

### 5. **실제 예시**

#### 기본 설정 사용 (SimpleAsyncTaskExecutor)

```java
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    @Async
    public void asyncMethod() {
        System.out.println(Thread.currentThread().getName() + " - 비동기 작업 시작");
        try {
            Thread.sleep(2000); // 2초 대기
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " - 비동기 작업 완료");
    }
}
```

이 경우, `SimpleAsyncTaskExecutor`를 기본으로 사용하면 **매번 새로운 스레드가 생성**됩니다. 그러나, **스레드 풀**을 설정하여 `ThreadPoolTaskExecutor`를 사용하면, **새로운 스레드를 계속 생성하지 않고, 이미 만들어둔 스레드를 재사용**하게 됩니다.

#### 스레드 풀을 설정한 경우

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3); // 3개의 스레드로 시작
        executor.setMaxPoolSize(5);  // 최대 5개의 스레드
        executor.setQueueCapacity(10); // 대기 큐 크기
        executor.setThreadNamePrefix("AsyncThread-");
        executor.initialize();
        return executor;
    }
}
```

이 설정을 사용하면, `@Async`로 호출되는 메서드는 **스레드 풀에서 제공하는 스레드를 사용**하게 됩니다. **새로운 스레드가 계속 생성되지 않고**, 스레드 풀 내에서 적절한 스레드를 사용하게 됩니다.

### 결론

- `@Async`가 호출될 때마다 **새로운 스레드가 항상 생성되는 것은 아닙니다**.
- Spring은 **스레드 풀**을 사용하여 비동기 메서드를 실행합니다. 스레드 풀에 사용 가능한 스레드가 있으면 그 스레드를 재사용하고, 스레드 풀이 가득 차면 새로운 스레드를 생성합니다.
- 기본적으로 `SimpleAsyncTaskExecutor`가 사용되지만, **`ThreadPoolTaskExecutor`**와 같은 스레드 풀을 설정하여 스레드를 효율적으로 관리하고 성능을 최적화할 수 있습니다.