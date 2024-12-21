---
title: 어노테이션
weight: 1
---
## 어노테이션 원리
스프링 부트에서 `@Controller`, `@Service`, `@Repository`와 같은 애노테이션이 자동으로 실행되는 과정은 **스프링의 컴포넌트 스캔(Component Scan)**과 **의존성 주입(Dependency Injection)** 메커니즘 덕분입니다. 이를 좀 더 구체적으로 설명하면 다음과 같습니다:
리
### 1. **컴포넌트 스캔 (Component Scan)**

스프링 부트는 애플리케이션 시작 시, 기본적으로 클래스 경로에서 `@Component` 또는 그 하위 애노테이션들이 붙은 클래스를 자동으로 찾아 관리합니다. `@Controller`, `@Service`, `@Repository`, `@Component` 등은 모두 **컴포넌트 스캔** 대상이 되는 애노테이션입니다. 

스프링 부트의 자동 구동 메커니즘은 애플리케이션을 시작할 때, 기본적으로 `@SpringBootApplication` 애노테이션이 붙은 클래스에서부터 컴포넌트 스캔을 시작합니다. 이 클래스는 `@EnableAutoConfiguration`, `@ComponentScan`, `@Configuration` 애노테이션을 포함하고 있기 때문입니다.

#### `@SpringBootApplication`의 역할:
- `@ComponentScan`: 스프링은 이 애노테이션을 통해 현재 클래스가 속한 패키지 및 하위 패키지에서 `@Component`, `@Controller`, `@Service` 등의 애노테이션을 찾아 빈(bean)을 자동으로 등록합니다.
- `@EnableAutoConfiguration`: 스프링 부트는 애플리케이션에 필요한 다양한 자동 설정을 활성화합니다.
- `@Configuration`: 스프링 컨테이너에 설정 클래스임을 알리고, 빈을 정의할 수 있도록 합니다.

### 2. **애노테이션의 역할**
- **`@Component`**: 스프링이 관리하는 일반적인 컴포넌트를 표시합니다. `@Controller`, `@Service`, `@Repository`는 모두 `@Component`의 특수화된 버전입니다.
- **`@Controller`**: MVC 패턴에서 웹 요청을 처리하는 컨트롤러 클래스를 정의할 때 사용합니다. 스프링은 이 클래스가 웹 요청을 처리하는 역할을 하도록 인식합니다.
- **`@Service`**: 서비스 클래스에 사용됩니다. 비즈니스 로직을 처리하는 컴포넌트를 정의하며, `@Service`는 `@Component`의 특수화된 형태로, 서비스 계층을 명확하게 나타냅니다.
- **`@Repository`**: 데이터베이스와의 상호작용을 담당하는 DAO(Data Access Object) 클래스에 사용됩니다. 예외 처리가 자동으로 처리되는 등의 데이터 액세스 관련 기능이 제공됩니다.

### 3. **빈 등록 및 의존성 주입 (Dependency Injection)**

스프링은 컴포넌트 스캔을 통해 자동으로 클래스를 **빈**(bean)으로 등록하고, 이 빈을 스프링 컨테이너에서 관리합니다. `@Controller`, `@Service`, `@Repository`로 애노테이션을 붙인 클래스는 자동으로 스프링의 **빈 팩토리**에 의해 빈으로 등록됩니다.

#### 빈 등록 및 의존성 주입 과정:
1. **컴포넌트 스캔**: 애플리케이션이 시작될 때, 스프링은 `@ComponentScan`을 통해 `@Controller`, `@Service`, `@Repository`가 붙은 클래스를 찾아 자동으로 빈으로 등록합니다.
2. **의존성 주입**: 클래스 간의 의존성 관계는 스프링이 자동으로 처리합니다. 예를 들어, `@Autowired`를 사용하여 다른 빈을 주입받을 수 있습니다.

### 4. **실행 흐름**

1. **스프링 컨테이너 시작**: 애플리케이션이 시작될 때, `@SpringBootApplication` 애노테이션이 포함된 클래스가 실행됩니다. 스프링 부트는 이 클래스를 기준으로 컴포넌트 스캔을 시작합니다.
2. **컴포넌트 스캔**: `@Controller`, `@Service`, `@Repository`, `@Component` 애노테이션이 붙은 클래스를 찾아 빈으로 등록합니다.
3. **빈 인스턴스화 및 의존성 주입**: 스프링 컨테이너가 빈을 인스턴스화하고, 필요한 의존성(필드, 생성자, 메서드)을 주입합니다.
4. **빈 사용**: 의존성 주입된 빈은 애플리케이션 내에서 사용되며, 예를 들어 컨트롤러는 요청을 처리하고, 서비스는 비즈니스 로직을 처리하며, 리포지토리는 데이터베이스와 상호작용합니다.

### 예시 코드

#### 1. `@Controller` 사용 예시:
```java
@Controller
public class MyController {

    private final MyService myService;

    @Autowired
    public MyController(MyService myService) {
        this.myService = myService;
    }

    @GetMapping("/hello")
    public String sayHello(Model model) {
        model.addAttribute("message", myService.getMessage());
        return "hello";
    }
}
```

#### 2. `@Service` 사용 예시:
```java
@Service
public class MyService {

    public String getMessage() {
        return "Hello from the service layer!";
    }
}
```

### 5. **스프링의 자동 설정**
스프링 부트는 애플리케이션의 설정을 최소화할 수 있도록 많은 부분을 자동으로 구성합니다. 예를 들어, `@Controller`, `@Service`로 정의된 클래스들은 빈으로 자동 등록되며, 각 계층에 필요한 설정은 스프링이 자동으로 처리합니다.

### 6. **결론**
스프링 부트에서 `@Controller`, `@Service`, `@Repository` 애노테이션이 자동으로 실행되는 이유는 **컴포넌트 스캔**과 **빈 관리** 시스템 덕분입니다. 애플리케이션이 시작될 때 스프링은 해당 애노테이션이 붙은 클래스를 찾아 빈으로 등록하고, 의존성 주입을 통해 자동으로 연결된 클래스를 실행할 수 있도록 관리합니다. 이를 통해 개발자는 코드에서 명시적으로 객체를 생성하거나 의존성을 수동으로 설정할 필요 없이 스프링이 자동으로 처리합니다.