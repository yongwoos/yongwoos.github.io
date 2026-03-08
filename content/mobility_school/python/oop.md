---
title: 객체 지향 프로그래밍
linkTitle: 객체 지향 프로그래밍
weight: 3
---
- 파이썬은 함수형 프로그래밍과 객체 지향 프로그래밍을 모두 지원
- 최근에는 객체 지향 프로그래밍 기법을 많이 이용

### 특징
- Encapsulation(캡슐화)
  - 관련 있는 속성과 메서드를 묶어야 함
  - 불필요한 부분은 외부로 노출시키지 않도록 하는 것
  - 클래스, 인스턴스, 접근 지정자를 설정하는 부분
- Inheritance(상속)
  - 하위 클래스가 상위 클래스의 모든 것을 물려받는 것
  - 상위 클래스를 super class 또는 based class 라고 부르고 하위 클래스를 sub class 또는 derived class 라고 부름
- Polymorphism(다형성)
  - 동일한 메시지에 대하여 다르게 반응하는 성질
  - 동일한 코드가 대입된 인스턴스에 따라서 다른 메서드를 호출하는 것
- 서브클래싱

### 용어
- Object: 프로그램에서 사용되는 모든 것
- Class: 사용자 정의 자료형, 동일한 목적을 사용하기 위해 모인 데이터(Attribute, Field, 속성)와 기능(Method)의 집합
- Instance: 클래스를 기반으로 만들어진 객체
- Method: 클래스 안에 만들어진 함수

### 파이썬에서 클래스 선언
```python
class 클래스이름:
      초기화 메서드
      속성
      메서드
```

### 인스턴스 생성
- `클래스이름()` -> 생성자 호출

### 클래스나 인스턴스를 이용한 멤버 호출
- 클래스이름 이나 인스턴스이름.멤버
```python
class Student:
    pass

# 인스턴스 생성
student1 = Student()
```
### 메서드 선언
- 파이썬에서 인스턴스가 호출할 수 있는 메서드는 반드시 1개 이상의 매개변수를 가져야 함
- 관습적을 self 라는 이름으로 사용
- 일반적으로 다른 언어에서는 self를 생략하고 실제 클래스가 만들어질 때 this 나 self 또는 me 라는 예약어로 접근이 가능
- 메서드는 클래스 안에 만들어지고 클래스와 인스턴스가 호출할 수 있음, 인스턴스 안에는 메서드가 없음
- 인스턴스는 만들어질 때 자신의 클래스에 대한 참조를 가지고 만들어저서 자신에게 없는 멤버는 클래스에서 찾아옴
- 파이썬에서 인스턴스를 가지고 할당문을 사용하면 인스턴스 내부에 속성이나 메서드를 생성
- 인스턴스가 호출할 때 메서드(인스턴스이름) 형태로 호출해 인스턴스를 self로 참조시킴
```python
class Student:
    def display(self):
        print("Student 클래스의 인스턴스 메서드")

# 인스턴스 생성
student1 = Student()
student1.display # bound 호출 : 인스턴스가 메서드 호출
Student.display(student1) # unbound 호출 : 클래스가 메서드 호출
```

### 메서드 호출
- 클래스 내부에서 호출할 때는 `self.메서드이름(첫번째 self에 해당하는 매개변수를 제외하고 매개변수를 대입)`
- 바운드 호출(인스턴스가 호출): `인스턴스이름.메서드이름(첫번째 self에 해당하는 매개변수를 제외하고 매개변수를 대입)`
- **언바운드 호출(클래스가 호출)**: `클래스이름.메서드이름(인스턴스, 첫번째 self에 해당하는 매개변수를 제외하고 매개변수를 대입)`

### 속성 생성
- 클래스 안에서 속성을 만들면 클래스의 속성이 만들어짐
- 인스턴스가 속성을 호출하면 자신의 속성이 있으면 자신의 속성을 호출하고 자신의 속성이 없으면 클래스의 속성을 호출
- 속성에 할당을 하면 인스턴스 내부에 자신의 속성이 생성
```python
class Student:
    schoolName = "현대 오토에버"
    def display(self):
        print("Student 클래스의 인스턴스 메서드")

# student1에 schoolName 이라는 속성이 없으므로 클래스에 가서 찾아서 읽음
student1 = Student()
print(student1.schoolName) # 클래스의 속성 호출

# 할당문을 사용하게 되면 인스턴스 내부에 속성을 생성함
student1.schoolName = "현대 모비스" # 할당문 사용, 인스턴스에 할당
print(student1.schoolName) # "현대 모비스" 출력

# 아직 student2에 schoolName 이라는 속성을 만들지 않았으므로 클래스의 schoolName을 호출
student2 = Student()
print(student2.schoolName) # "현대 오토에버" 출력
```

### == 와 is
- `==` 연산자는 \_\_eq__ 메서드를 편리하게 사용하기 위한 연산자
  - 이 연산자는 연산자 오버로딩이 가능하기 때문에 클래스 별로 다르게 구현되어 있음
  - 때로는 가리키고 있는 데이터를 비교하기도 하고 내부 구성 요소들을 비교하기도 함
- id가 같은지 비교하는 연산자는 `is`
```python
class Student:
    schoolName = "현대 오토에버"
    def display(self):
        print("Student 클래스의 인스턴스 메서드")

li1 = [10, 20]
li2 = [10, 20]
print(id(li1))
print(id(li2))
print(li1==li2) # True 출력
print(li1 is li2) # False 출력
```

### 인스턴스 속성을 클래스 내부에서 생성
- 메서드 내부에서 `self.속성이름`을 사용하면 인스턴스 속성을 만들거나 사용할 수 있음
- 메서드 외부에서는 `self`가 없기 때문에 인스턴스 속성을 만들수가 없음

### 파이썬에서 명령법
- 일반적인 언어에서는 클래스 이름은 대문자로 시작하고 인스턴스 이름은 소문자로 시작
  - 초창기 파이썬에서는 클래스 이름도 소문자로 시작
- 속성이름이나 메서드 이름은 소문자로 시작하고 다른 단어가 나오면 첫글자만 대문자로 하도록 하는 것이 일반적
  - 파이썬은 2개 단어 이상의 조합으로 만들 때 두번째 단어의 첫글자를 대문자로 하지 않고 _ 를 앞에 추가하는 경우가 많음
  - 정수를 가져오는 메서드 이름을 정한다면 일반적인 언어에서는 getInt 이렇게 하는데 파이썬에서는 get_int 로 명명하는 경우가 많았음
  - 연산자 오버로딩이나 특별한 기능을 하는 메서드를 만들 때는 앞에 __ 를 추가하고 뒤에 __ 를 추가하는 형식으로 명명
- readonly 데이터를 만들 때는 모두 대문자로 하는 것이 관례

### Accessor - 접근자 메서드
- 인스턴스 속성의 값을 읽고 쓰는 메서드
- 객체 지향 언어에서는 속성의 값을 직접 읽거나 쓰는 것을 권장하지 않음. 대다수의 객체 지향 언어가 상호 배제를 적용할 때 인스턴스나 메서드 단위라서 속성을 접근하게 되면 상호 배제를 적용하기 어려운 경우가 있음
- 속성은 private으로 숨기고 메서드를 public으로 만들어서 접근하기를 권장
- 속성의 값을 리턴하는 메서드 - getter
  - 이름은 `get속성이름`의 형태로 이름을 만드는 것을 권장하는데 속성의 자료형이 bool인 경우는 get 대신 is를 사용
  - 내용은 속성을 리턴하도록 만듬
  - 매개변수는 없음
- 속성의 값을 수정하는 메서드 - setter
  - 이름은 `set속성이름`의 형태로 만듬
  - 매개변수 1개를 받음
  - 내용은 매개변수의 값을 속성에 대입
  - 내용 이외의 것을 작성하는 경우가 있는데 이 경우는 대부분 유효성 검사 문장을 앞에 추가해서 정해진 도메인의 값만 설정하도록 함
```python
class Student:
    # 인스턴스 속성을 만들어주는 메서드
    def initialize(self):
        self.name = None
        self.num = 0
    
    # num에 대한 접근자 메서드
    def getNum(self):
        return self.num
    
    def setNum(self, num):
        self.num = num
    
    def getName(self):
        return self.name
    
    def setName(self, name):
        self.name = name

# 인스턴스를 생성하고 속성을 생성하는 메서드 호출
student = Student()
student.initialize()
student.setName("adam")
student.setNum(1)
print(student.getNum())
print(student.getName())
```

### 초기화 메서드:\_\_init\_\_
- 다른 언어에서는 생성자라고 호칭하는 경우가 많음
- 인스턴스를 만들 때 호출되는 메서드
- 메모리 할당과 초기화 작업을 수행
- 클래스를 만들고 \_\_init__ 를 재정의하지 않으면 매개변수가 없는 아무일도 하지 않는 \_\_init__가 자동으로 생성
- 이 메서드는 직접 호출하는 것이 아니고 `클래스이름()` 으로 호출
```python
class Student:
    def __init__(self):
        print("초기화메서드")
```
- 직접 __init__을 생성하는 경우 기존에 제공되는 __init__은 소멸됨
  - **매개변수가 있는 __init__을 만들 때는 주의해야 함, 기본값을 제공하는 것이 좋음**
- 이 메서드에 정의하는 내용은 매개변수를 받아서 속성에 대입해서 초기화하는 작업

```python
class Student:
    # 초기화 메서드 정의
    def __init__(self):
        self.name = None
        self.num = 0
    
    # num에 대한 접근자 메서드
    def getNum(self):
        return self.num
    def setNum(self, num):
        self.num = num

    # name에 대한 접근자 메서드
    def getName(self):
        return self.name
    def setName(self, name):
        self.name = name

# 인스턴스를 생성하고 속성을 생성하는 메서드 호출
student = Student()
print(student.getNum())
print(student.getName())
```

```python
class Student:
    # 초기화 메서드 정의
    def __init__(self, num=0, name="adam"):
        self.name = name
        self.num = num
    # def __init__(self, num, name): 으로 값을 줄 수도 있음
    # setter 불필요
    # 매개변수가 있는 생성자를 만들면 기본적으로 제공되는 생성자가 소멸
    # 매개변수를 2개 받은 생성자를 만들었기 때문에 매개변수가 없는 생성자는 없어져서 이 작업은 에러가 됨
    # __init__(self) 가 있어야만 아래 문장이 에러가 아님
    # 모든 매개변수에 기본값을 설정해 줘야함
    
    # num에 대한 접근자 메서드
    def getNum(self):
        return self.num
    def setNum(self, num):
        self.num = num

    # name에 대한 접근자 메서드
    def getName(self):
        return self.name
    def setName(self, name):
        self.name = name

# 인스턴스를 생성하고 속성을 생성하는 메서드 호출
student = Student()
print(student.getNum())
print(student.getName())

student1 = Student()
```

### 인스턴스가 메모리 해제될 때 호출되는 메서드:\_\_del__
- 이 메서드를 인스턴스가 메모리 해제될 때 자동으로 호출되는 메서드
- 매개변수로 self만 가능, 다른 매개변수를 가질 수 없음
- 외부 자원을 사용하는 경우 외부 자원에 대한 연결을 해제하는 코드를 작성

### Garbage Collection
- 메모리 해제를 수행해주는 객체
- 파이썬은 reference count(retain count)를 이용해서 메모리를 관리
- 인스턴스가 메모리 할당을 받으면 이 숫자가 1이 되고 이 영역을 다른 데이터가 참조를 하게 되면 1씩 증가함
  - 이 참조를 가리키는 변수에 None을 할당하면 이 숫자가 1씩 감소
  - reference count가 0이 되면 메모리 해제를 수행할 수 있음
- reference count를 확인하고자 할 때는 sys 모듈을 getrefcount 함수를 이용하면 되는데 이 때는 나오는 값은 1이 증가해서 나오게 됨
  - 이 모듈이 인스턴스를 참조했기 때문

```python
class Student:
    # 초기화 메서드 정의
    def __init__(self, num=0, name="adam"):
        self.name = name
        self.num = num
    # def __init__(self, num, name): 으로 값을 줄 수도 있음
    # setter 불필요
    # 매개변수가 있는 생성자를 만들면 기본적으로 제공되는 생성자가 소멸
    # 매개변수를 2개 받은 생성자를 만들었기 때문에 매개변수가 없는 생성자는 없어져서 이 작업은 에러가 됨
    # __init__(self) 가 있어야만 아래 문장이 에러가 아님
    # 모든 매개변수에 기본값을 설정해 줘야함
    
    # num에 대한 접근자 메서드
    def getNum(self):
        return self.num
    def setNum(self, num):
        self.num = num

    # name에 대한 접근자 메서드
    def getName(self):
        return self.name
    def setName(self, name):
        self.name = name

    # 인스턴스가 메모리에서 해제 대상이 될 때 호출되는 메서드
    def __del__(self):
        print("소멸자")


student1 = Student() # 인스턴스를 생성하면 인스턴스의 레퍼런스 카운트는 1
student2 = student1 # 인스턴스의 참조를 다른 변수에 대입하면 레퍼런스 카운트는 1증가
# None을 대입하면 레퍼런스 카운트는 1 감소
# 레퍼런스 카운트가 0이 되면 메머리 해제 대상이 되고 접근할 수 없게 됨
student1 = None
print(student2.getNum())
student2 = None
```

### static method
- 클래스 이름으로 호출하는 메서드
- 인스턴스가 없어도 호출 가능
- 인스턴스가 호출해도 됨
- self가 없는 메서드
- 메서드를 만들 때 @staticmethod 라는 데코레이터를 이용해 정의
- 클래스 속성은 사용이 가능하지만 self가 없기 때문에 인스턴스 속성은 사용할 수 없음

### class method
- static 메서드처럼 클래스 이름으로 호출하는 메서드
- 첫번째 매개변수로 클래스 객체 자신을 넘겨받아서 사용
  - 이름은 관습적으로 cls 라고 함
- @classmethod 라는 데코레이터를 이용해 정의
- 인스턴스가 호출해도 됨

```python
class Student:
    @staticmethod
    def sMethod():
        print("static method")
    
    @classmethod
    def cMethod(cls):
        print("class method")

Student.sMethod()
Student.cMethod()
student = Student()
# 클래스 메서드나 static 메서드를 인스턴스를 이용해서 호출 가능
# 이런식으로 호출하는 것은 삼가는게 좋음
student.sMethod()

stack: 인스턴스, 호출된함수
heap-instance 영역: 인스턴스는 자신의 클래스 아이디를 참조 
    -static영역: 상수, 함수, 클래스 

-스택 영역의 인스턴스는 자신의 속성만 가짐, 클래스아이디만 참조, 메서드는 클래스에 있음
-인스턴스로 정적/클래스 메서드 호출시 stack->instance영역->static영역으로 찾아가 시간이 걸림

t = T() -> Heap에 T클래스 메모리 할당, instance 영역에 T아이디 참조, stack에서 instance영역 참조
```

### \_\_slots__속성
- 이 속성에 속성 이름을 list로 설정을 하면 인스턴스가 이 속성 이외의 속성을 생성할 수 없음
```python
class Student:
    # 이 클래스로 만들어지는 인스턴스는 num과 name 속성만 가져야 함
    __slots__ = ["num", "name"]

    def __init__(self, num=0, name="noname"):
        self.num = num
        self.name = name

student = Student()
# 인스턴스에 새로운 속성을 추가
student.age = 30 # 에러
print(student.age)
```

### 접근지정자
- 대다수의 객체 지향 언어는 클래스 내부에서만 접근 가능한 것과 클래스 외부에서 인스턴스나 클래스 이름을 이용해서 접근하는 두가지 나누어서 속성이나 메서드 관리
- 객체 지향의 첫 번째 원칙인 캡슐화는 불필요한 부분은 숨기고 필요한 부분만 외부로 공개
  - 숨기는 것을 private 으로 설정한다고 하고 외부로 공개하는 것을 public으로 한다고 함
- 파이썬은 기본적으로 모두 public이고 앞에 __를 추가하면 private이 됨
```python
class Student:
    def __init__(self, num=0, name="noname"):
        # 앞에 __ 를 붙여서 속성 생성하면 인스턴스 외부에서 접근 불가
        self.__num = num
        self.__name = name
```

### property
- 속성을 이용해서 접근할 때 메서드를 호출하도록 만들어주는 문법
- 대다수의 객체 지향 언어는 속성에 직접 접근을 금지하고 메서드를 호출해서 사용하도록 하는데 이렇게 만들면 속성의 값을 가져오거나 설정할 때 메서드 호출 구문을 작성해야 하는데 이를 간단하게 하기 위해서 속성에 직접 접근하는 것처럼 속성의 값을 가져오거나 설정하는 형태의 기능
- 형식 `프로퍼티이름 = property(fget=None, fset=None, fdel=None, doc=None)`
- `프로퍼티 이름`을 호출하면 fget에 설정된 메서드가 `프로퍼티이름=` 하게되면 fset에 설정된 메서드가 호출
```python
class Student:
    def __init__(self, num=0, name="noname"):
        # 앞에 __ 를 붙여서 속성 생성하면 인스턴스 외부에서 접근 불가
        self.__num = num

    def getNum(self):
        return self.__num
    def setNum(self, num):
        self.__num = num
    
    num = property(fget=getNum, fset=setNum)
student = Student()
student.num = 1
print(student.num)
```
- getter 위에 `프로퍼티이름.getter 또는 setter` 와같이 데코레이터로 가능

```python
class Student:
    def __init__(self, num=0, name="noname"):
        # 앞에 __ 를 붙여서 속성 생성하면 인스턴스 외부에서 접근 불가
        self.__num = num
    @property
    def getNum(self):
        return self.__num
    
    @num.setter
    def setNum(self, num):
        self.__num = num
student = Student()
student.num = 1
print(student.num)
```

### Operator Overloading
- Method Overloading(중복 정의): 하나의 클래스에 메서드 이름은 같고 매개변수의 개수나 자료형이 다른 형태의 메서드가 존재하는 경우
- Operator Overloading(연산자 오버로딩): 기존 연산자에 새로운 기능을 보여하는 것
  - \+ 의 경우는 숫자 데이터를 더하는 기능을 가지고 있는데 문자열 + 문자열을 하는 경우 숫자 데이터가 아니므로 연산을 수행할 수 없는데 결합하는 기능을 + 문자열 = 결합의 기능을 하도록 만들어 둠
  - 연산자 오버로딩을 할 때는 연산자에 해당하는 메서드를 다시 만들면 됨
  - \+는 \_\_add__, 이메서드는 자기 자신과 다른 하나의 데이터로 매개변수로 받아야 함

```python
class Student:
    def __init__(self, num=0, name="noname"):
        # 앞에 __ 를 붙여서 속성 생성하면 인스턴스 외부에서 접근 불가
        self.__num = num
    @property
    def getNum(self):
        return self.__num
    
    @num.setter
    def setNum(self, num):
        self.__num = num
    # 이 클래스의 인스턴스끼리 더하기를 하면 nu를 더해서 리턴하도록 연산자 오버로딩을 수행
    def __add__(self, other):
        return self.num + other.num
    
    # print 함수와 같은 출력함수에 인스턴스를 전달했을 때 넘어가는 데이터를 수정
    def __str__(self):
        return str(self.num)

student1 = Student()
student2 = Student()
student1.num = 1
student2.num = 2
student3 = Student()
student3 = student1 + student2
print(student3.num)
print(student3)
```

### \_\_str__속성
- 거의 모든 프로그래밍 언어는 출력하는 메서드에 인스턴스를 대입해서 출력할 수 있도록 함
  - 기본적으로는 인스턴스의 참조를 출력
- 파이썬에서는 \_\_str__(self) 라는 함수를 정의하면 이 함수가 리턴하는 값을 출력
  - 대부분의 다른 언어에서는 toString 메서드

### \_\_new__(cls, \*args, \*\*kwargs)
- 메모리 할당 메서드
- 파이썬에 인스턴스를 생성하면 \_\_new__를 호출해서 메모리 할당(allocation)을 하고 \_\_init__를 호출해서 메모리 초기화를 수행하고 id를 리턴
- Singleton Pattern: 클래스가 인스턴스를 1개만 만드는 디자인 패턴
  - 서버에 만드는 클래스들은 대부분 인스턴스를 1개만 만들어서 사용
- 파이썬에서 싱글톤 구현
```python
class Student:
    # 리턴할 인스턴스를 저장할 변수
    __instance = None

    def __new__(cls, *args, **kwargs):
        # 인스턴스가 만들어지지 않았다면 인스턴스 생성, 그렇지 않으면 기존 인스턴스 리턴
        if cls.__instance is None:
            cls.__instance = object.__new__(cls, *args, **kwargs)
        return cls.__instance

student1 = Student()
student2 = Student()
print(student1 is student2)
```

### Inheritance
- 하위 클래스가 상위 클래스의 모든 것을 물려받는 것
- 파이썬에서 상속받는 방법
  - `class 클래스이름(상위클래스이름)`
```python
class Super:
    def greeting(self):
        print("안녕하세요")

# Super 클래스로부터 상속받는 하위 클래스
class Sub(Super):
    def study(self):
        print("공부합시다")
sub = Sub()
sub.study()

# 자신의 클래스에는 메서드가 존재하지 않지만 상위 클래스에 존재해서 사용 가능
sub.greeting()

# 상속 관계인지 확인
print(issubclass(Sub, Super))
```

- issubclass 라는 함수에 클래스 2개를 대입하면 상속 관계인지 여부를 알려줌
  - 첫번째 매개변수로 하위 클래스를 대입하고 두번째 매개변수로 상위 클래스를 대입
- __base__속성을 사용하면 상위 클래스 목록을 확인할 수 있음
  - 파이썬은 다중 상속을 지원하기 때문에 상위 클래스가 1개가 아니고 여러 개일 수 있음
- 상위 클래스의 속성을 하위 클래스에서 사용하기 위해서는 __init__메서드를 만들어서 super().init을 호출해야 함
  - 여러 클래스로부터 상속 받아서 동일한 메서드가 존재하는 경우 특정 상위 클래스의 메서드를 호출할 때는 super(클래스이름, self). 로 접근
- Method Overriding(재정의): 상위 클래스에 존재하는 메서드를 하위 클래스에서 재정의 하는것
  - 목적이 상위 클래스의 메서드 기능 확장
  - 오버라이딩을 할 때는 상위 클래스의 메서드를 호출하고 기능을 추가해야 함
  - 상위 클래스의 메서드를 호출하지 않을 거라면 오버라이딩을 하지 말고 다른 이름으로 메서드를 만들어야 함
  - 안드로이드나 iOS 프레임워크에서 상위 클래스의 메서드를 호출하지 않으면 에러가 발생하기도 함

```python
class Super:
    def __init__(self):
      self.score = 10
    
    def greeting(self):
        print("안녕하세요")
  
# Super 클래스로부터 상속받는 하위 클래스
class Sub(Super):
    # 메서드 오버라이딩 - 상위 클래스에 존재하는 메서드를 하위 클래스에서 다시 정의하는 것
    # 목적이 기능 확장
    # 파괴할 때를 제외하곤 super()를 앞에 불러야(계란 노른자흰자)
    def greeting(self):
        super().greeting()
        print("반갑습니다")
    
    super().__init__()
    # 상위 클래스의 초기화 메서드를 호출해야만 상위 클래스에 만들어진 인스턴스 속성을 사용할 수 있음
    def __init__(self):
        self.name = "adam"

sub = Sub()
print(sub.name)
print(sub.Score)
sub.greeting()
```
- 파이썬은 다중 상속을 지원
  - 다중 상속: 여러 개의 클래스로부터 상속을 받는 것
  - 장점은 여러 클래스들의 멤버를 사용할 수 있음
  - 단점은 여러 클래스들의 공통된 이름이 있는 경우 호출이 애매모호해 질 수 있음
- ( ) 안에 여러 클래스 이름을 나열하면 됨
- MRO(Method Resolution Order - 메서드 탐색 순서): `클래스이름.mro()` 하면 알 수 있음
  - `super()`로 호출하면 첫번째 상위 클래스의 메서드를 호출함
  - `super(클래스이름, self)`로 호출하면 다음 상위 클래스의 메서드를 호출

```python
class Super:
    def __init__(self):
      self.score = 10
    
    def greeting(self):
        print("안녕하세요")
  
# Super 클래스로부터 상속받는 하위 클래스
class Super1:
    def greeting(self):
        print("Super1")

class Super2:
    def greeting(self):
        print("Super2")

# Super1과 Super2 클래스로부터 상속받는 하위 클래스
# 여러 개의 클래스로부터 상속을 받으면 앞의 클래스가 메서드 탐색 우선권을 가짐
class Sub(Super1, Super2):
    
    # 메서드 오버라이딩
    def greeting(self):
        super().greeting()
        
        # Super2의 greeting을 호출하는 방법
        # Super1 다음 클래스부터 메서드를 탐색하라고 설정
        super(Super1, self).greeting()
sub = Sub()
sub.greeting()
```

### Abstract
- Abstract Method: 내용이 없고 이름만 존재하는 메서드, 하위 클래스에서 반드시 구현해서 사용, Abstract Class 에만 존재해야 함
- Abstract Class: 자신의 인스턴스를 생성할 수 없는 클래스
  - abc 모듈을 가져와서 Class의 괄호 안에 `metaclass=ABCMeta`를 추가해서 생성
  - 추상 메서드를 만들 때 `@abstractmethod`를 추가해서 추상 메서드를 생성
  - 추상 클래스를 상속받은 클래스는 반드시 추상 메서드를 구현해야 함
- 구현 이유
  - 템플릿 메서드 패턴 구현: 템플릿을 만들고 그 다음 실제 구현
```python
import abc

# 추상 클래스 - 인스턴스를 생성할 수 없음
class Restaurant(metaclass=abc.ABCMeta):
    # 추상 메서드: 내용이 없는 메서드
    @abc.abstractmethod
    def food(self):
        pass

# 추상 클래스를 상속받는 클래스
# 추상 클래스를 상속받으면 반드시 추상 메서드를 만들어야 함
class Sub(Restaurant):
    def food(self):
        print("음식")

sub = Sub()
```
### Delegation
- 존재하지 않는 메서드를 호출하면 에러가 발생
- __getattr__메서드를 구현하면 존재하지 않는 메서드 호출을 에러가 발생하지 않도록 해줌
  - 존재하지 않는 메서드를 호출하면 getattr 메서드가 호출됨

### coroutine
- cooperative routine을 의미하는데 서로 협력하는 루틴
- 함수가 종료되지 않는 상태에서 다른 함수의 코드를 수행하고 다시 돌아와서 나머지 코드를 수행할 수 있도록 하는 기능
- 일반 함수는 호출을 하면 코드를 한 번에 전체를 실행하지만 coroutine은 코드를 여러 번 실행하는 것이 가능

```python
def tot_coroutine():
    tot = 0

    # 무한반복
    while True:
        x = (yield) # 코루틴을 수행하고자 할 때 넘겨주는 데이터를 받기 위한 문장, 여기서 대기
        tot = tot + x
        print(f"현재까지의 합: {tot}")
co = tot_coroutine()
next(co) # 처음 yield까지 수행

co.send(1) # tot = 1이 되고 print출력 후 다시 yield전에서 멈춤
print("안녕하세요")
co.send(3) # tot = 1 + 3, print후 다시 대기
print("안녕하세요")
co.send(5) # tot = 4 + 5, print후 다시 대기
```
- coroutine이 외부로 데이터를 전달하고자 할 때는 yield 다음에 데이터를 기재해주면 send와 next의 리턴 값이 됨

```python
def tot_coroutine():
    tot = 0

    # 무한반복
    while True:
        x = (yield tot) # 코루틴을 수행하고자 할 때 넘겨주는 데이터를 받기 위한 문장, 여기서 대기
        tot = tot + x
        print(f"현재까지의 합: {tot}")
co = tot_coroutine()
print(next(co)) # 0 출력

print(co.send(1)) # 1 출력
print("안녕하세요")
print(co.send(3)) # 4 출력
print("안녕하세요")
print(co.send(5)) # 9 출력
```
- coroutine은 종료되지 않고 대기하도록 무한 반복문을 사용
- coroutine을 강제로 종료하고자 하는 경우에는 coroutine 인스턴스가 `close`라는 메서드를 호출하면 됨
- coroutine을 강제로 종료하면 GeneratorExit 라는 예외가 발생
- GeneratorExit 예외를 처리하면 프로그램을 중단하지 않고 계속 수행 가능

```python
def tot_coroutine():
    tot = 0
    try:
        # 무한반복
        while True:
            x = (yield)
            print(x)
    except GeneratorExit:
        print("코루틴 종료")

# 코루틴 인스턴스 생성 - 함수를 실행하는 것이 아니고 코루틴 인스턴스를 생성하는 것
# 함수 내부에 yield를 가지고 있으면 이 함수는 코루틴
co = tot_coroutine()
next(co)

co.send(100)

# 코루틴 종료
co.close()

print("프로그램 종료")
```