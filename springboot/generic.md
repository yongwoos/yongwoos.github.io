---
title: Generic
weight: 4
---
## Generic이란
제네릭(Generic)은 다양한 데이터 타입을 지원할 수 있도록 일반화된 코드를 작성하는 데 사용되는 프로그래밍 개념입니다. 주로 컴파일 타임에 타입 안정성을 보장하면서도 코드의 재사용성을 높이는 데 목적이 있습니다. 제네릭은 특정 데이터 타입에 의존하지 않는 추상적인 방식으로 동작하며, Java, C#, TypeScript, Go 등 다양한 프로그래밍 언어에서 지원됩니다.

### 주요 특징
1. **타입 안정성**: 컴파일 시점에 타입 체크를 수행하여 런타임 오류를 줄입니다.
2. **재사용성**: 여러 데이터 타입에 대해 동일한 로직을 사용할 수 있도록 해줍니다.
3. **가독성 및 유지보수성**: 코드 중복을 줄이고 명확하게 작성할 수 있어 유지보수가 쉬워집니다.

### 예시
#### Java의 제네릭
```java
import java.util.ArrayList;

public class GenericExample {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>(); // 제네릭을 사용해 타입 지정
        list.add("Hello");
        list.add("World");
        // list.add(123); // 컴파일 오류 발생

        for (String item : list) {
            System.out.println(item); // 타입 캐스팅 불필요
        }
    }
}
```

#### Go의 제네릭
Go 1.18부터 도입된 제네릭을 사용한 예시:
```go
package main

import "fmt"

func Sum[T int | float64](a, b T) T {
    return a + b
}

func main() {
    fmt.Println(Sum(10, 20))        // 정수 타입
    fmt.Println(Sum(10.5, 20.3))    // 부동 소수점 타입
}
```

#### TypeScript의 제네릭
```typescript
function identity<T>(value: T): T {
    return value;
}

console.log(identity<string>("Hello")); // "Hello"
console.log(identity<number>(42));      // 42
```

### 활용 사례
1. **자료 구조**: 리스트, 맵 등과 같은 컬렉션을 다양한 타입으로 일반화.
2. **알고리즘**: 타입에 독립적인 정렬, 검색, 계산 함수.
3. **API 설계**: 재사용 가능한 인터페이스나 클래스 설계.

제네릭을 사용하면 코드의 타입 안정성을 유지하면서도 유연하고 효율적으로 작성할 수 있습니다.

## ArrayList의 Generic
---

`ArrayList<String> list`는 Java에서 제네릭을 사용하여 선언된 코드로, 아래와 같은 의미를 가집니다:

### 상세 설명

1. **`ArrayList<String>`**
   - `ArrayList`는 Java의 컬렉션 프레임워크에서 제공하는 동적 배열 클래스입니다.
   - `<String>`은 **제네릭 타입 매개변수**로, `ArrayList`가 **저장할 수 있는 데이터의 타입을 String으로 제한**하겠다는 뜻입니다.

2. **`list`**
   - `list`는 변수의 이름입니다.
   - `list`의 타입은 `ArrayList<String>`입니다. 즉, 이 변수는 "String 타입만 저장할 수 있는 ArrayList 객체"를 참조합니다.

3. **타입 관점에서의 해석**
   - **`list`의 타입은 `ArrayList`이다.**
     - 더 정확히 말하면, `list`는 **`ArrayList<String>`** 타입입니다.
   - 그러나, 이 `ArrayList`가 제네릭으로 `String` 타입을 지정했기 때문에, **list는 String 값만 저장할 수 있는 ArrayList**입니다.

---

### 예시로 이해하기
```java
ArrayList<String> list = new ArrayList<>();
list.add("Hello");   // 가능: String 값 추가
list.add("World");   // 가능: String 값 추가
// list.add(123);    // 오류: String이 아닌 값은 추가할 수 없음

for (String s : list) {
    System.out.println(s);  // String 타입으로 자동 캐스팅
}
```

### 요약
- `list`의 타입은 **`ArrayList<String>`**이며, 이는 "String 값만 저장할 수 있는 ArrayList"를 의미합니다.
- 제네릭을 사용했기 때문에, 컴파일러는 `list`에 String 외의 다른 타입이 저장되는 것을 허용하지 않습니다.
- 이로 인해 타입 안전성이 보장되며, 값을 꺼낼 때 별도의 타입 캐스팅이 필요하지 않습니다.

## Generic과 Object
엄밀히 말하자면, Java에서 **제네릭을 사용하지 않은 `ArrayList`**는 기본적으로 `Object` 타입을 저장할 수 있습니다. 하지만 **제네릭을 사용하는 `ArrayList<T>`**는 특정 타입(T)만 저장할 수 있도록 제한되며, 타입 안정성을 제공합니다. 

즉, 다음과 같은 차이가 있습니다:

---

### 1. **제네릭을 사용하지 않은 경우 (`ArrayList` without `<T>`)**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList list = new ArrayList();  // 제네릭 미사용
        list.add("Hello");                // String 추가
        list.add(123);                    // Integer 추가

        for (Object obj : list) {         // Object로 처리해야 함
            System.out.println(obj);
        }
    }
}
```

- **`ArrayList`의 기본 타입은 `Object`**입니다.
- 모든 객체를 저장할 수 있지만, 값을 꺼낼 때마다 **명시적으로 타입 캐스팅**을 해야 하며, 런타임 오류 가능성이 있습니다.
  
---

### 2. **제네릭을 사용한 경우 (`ArrayList<T>`)**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>(); // 제네릭 사용
        list.add("Hello");                          // String만 추가 가능
        // list.add(123);                           // 컴파일 오류

        for (String str : list) {                  // String으로 처리
            System.out.println(str);
        }
    }
}
```

- **제네릭을 사용하여 타입을 제한**하면 `ArrayList`는 `Object`가 아닌 지정된 타입(T)을 처리하도록 동작합니다.
- 타입 안정성이 보장되며, 값에 접근할 때 **캐스팅이 필요 없습니다**.

---

### 3. **Object와의 관계**

`ArrayList`의 내부 동작은 여전히 Java의 모든 객체가 상속받는 `Object`를 기반으로 작동합니다. 하지만 제네릭을 사용하면 다음과 같은 변화가 있습니다:

1. **컴파일러 수준에서 타입 강제**:
   - 제네릭으로 제한된 타입 외의 데이터는 컴파일 타임에 오류로 처리됩니다.
   
2. **런타임에는 타입 삭제(Type Erasure)**:
   - Java의 제네릭은 컴파일 후에는 타입 정보를 제거하고 `Object`로 처리됩니다.
   - 이는 **타입 안정성을 컴파일 타임에만 확인**하며, 런타임에 별도의 제약을 주지 않기 때문입니다.

---

### 결론

`ArrayList<String>`은 **컴파일 타임에는 String 타입만 다룰 수 있도록 제한**하지만, 내부적으로는 `ArrayList`가 여전히 `Object`를 기반으로 동작합니다.  
즉, 제네릭을 통해 **타입 안정성을 보장하는 문법적인 장치**일 뿐, 런타임에는 실제로는 `Object`처럼 동작합니다.

## Generic Class
**제네릭 클래스**는 클래스의 정의에서 타입 매개변수(type parameter)를 사용하여 여러 타입에 대해 동작할 수 있도록 일반화된 코드를 작성하는 것입니다. Java에서는 제네릭 클래스를 정의하여 특정 데이터 타입에 의존하지 않고, 다양한 타입을 처리할 수 있는 유연한 코드를 작성할 수 있습니다.
### 제네릭 클래스의 기본 구조
```java
class ClassName<T> {
    private T data;  // 제네릭 타입 T 사용

    public ClassName(T data) {
        this.data = data;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
```

- **`<T>`**: 타입 매개변수. 클래스가 사용할 데이터 타입을 나중에 지정할 수 있음.
- `T`는 임의의 이름이며, 보통 관습적으로 **`T`, `E`, `K`, `V`** 등의 이름을 사용.

---

### 제네릭 클래스 예제

#### 1. 기본 예제
```java
class Box<T> {
    private T item;

    public Box(T item) {
        this.item = item;
    }

    public T getItem() {
        return item;
    }

    public void setItem(T item) {
        this.item = item;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<String> stringBox = new Box<>("Hello");
        System.out.println(stringBox.getItem());  // "Hello"

        Box<Integer> intBox = new Box<>(123);
        System.out.println(intBox.getItem());     // 123
    }
}
```

#### 2. 제네릭 클래스와 여러 타입 매개변수
제네릭 클래스는 하나 이상의 타입 매개변수를 가질 수 있습니다.
```java
class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Pair<String, Integer> pair = new Pair<>("Age", 30);
        System.out.println(pair.getKey() + ": " + pair.getValue());  // "Age: 30"
    }
}
```

---

### 제네릭 클래스의 특징
1. **타입 안정성**  
   제네릭을 사용하면 잘못된 타입의 데이터가 들어오는 것을 컴파일 타임에 방지합니다.
   
2. **재사용성**  
   제네릭 클래스를 정의하면 다양한 타입에 대해 같은 코드를 재사용할 수 있습니다.

3. **타입 캐스팅 불필요**  
   제네릭 클래스를 사용하면 값을 가져올 때 타입 캐스팅이 필요 없습니다.

---

### 제네릭 클래스와 Object 비교
#### Object 기반 클래스
```java
class ObjectBox {
    private Object item;

    public Object getItem() {
        return item;
    }

    public void setItem(Object item) {
        this.item = item;
    }
}

public class Main {
    public static void main(String[] args) {
        ObjectBox box = new ObjectBox();
        box.setItem("Hello");

        // 타입 캐스팅 필요
        String str = (String) box.getItem();
        System.out.println(str);
    }
}
```

- Object를 사용하면 모든 타입의 데이터를 저장할 수 있지만, 값을 꺼낼 때 **타입 캐스팅이 필요**하며, 잘못된 타입으로 캐스팅할 경우 **런타임 오류**가 발생할 수 있습니다.

#### 제네릭 클래스
```java
class GenericBox<T> {
    private T item;

    public T getItem() {
        return item;
    }

    public void setItem(T item) {
        this.item = item;
    }
}

public class Main {
    public static void main(String[] args) {
        GenericBox<String> box = new GenericBox<>();
        box.setItem("Hello");

        // 타입 캐스팅 불필요
        String str = box.getItem();
        System.out.println(str);
    }
}
```

- 제네릭 클래스를 사용하면 컴파일 타임에 타입 안정성을 보장하며, **타입 캐스팅 없이 사용**할 수 있습니다.

---

### 제네릭 클래스와 타입 제한 (Bounded Type)
제네릭 클래스의 타입 매개변수에 대해 특정 상위 클래스나 인터페이스로 제한을 걸 수 있습니다.

#### 상한 제한 (Upper Bound)
```java
class NumberBox<T extends Number> {  // T는 Number 또는 그 하위 타입만 가능
    private T number;

    public NumberBox(T number) {
        this.number = number;
    }

    public T getNumber() {
        return number;
    }
}

public class Main {
    public static void main(String[] args) {
        NumberBox<Integer> intBox = new NumberBox<>(123);  // Integer 허용
        NumberBox<Double> doubleBox = new NumberBox<>(45.6); // Double 허용
        // NumberBox<String> stringBox = new NumberBox<>("Hello"); // 오류!
    }
}
```

#### 하한 제한 (Lower Bound)
```java
// 와일드카드와 함께 사용 (주로 메서드에 사용됨)
public void printNumbers(List<? super Integer> list) {
    for (Object obj : list) {
        System.out.println(obj);
    }
}
```

---

### 결론
제네릭 클래스는 타입 안정성과 재사용성을 제공하는 강력한 도구로, Java 프로그래밍에서 데이터 타입의 유연성을 확보하면서도 코드의 안전성과 가독성을 높이는 데 기여합니다.