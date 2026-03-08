---
title: 예외처리(Exception Handling)
linkTitle: 예외처리
weight: 6
---
### 오류 종류
- Error(에러)
  - 문법적인 오류로 프로그램이 실행되지 않거나 잘못된 결과를 만드는 경우
  - Compile Error: 문법적인 오류로 프로그램이 실행되지 않는 경우 예:17/"0"
  - 논리적 오류: 잘못된 알고리즘으로 잘못된 결과를 만들어 내는 경우
- Exception(예외)
  - 문법적으로는 정상이지만 프로그램 실행 도중에 오류가 발생해서 프로그램이 멈추는 것 예:17/0
  - 개발자가 아무런 행동도 취할 수 없는 예외(메모리부족) 개발자가 처리가 가능한 예외로 나눌 수 있음

### 오류 발생 시 조치
- 컴파일 에러나 논리적 오류는 오류를 수정: 디버깅(프로그램을 부분적으로 수행하면서 메모리를 확인)을 수행
- 예외는 예외 처리를 수행

### 디버깅 방법
- 로깅(logging): 메모리의 값을 직접 출력
- IDE가 제공하는 Debugging Tool 이용
- 테스팅 툴을 이용

### 예외 처리의 용도
- 정상적으로 종료
- 예외 내용 기록
- 예외가 발생했을 때 무시하고 계속 실행하거나 정상적인 값으로 변경해서 계속 실행: 서버

```python
def div(x):
    return 10 / x
try:
    print(div(l1))
    # 0으로 나누어서 예외 발생 - 예외처리를 하지 않았기 때문에 아래 문장을 수행할 수 없음
    print(div(0))
# 예외가 발생했을 때 수행할 코드
except:
    print("예외발생")
print("프로그램 종료 시 수행할 내용")
```

### try ~except 이용한 예외 처리
```python
try:
    예외가 발생할 가능성이 있는 코드
except:
    예외가 발생했을 때 수행할 코드
```
- 발생하는 예외에 따라서 구분해서 처리: except 다음 예외처리 클래스 이름을 기재하고 처리
- 예외처리 클래스 이름을 여러 번 사용하는 경우 위에서부터 순서대로 처리하고 예외처리 구문을 벗어남

```python
li = [10, 20, 30, 40]

# 예외 종류 별로 나누어서 처리
try:
    index, x = map(int, input("인덱스와 나눌 숫자를 입력하세요: ").split())
    print(li[index] / x)
except IndexError as e:
    print(e)
    print(dir(e))
except ZeroDivisionError as e:
    print("0으로 나눈 오류")
```
- 예외 처리 객체를 활용: 예외 처리 클래스 이름 다음에 as 객체를 참조할 이름을 만들어서 사용

### 예외처리 클래스의 계층
- https://docs.python.org/3/library/exceptions.html
- 객체 지향 언어에서는 상위 클래스 타입의 참조형 변수가 하위 클래스 타입의 참조를 저장할 수 있음
- 데이터 타입을 지정하는 언어에서는 이 문법이 중요한데 파이썬이나 자바스크립트처럼 타입을 지정하지 않는 언어에서는 큰 의미는 없음
- 파이썬에서 예외 처리를 할 때 except가 여러 개인 경우 위에 상위 클래스를 배치하면 안됨

```python
li = [10, 20, 30, 40]

# 예외 종류 별로 나누어서 처리
try:
    index, x = map(int, input("인덱스와 나눌 숫자를 입력하세요: ").split())
    print(li[index] / x)

# 모든 예외를 여기(BaseException)서 처리
# 상위 클래스의 참조형 변수에는 하위 클래스 타입의 인스턴스를 대입할 수 있음
except BaseException as e:
    print("1:", e)
except ZeroDivisionError as e:
    print("2:", e)
```
- 상위 클래스 타입의 예외 처리 구문을 위에 작성하면 아래 예외 처리 구문은 호출되지 않음
- 자바 같은 경우 위처럼 작성하면 unreachable code 라고 경고가 발생

### else와 finally
- `except` 다음에 `else`를 사용할 수 있는데 else 블럭은 예외가 발생하지 않은 경우 수행할 구문을 작성
- `finally`는 예외 발생 여부에 상관없이 수행할 구문을 작성

```python
li = [10, 20, 30, 40]

try:
    index, x = map(int, input("인덱스와 나눌 숫자를 입력하세요: ").split())
    print(li[index] / x)

except ZeroDivisionError as e:
    print("2:", e)
else:
    print("에외가 발생하지 않은 경우 수행")
finally:
    print("예외 발생 여부에 상관없이 수행")
```

### 예외 강제 발생
- 실행 중 문법적으로나 값으로나 예외가 발생한 상황이 아닌데 예외를 강제로 발생
- `raise 예외처리클래스이름(예외 문자열)`
- assertion(단언): 특정 조건을 만족하지 않으면 프로그램을 중단시키는 것
```python
li = [10, 20, 30, 40]

try:
    index, x = map(int, input("인덱스와 나눌 숫자를 입력하세요: ").split())
    print(li[index] / x)
    # 문법적으로 아무런 문제가 없지만 강제로 예외를 발생 시킴
    if x>=5:
        raise Exception("5보다 큰 수로 나눌 수 없음")
    assert x<5, # 5보다 큰 수로 나눌 수 없음, 강제로 예외를 발생시키는 것과 반대로

except ZeroDivisionError as e:
    print("2:", e)
except Exception as e:
    print(e)
else:
    print("에외가 발생하지 않은 경우 수행")
finally:
    print("예외 발생 여부에 상관없이 수행")
```
- `assert 조건 '예외문자열'`
  - 조건에 맞으면 넘어가고 그렇지 않으면 예외가 발생
```python
li = [10, 20, 30, 40]

try:
    index, x = map(int, input("인덱스와 나눌 숫자를 입력하세요: ").split())
    print(li[index] / x)
    # 문법적으로 아무런 문제가 없지만 강제로 예외를 발생 시킴
    assert x<5, # 5보다 큰 수로 나눌 수 없음, 강제로 예외를 발생시키는 것과 반대로

except ZeroDivisionError as e:
    print("2:", e)
except Exception as e:
    print(e)
else:
    print("에외가 발생하지 않은 경우 수행")
finally:
    print("예외 발생 여부에 상관없이 수행")
```

### 사용자 정의 예외 클래스
- 사용자가 원하는 메시지를 출력하기 위해서 생성
- 예외에 해당하는 클래스를 상속받아서 `__init__` 메서드를 오버라이딩 한 후 상위 클래스의 `__init__` 메서드에 원하는 문자열을 대입하면 됨

### 예외 처리 구문을 작성하는 경우
- 외부 자원을 사용하는 경우는 반드시 작성하기를 권장
- 파일 핸들링, 네트워크 프로그래밍, 데이터베이스 프로그래밍은 대표적인 외부 자원 사용 서비스임. 이런 서비스를 사용할 때는 상대방 자원이 사용가능한지 예외가 발생했을 때 적절하게 정리를 하는지 여부가 중요
- 예외 처리 구문에 로깅을 하는 것도 중요
  - 어떤 상황에서 예외가 발생했는지를 기록해두면 데이터 분석이나 신입 사원 교육에 도움이 됨

## 파이썬이 제공하는 모듈
### 날짜 및 시간 관련 패키지
- 시간표현방법
  - Timestamp: 1970/01/01 자정을 기준으로 해서 초 단위나 밀리초 단위로 측정한 절대시간
  - UTC, GMT: UTC는 세슘 원자의 진동 수에 의거한 초의 길이
  - LST: 국제 표준시로 UTC를 기준으로 경도 15도마다 1시간 차이를 발생시킨 시간
  - 우리나라는 UTC보다 9시간 빠름, 시간 데이터가 맞게 나오지 않은 경우 9시간 차이가 나면 UTC 설정되어 있는 경우
- struct_time
  - Timestamp가 알아보기 어려워서 실제 사용하는 연, 원, 일, 시, 분, 초로 분할해서 가지는 구조체
- time 모듈
  - `time()`: 타임스탬프 값
  - `sleep(초)`: 현재 스레드를 초 만큼 대기
- datetime 패키지
  - datetime 클래스
  - date 클래스
  - time 클래스
  - timedelta 클래스: 시간 차이
  - tzinfo 클래스: 시간대 정보
- pandas에서 시간 정보를 다룰 때 이 패키지의 클래스들을 사용
```python
# 원하는 날짜를 생성하고 분할해서 사용하고 문자열로 변환한 후 문자열을 가지고 시간을 생성
import datetime

# 현재 시간 생성
dt = datetime.datetime.now()
print(dt)

# 원하는 영역의 시간이나 날짜 가져오기
print("년도: ", dt.year)

# 문자열을 가지고 생성
dt = datetime.datetime.strptime("1987-05-05 12:11", "%Y-%m-%d %H:%M")
print(dt)

# 문자열로 변환
s = dt.strftime("%Y-%m-%d %H:%M")
print(s)

dt1 = datetime.datetime.now()
dt2 = datetime.datetime.strptime("1987-05-05 12:11", "%Y-%m-%d %H:%M")

# 날짜 사이의 빼기는 timedelta 타입
td = dt1 - dt2

print(td.days, td.seconds)
```

### 파일 시스템 관련 패키지
- os.path 패키지: 경로와 관련된 패키지
  - 이 패키지의 메서드들은 경로가 없는 경우 예외를 발생시킴
  - 파일의 존재 여부 그리고 최근 변경 시간 그리고 파일의 크기를 알아내는 메서드를 활용하는 것에 대해서 알아 둘 필요가 있음
```python
import os.path
import glob
import os

print(dir(os.path))

# 파이썬에서는 디렉터리 경로를 /로 설정해도 됨
print(os.path.getatime("./mymodule.py"))
print(os.path.getmtime("./mymodule.py"))
print(glob.glob("./"))
import(os.listdir("./"))
# glob는 확장자 패턴을 이용하게 되는데 보통 *이나 ?와 같이 사용
# Mac이나 Linux 면 디렉터리 기호가 / 이고 windows이면 \\
print(glob.glob("./*.py"))
```
- glob패키지: 디렉터리 내부의 파일이나 디렉터리를 순회하기 위한 패키지
  - 자연어 처리나 이미지 처리를 할 때 여러 개의 파일을 하나의 디렉터리로 압축해서 제공한 경우 이 패키지를 이용해서 데이터를 읽어내는 경우가 있음

### 운영체제 관련 패키지
- os: 운영체제 관련 패키지
  - 디렉터리 생성이나 순회 및 현재 디렉터리 확인 등에 사용
  - system 함수를 이용해서 명령을 실행하는 것이 가능
  - 환경 변수 확인 가능
```python
import os
import sys

print(dir(sys))
print(sys.modules)
print(f"환경변수:(os.environ)")
os.system("dir")
print("모듈 찾는 순서: ", sys.path)
print("디폴트 인코딩:", sys.getdefaultencoding)
print("참조 카운트: ", sys.getrefcount("객체"))
# 운영체제 명령어
os.system("dir")
```
- sys: 파이썬과 관련된 정보

### 복사
- 참조형 데이터의 복사 방법은 2가지: 얕은 복사와 깊은 복사
- 파이썬에서 리터럴 데이터를 가리키는 변수를 만들면 먼저 상수 영역에서 리터럴이 존재하는지 확인하고 존재하면 그 id를 변수에 대입하고 존재하지 않으면 상수 영역에 저장한 후 id를 변수에 대입. 동일한 리터럴을 저장하면 참조하고 있는 id가 동일
- 참조형 데이터를 = 를 이용해서 대입하면 실제 참조하고 있는 내용은 복제되지 않고 id가 대입됨
  - 이 때 참조하고 있는 데이터의 참조 카운트(reference count만 하나 증가함)
  - 이 경우 참조를 대입받은 변수를 이용해서 내부 데이터를 수정하면 참조하고 있는 데이터에 수정이 발생
  - 이런 경우는 함수 내에서 만들어진 데이터를 함수 외부에서 사용하기 위해서 수행
```python
b = 0
def f():
    a = 10
    global b
    # 참조형 데이터끼리 = 를 이용하는 경우는 지역 변수를 외부에서 사용하고자 할 때
    b = a
f()
print(b)

li1 = [10, 20]
li2 = li1
li2[0] = 1234 # li2를 이용해 li1을 수정하는 것은 좋지 않음
print(li1[0])
```
- 얕은 복사(weak copy)
  - 파이썬에서는 copy 모듈의 copy라는 함수를 이용하면 얕은 복사를 수행할 수 있음
  - 얕은 복사는 참조형 데이터 자체를 복제해서 제공하는 것, 재귀적으로 복제를 하지는 않음
  - 벡터 데이터 안에 벡터 데이터를 가지는 경우는 완전한 복제가 이루어지지 않음
```python
import copy

li1 = [1,2,3,4]
li2 = copy.copy(li1)
li2[0] = 1000

print(li1, li2)

li3 = [[10, 20], [30, 40]]
# 재귀적으로 복제하지 않기 때문에 이 경우는 li4를 이용해서 li3의 데이터를 수정하는 것이 가능
li4 = copy.copy(li3)
# li4 = copy.deepcopy(li3)
li4[0][0] = 1234
print(li3, li4)
```
- 깊은 복사(deep copy)
- `copy.deepcopy` 함수를 이용하면 재귀적으로 복제를 수행
- GUI 프로그래밍에서는 화면을 만드는 부분과 코딩을 하는 부분이 별도로 분리된 경우가 있는데 이 경우 참조를 복사해서 reference count만 증가시키는 것이나 얕은 복사를 이용하는 경우가 있음. iOS Framework나 Visual Studio를 이용한 C#이나 VC++에서 이러한 기법을 이용

### 약한 참조
- 파이썬은 = 를 이용해서 대입하면 참조 카운트를 증가시키고 id를 복사함. 이렇게 하면 메모리 정리를 하려면 참조 카운트를 0을 만들기 위해서 여러 번 None을 대입해야 함.
- `weakref.ref(객체)`를 이용하면 참조 카운트를 증가시키지 않고 id를 복사함 여러 번 참조를 복사했더라도 한 번만 None을 대입하면 메모리 정리가 됨
```python
import weakref

class Temp:
    def __del__(self):
        print("인스턴스가 파괴됨")

obj1 = Temp()

# 참조 카운트를 증가시키지 않고 참조를 복사
obj2 = weakref.ref(obj1)
obj1 = None
print("프로그램 종료")
```