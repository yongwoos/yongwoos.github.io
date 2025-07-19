---
title: Bean
weight: 2
---
"빈" (Bean)은 **스프링 프레임워크**에서 관리되는 객체를 의미합니다. 스프링은 이러한 객체들을 생성, 초기화, 소멸을 자동으로 관리하며, 의존성 주입(Dependency Injection)을 통해 서로 연결된 객체들이 자동으로 작업을 할 수 있게 만듭니다.

### 1. **빈(Bean)의 정의**

스프링에서 빈은 **스프링 컨테이너**에 의해 관리되는 객체입니다. 즉, 빈은 스프링 애플리케이션 컨텍스트(ApplicationContext)에 의해 생성되고, 관리되며, 애플리케이션의 다른 부분과 상호작용합니다.

스프링에서는 객체를 단순히 "빈"이라고 부르며, 이는 스프링의 **IoC (Inversion of Control)** 컨테이너에 의해 **관리되는 객체**라는 뜻입니다.

### 2. **빈의 주요 특징**

- **생명주기 관리**: 스프링은 빈의 생명주기를 자동으로 관리합니다. 즉, 빈의 생성, 초기화, 소멸을 스프링이 책임집니다.
  
- **의존성 주입 (Dependency Injection)**: 스프링은 빈들 간의 의존성을 자동으로 해결하고 주입합니다. 예를 들어, 한 빈이 다른 빈을 사용할 때, 이를 자동으로 연결하고 주입해줍니다.

- **구성 가능성**: 빈은 보통 `@Component`, `@Service`, `@Controller`, `@Repository`와 같은 애노테이션을 통해 정의되며, 이는 자동으로 스프링 컨테이너에 등록됩니다.

### 3. **빈의 생성과 등록**

빈은 주로 **스프링 컨테이너**에 의해 관리됩니다. 스프링의 IoC 컨테이너는 애플리케이션 시작 시, **컴포넌트 스캔(Component Scan)**을 통해 `@Component`, `@Service`, `@Controller`, `@Repository`와 같은 애노테이션이 붙은 클래스를 찾아 자동으로 빈으로 등록합니다.

- **`@Component`**: 일반적인 빈을 정의할 때 사용합니다.
- **`@Service`**: 서비스 계층의 비즈니스 로직을 처리하는 클래스에 사용됩니다.
- **`@Repository`**: 데이터베이스와의 상호작용을 담당하는 클래스에 사용됩니다.
- **`@Controller`**: 웹 애플리케이션의 요청을 처리하는 클래스에 사용됩니다.

### 4. **빈의 생성 예시**

#### 1. `@Component` 사용 예시
```java
@Component
public class MyBean {
    public void greet() {
        System.out.println("Hello from MyBean!");
    }
}
```

#### 2. `@Service` 사용 예시
```java
@Service
public class MyService {
    public String getServiceMessage() {
        return "Service Layer Message";
    }
}
```

#### 3. `@Controller` 사용 예시
```java
@Controller
public class MyController {
    
    private final MyService myService;

    // MyService 빈을 주입받는다.
    @Autowired
    public MyController(MyService myService) {
        this.myService = myService;
    }

    @GetMapping("/greet")
    public String greet() {
        return myService.getServiceMessage();
    }
}
```

위의 예시에서는 `@Component`, `@Service`, `@Controller` 애노테이션을 사용하여 각각 **빈**을 정의했습니다. 스프링은 애플리케이션 시작 시 `@ComponentScan`을 통해 이 클래스들을 찾아 자동으로 빈으로 등록하고 관리합니다.

### 5. **빈의 생명주기**

스프링 빈은 **생명주기**에 따라 관리됩니다. 빈의 생명주기에는 다음과 같은 단계가 있습니다:

1. **빈 생성**: 스프링 컨테이너는 애플리케이션 실행 시점에 빈을 생성합니다. 이를 위해 기본 생성자나 지정된 생성자를 호출합니다.
  
2. **초기화**: 빈이 생성된 후 초기화 메서드가 호출될 수 있습니다. 예를 들어, `@PostConstruct` 애노테이션을 사용하거나, XML 설정에서 `init-method`를 지정할 수 있습니다.

3. **사용**: 빈은 애플리케이션 내에서 주입되거나 사용됩니다. 의존성 주입을 통해 다른 빈에서 참조할 수 있습니다.

4. **소멸**: 애플리케이션이 종료되면 스프링은 빈을 소멸시킵니다. 이를 위해 `@PreDestroy` 애노테이션을 사용하거나, XML 설정에서 `destroy-method`를 지정할 수 있습니다.

### 6. **빈 등록 방법**

스프링에서 빈은 두 가지 방법으로 등록할 수 있습니다:

#### 1. **애노테이션을 통한 빈 등록**
`@Component`, `@Service`, `@Controller`, `@Repository` 등을 사용하여 빈을 등록할 수 있습니다. 스프링은 이러한 애노테이션을 통해 자동으로 빈을 등록하고 관리합니다.

#### 2. **Java Config를 통한 빈 등록**
```java
@Configuration
public class AppConfig {

    @Bean
    public MyBean myBean() {
        return new MyBean();
    }
}
```
위 예시에서 `@Bean` 애노테이션을 사용하여 `myBean` 메서드를 통해 빈을 등록할 수 있습니다.

### 7. **빈의 의존성 주입 (Dependency Injection)**

빈은 스프링 컨테이너가 관리하는 객체이기 때문에, 다른 빈들이 이 빈을 의존성 주입을 통해 사용할 수 있습니다.

- **생성자 주입**: 의존성 객체를 생성자 파라미터로 전달하여 주입합니다.
- **필드 주입**: `@Autowired`를 통해 필드에 직접 주입합니다.
- **세터 주입**: 세터 메서드를 통해 의존성 객체를 주입합니다.

### 8. **결론**

스프링에서 "빈"은 스프링 IoC 컨테이너가 관리하는 객체입니다. 빈은 `@Component`, `@Service`, `@Controller`와 같은 애노테이션을 통해 자동으로 등록되며, 스프링은 이러한 빈들의 생명주기를 관리하고, 의존성 주입을 통해 필요한 곳에 빈을 주입하여 사용할 수 있도록 합니다. 이러한 빈 관리 방식은 **객체 지향 설계**와 **구성 요소 간의 느슨한 결합**을 돕고, 애플리케이션을 더욱 유연하고 유지 보수 가능하게 만듭니다.