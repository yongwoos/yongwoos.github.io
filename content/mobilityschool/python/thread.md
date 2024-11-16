---
title: Thread Programming
linkTitle: Thread Programming
weight: 7
---
- Process: 운영체제로부터 자원을 할당받아서 동작하는 독립적인 프로그램
- Thread: 프로세스 내의 명령어 블록으로 시작점과 종료점을 가지는 일련된 하나의 작업의 흐름으로 독립적으로 존재할 수 없고 프로세스 내에서 존재
- Thread 와 일반 함수 호출과의 차이점: 
  - 일반 함수 호출은 작업 도중 다른 작업으로 제어권 이동이 불가능하지만 Thread는 가능
  - Thread와 유사한 것 중 하나가 coroutine 인데 coroutine은 명시적으로 작업의 이동점을 설정하지만 Thread는 작업에 idle time이 발생하면 제어권이 자동으로 이루어지며 각 Thread는 독립적으로 수행됨
  - Thread 끼리 데이터를 공유하려면 전역 변수를 이용해야 하지만 coroutine은 서로 간에 데이터를 전달할 수 있음
- python에서는 하나의 코어에서 하나의 Thread만 동작이 가능

### Thread 생성
- `threading.Thread(target=스레드로 동작할 함수, args=함수에 넘겨줄 데이터 튜플)`를 이용
- Thread 클래스로부터 상속받는 클래스를 만들고 run 메서드를 만든 후 인스턴스를 생성
- Thread 시작은 인스턴스가 start()를 호출

```python
import time, threading

def run(id):
    for i in range(10):
        print(id)
        time.sleep(1)
# 일반적인 함수 호출은 앞의 작업이 전부 끝나고 난 후 뒤의 작업을 수행
run(1)
run(2)

# 위 작업을 스레드로 수행
th1 = threading.Thread(target=run, args=(1,))
th2 = threading.Thread(target=run, args=(2,))
th1.start()
th2.start()
```
```python
# Thread 클래스를 SubClassing ㅈ해서 스레드를 생성
import time, threading

# Thread를 만들기 위한 클래스
# run 메서드를 오버라이딩
class ThreadEx(threading.Thread):
    def run(self):
        for i in range(10):
            print(self.getName())
            time.sleep(1)

th1 = ThreadEx()
th2 = ThreadEx()
th1.start()
th2.start()
```

### Multi Thread의 문제점
- Multi Thread는 하나의 스레드가 작업을 마치지 않은 상태에서 다른 스레드가 생성되서 실행되는 경우
  - 모든 애플리케이션은 특별한 경우가 아니면 멀티 스레드 기반
  - 노드나 몽고 데이터베이스가 싱글 스레드 기반이기는 한데 최근에는 멀티 스레드를 지원함
  - Java 나 Python을 이용하는 웹 프로그래밍의 기본은 사용자의 요청을 스레드로 만들어서 여러 사용자의 요청을 처리
- Critical Section: 공유 자원을 사용하는 코드 영역, 문제점이 발생할 가능성이 있는 영역
- Mutual Exclusion(상호 배제): 하나의 스레드가 수정 중인 자원에 다른 스레드가 접근하면 안됨
- Consumer(생산자와 소비자) 문제: 멀티 스레드 환경에서 하나의 스레드가 생산자 역할을 하고 다른 하나의 스레드가 소비자의 역할을 하는 경우 생산자가 자원을 생산하지 않았는데 소비자가 사용하려고 하는 문제 (ex. 컨베이어벨트)
- Dead Lock: 무한 대기 상태에 빠지는 것.

### 상호배제 구현
```python
import time, threading

g_count = 0

# 락을 생성
lock = threading.Lock()

# Thread를 만들기 위한 클래스
# run 메서드를 오버라이딩
class ThreadEx(threading.Thread):
    def run(self):
        global g_count
        global lock
        
        for _ in range(10):
            # 락을 설정 - 이 코드 영역이 수행되는 동안은 다른 코드가 수행되지 못함
            lock.acquire()
            print(self.getName(), "증가하기 전-->", g_count)
            g_count = g_count + 1
            time.sleep(1)
            print(self.getName(), "증가한 후-->", g_count)
            time.sleep(1)
            # 락을 해제
            lock.release()

th1 = ThreadEx()
th2 = ThreadEx()
th1.start()
th2.start()
```
- 해결책은 Locking 기법으로 해결할 수 있는데 공유 자원을 수정하러 들어가기 전에 lock을 채우고 작업이 끝나면 lock을 해제
- Lock을 만드는 함수는 `Lock()`이고 채우는 함수는 `acquire()`이고 해제하는 함수는 `release()`

### 생산자와 소비자 문제
- 생산자는 공유 자원을 생산하는 스레드이고 소비자는 공유 자원을 소비하는 스레드인 경우
- 이 경우 두 개의 스레드는 동시에 수행되어도 되는데 생산자가 공유 자원을 생성하지 못한 상태에서 소비자가 공유 자원을 사용하려고 하면 예외가 발생
- 이런 경우 소비자 스레드는 공유 자원이 없으면 waiting 하고 생산자 스레드가 공유 자원을 생성하면 notify를 보내서 소비자 스레드가 다시 작업을 수행하도록 해서 해결
- Condition 클래스를 이용해서 해결

```python
import time, threading

shareData = []

# 생산자와 소비자 문제를 해결하기 위한 인스턴스
cv = threading.Condition()

# 공유 데이터를 생산하는 스레드
class Producer(threading.Thread):
    def run(self):
        global shareData
        global cv

        for i in range(10):
            cv.acquire()
            print("공유 자원 생성")
            shareData.append(i)
            time.sleep(1)

            #생산되었다는 시그널을 전송
            cv.notify()
            cv.release()

# 공유 데이터를 소비하는 스레드
class Consumer(threading.Thread):
    def run(self):
        global shareData
        global cv

        for i in range(10):
            cv.acquire()
            print("공유 자원 소비")
            # 공유 자원이 없으면 대기
            if len(shareData) < 1:
                cv.wait(0)
            print(shareData.pop())
            time.sleep(1)
            cv.release()

producer = Producer()
consumer = Consumer()
producer.start()
consumer.start()
```

### Semaphore
- 공유 자원의 개수가 여러 개인 경우 사요
- 공유 자원의 개수를 설정을 해서 공유 자원의 개수가 0이 된 경우 waiting
- 사용법은 Lock과 같은데 Semaphore 클래스를 이용하고 생성할 때 Lock의 개수를 설정하는 것이 다름
```python
import time, threading

# 3개 까지는 동시에 수행
# os.cpu_count() 대입시 맥시멈 또는 -1
lock = threading.Semaphore(3)

class ThreadEx(threading.Thread):
    def run(self):
        lock.acquire()
        time.sleep(5)
        print(self.getName())
        lock.release()

for _ in range(10):
    th = ThreadEx()
    th.start()
```
- 동시에 수행되는 스레드의 개수는 작업이나 CPU 성능에 따라 다르게 설정
  - 스레드에서 작업이 전환될 때 자신의 정보를 저장하고 수행되는 스레드의 정보를 읽어오는 Context Switching(문맥 교환)이 발생
  - 너무 많은 스레드가 동작 중이면 문맥 교환으로 인한 오버헤드가 심해지는데 이러한 현상을 thrashing이라고 함
- `time.sleep(int)`은 강제로 프로세스의 제어권을 뺏는 것이고 파일 입출력 작업이나 네트워크 작업을 수행하게 되면 프로세서가 일정 시간 동안 필요없어지기 때문에 다른 스레드로 작업 제어를 옮겨감