---
title: Entity 설계
weight: 3
---
## Favorite entity 추가, Id, CoinName, UserId(Foreign Key)
주어진 요구사항에 따라 "Favorite entity"를 추가하려면 아래 내용을 포함한 엔티티 정의가 필요합니다:

1. **Id**: 기본 키로 사용될 고유 식별자.
2. **CoinName**: 사용자가 선호하는 코인의 이름.
3. **UserId**: 사용자와 연관된 외래 키.

아래는 JPA를 사용한 Favorite 엔티티 구현 예제입니다:

### Favorite Entity

```java
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @Column(nullable = false)
    private String coinName; // 선호 코인 이름

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 외래 키로 사용자 연결
}
```

### User Entity 변경 (연관관계 추가)

```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Favorite> favorites = new ArrayList<>();
```

### Repository Interface

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
}
```

### API 예제 (Favorite 추가)

#### Controller

```java
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository; // User 레포지토리가 필요

    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteRequest request) {
        User user = userRepository.findById(request.getUserId())
                                  .orElseThrow(() -> new RuntimeException("User not found"));

        Favorite favorite = Favorite.builder()
                                    .coinName(request.getCoinName())
                                    .user(user)
                                    .build();

        favoriteRepository.save(favorite);
        return ResponseEntity.ok("Favorite added successfully");
    }
}
```

#### DTO

```java
import lombok.Data;

@Data
public class FavoriteRequest {
    private String coinName;
    private Long userId;
}
```
## 왜 ManyToOne?

이 구현으로 사용자는 선호 코인 이름과 사용자 ID를 제공하여 Favorite 데이터를 추가할 수 있습니다. 추가적으로 `findByUserId`를 활용해 사용자의 선호 코인을 조회하는 기능도 쉽게 구현 가능합니다.

---
`ManyToOne` 관계를 사용하는 이유는 **여러 개의 Favorite 엔티티가 하나의 User 엔티티와 연결되기 때문**입니다. 이 관계는 데이터베이스 관점에서 **"다대일 관계(Many-to-One Relationship)"**를 표현합니다.

### 관계의 의미
- **Favorite**: 사용자가 선호하는 코인을 저장하는 엔티티.
- **User**: Favorite의 소유자(사용자)를 나타내는 엔티티.

#### 상황 분석
1. **하나의 사용자(User)는 여러 개의 Favorite을 가질 수 있습니다.**
   - 예: 사용자가 선호 코인으로 `Bitcoin`, `Ethereum`을 선택했다면, 두 개의 Favorite 레코드가 생성됩니다.
2. **각 Favorite은 하나의 사용자(User)에 속합니다.**
   - 예: `Bitcoin`이라는 Favorite은 특정 사용자에 속해야 하므로 User와 연결됩니다.

### 다이어그램
#### `ManyToOne` 관계
```
User(1) --------------------- (N) Favorite
```
- 하나의 `User`는 여러 `Favorite`을 가질 수 있음.
- 각 `Favorite`은 하나의 `User`만 참조.

### 데이터베이스 관점
- **`Favorite` 테이블**에는 `user_id`라는 외래 키가 존재합니다.
- 이 외래 키는 `User` 테이블의 `id`를 참조합니다.

#### Favorite 테이블
| id  | coin_name | user_id |
|------|-----------|---------|
| 1    | Bitcoin   | 1       |
| 2    | Ethereum  | 1       |

#### User 테이블
| id  | username |
|------|----------|
| 1    | Alice    |
| 2    | Bob      |

### JPA에서 `ManyToOne` 사용의 장점
- **연관관계 매핑이 간단합니다.**
  - `@ManyToOne`을 통해 `Favorite` 엔티티가 `User`를 참조하도록 설정.
- **쿼리 작성이 용이합니다.**
  - `favoriteRepository.findByUserId(userId)`처럼 외래 키를 기준으로 데이터를 쉽게 조회할 수 있습니다.

---

### 대안: `OneToMany`
`OneToMany`를 `User` 엔티티에 적용하면 양방향 관계를 설정할 수 있습니다.

```java
@OneToMany(mappedBy = "user")
private List<Favorite> favorites;
```

이 설정은 주로 **"사용자가 소유한 모든 Favorite을 조회"**하려는 경우에 유용합니다. 그러나 `OneToMany`는 단방향으로 설정하면 복잡한 매핑 테이블이 생길 수 있으므로 **보통은 양방향으로 사용**합니다.

---

### 결론
`Favorite`이 항상 `User`에 종속적이기 때문에 `ManyToOne` 관계가 적합합니다. 필요한 경우 양방향 관계를 설정하여 `User`에서 직접 `Favorite` 리스트를 가져올 수도 있습니다.

## private List<Favorite> favorites = new ArrayList<>(); User Entity에 저건 왜 추가?
User 엔티티에 `@OneToMany` 관계를 추가하는 이유는 **User와 Favorite 간의 양방향 연관관계를 설정**하여 데이터 관리와 활용을 더욱 유연하게 하기 위함입니다.  

### `@OneToMany`의 역할
```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Favorite> favorites = new ArrayList<>();
```
위 코드의 주요 목적은 **사용자(User) 입장에서 선호 코인(Favorite)을 관리할 수 있도록 연결**하는 것입니다.

---

### 주요 이유

1. **양방향 연관관계 설정**
   - User가 자신의 Favorite 리스트를 직접 조회하고 관리할 수 있습니다.
   - 예를 들어, 특정 사용자의 Favorite 목록을 가져오는 것이 더 직관적으로 가능합니다:
     ```java
     User user = userRepository.findById(userId).orElseThrow();
     List<Favorite> favorites = user.getFavorites();
     ```

2. **데이터 일관성 유지**
   - `cascade = CascadeType.ALL`: User와 연관된 Favorite 엔티티를 함께 저장, 수정, 삭제할 수 있습니다.
     - 예: User를 삭제하면 그와 연결된 모든 Favorite도 삭제됩니다.
   - `orphanRemoval = true`: User와 연관 관계가 끊어진 Favorite을 자동으로 삭제합니다.
     - 예: Favorite을 User의 favorites 리스트에서 제거하면 DB에서도 삭제됩니다.

3. **더 직관적인 객체 지향 모델링**
   - User가 자신과 관련된 모든 Favorite을 포함하는 컬렉션을 통해 Favorite 엔티티와의 관계를 더 쉽게 다룰 수 있습니다.
   - 이 방식은 객체지향 프로그래밍의 원칙에 부합합니다.

4. **JPA의 성능 최적화**
   - 양방향 관계를 사용하면 JPA가 객체 그래프를 관리하면서 최적화된 쿼리를 생성할 수 있습니다.
   - 예를 들어, `@EntityGraph`나 페치 조인을 사용해 User와 그의 Favorite을 한 번의 쿼리로 가져올 수 있습니다:
     ```java
     @Query("SELECT u FROM User u JOIN FETCH u.favorites WHERE u.id = :userId")
     User findUserWithFavorites(@Param("userId") Long userId);
     ```

---

### `mappedBy`의 의미
- `mappedBy = "user"`는 Favorite 엔티티에서 `user` 필드가 외래 키를 관리하고 있음을 명시합니다.
- 즉, User 엔티티는 읽기 전용으로 Favorite과의 관계를 정의하고, 실제 외래 키 관리는 Favorite 엔티티에서 수행합니다:
  ```java
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
  ```

---

### 예제: 사용자와 Favorite 추가
```java
User user = new User();
user.setUsername("Alice");

Favorite favorite1 = new Favorite();
favorite1.setCoinName("Bitcoin");
favorite1.setUser(user);

Favorite favorite2 = new Favorite();
favorite2.setCoinName("Ethereum");
favorite2.setUser(user);

user.getFavorites().add(favorite1);
user.getFavorites().add(favorite2);

userRepository.save(user);
```
- 위 코드로 User와 그의 Favorite들이 함께 저장됩니다.
- `CascadeType.ALL` 덕분에 Favorite은 별도로 저장하지 않아도 자동으로 처리됩니다.

---

### 결론
`@OneToMany`를 User 엔티티에 추가하면:
1. User에서 Favorite 리스트를 관리할 수 있습니다.
2. 데이터베이스와 객체 모델 간의 일관성이 높아집니다.
3. 엔티티 간의 관계를 직관적이고 효율적으로 사용할 수 있습니다.

만약 Favorite이 독립적으로 관리된다면 이 관계가 필요 없을 수도 있지만, 대부분의 경우 User가 자신의 Favorite을 쉽게 관리할 수 있는 기능은 유용합니다.

## User Entity와 CoinPrice Entity 같이 전체적으로 보여줘
아래는 `User` 엔티티와 `CoinPrice` 엔티티를 포함한 전체적인 구조를 보여줍니다. 두 엔티티는 각각 사용자를 정의하고, 코인의 과거 가격 데이터를 저장하는 역할을 수행합니다.  

### User Entity
```java
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @Column(nullable = false, unique = true)
    private String phoneNumber; // 사용자 전화번호

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorite> favorites = new ArrayList<>(); // 사용자의 선호 코인 목록

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CoinPrice> coinPrices = new ArrayList<>(); // 사용자가 설정한 과거 가격 기록
}
```

---

### Favorite Entity
```java
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @Column(nullable = false)
    private String coinName; // 선호 코인 이름

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 외래 키로 사용자 연결
}
```

---

### CoinPrice Entity
```java
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키

    @Column(nullable = false)
    private String coinName; // 코인 이름

    @Column(nullable = false)
    private Double price; // 설정된 코인 가격

    @Column(nullable = false)
    private LocalDateTime setAt; // 가격이 설정된 시간

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 외래 키로 사용자 연결
}
```

---

### 관계 설명
1. **User ↔ Favorite**
   - 하나의 `User`는 여러 `Favorite`을 가질 수 있음 (`OneToMany`).
   - 각 `Favorite`은 특정 `User`에 속함 (`ManyToOne`).

2. **User ↔ CoinPrice**
   - 하나의 `User`는 여러 개의 `CoinPrice`를 설정할 수 있음 (`OneToMany`).
   - 각 `CoinPrice`는 특정 `User`에 속함 (`ManyToOne`).

---

### 데이터베이스 관계 다이어그램
```
User (1) ----------- (N) Favorite
User (1) ----------- (N) CoinPrice
```

---

### 예제: 사용자의 선호 코인 및 가격 기록 추가
```java
User user = new User();
user.setPhoneNumber("123-456-7890");

// Favorite 추가
Favorite favorite1 = new Favorite();
favorite1.setCoinName("Bitcoin");
favorite1.setUser(user);

Favorite favorite2 = new Favorite();
favorite2.setCoinName("Ethereum");
favorite2.setUser(user);

user.getFavorites().add(favorite1);
user.getFavorites().add(favorite2);

// CoinPrice 추가
CoinPrice price1 = new CoinPrice();
price1.setCoinName("Bitcoin");
price1.setPrice(30000.0);
price1.setSetAt(LocalDateTime.now());
price1.setUser(user);

CoinPrice price2 = new CoinPrice();
price2.setCoinName("Ethereum");
price2.setPrice(2000.0);
price2.setSetAt(LocalDateTime.now());
price2.setUser(user);

user.getCoinPrices().add(price1);
user.getCoinPrices().add(price2);

// 저장
userRepository.save(user);
```

---

### 정리
- **User 엔티티**는 `Favorite`과 `CoinPrice`와 `OneToMany` 관계를 가집니다.
- 양방향 관계를 통해 User에서 Favorite이나 CoinPrice를 쉽게 관리할 수 있습니다.
- `cascade`와 `orphanRemoval`로 연관 데이터를 효과적으로 저장 및 삭제할 수 있습니다.

## JpaRepository<Favorite, Long>?
`FavoriteRepository`의 `JpaRepository<Favorite, Long>`은 **Spring Data JPA**의 기본적인 인터페이스를 상속받아 `Favorite` 엔티티에 대한 데이터 접근을 처리하도록 구성된 것입니다. 여기서 `Favorite`과 `Long`의 의미는 다음과 같습니다:

---

### `JpaRepository<Favorite, Long>`에서의 `Favorite`과 `Long`
1. **`Favorite`**  
   - JPA로 관리할 엔티티 클래스입니다.  
   - 즉, 데이터베이스에서 CRUD(생성, 읽기, 업데이트, 삭제) 작업을 수행할 테이블을 나타냅니다.  
   - `@Entity`로 정의된 클래스와 동일합니다.

2. **`Long`**  
   - `Favorite` 엔티티의 기본 키(Primary Key)의 타입입니다.  
   - 예를 들어, `Favorite` 클래스에서 기본 키로 사용되는 필드 `id`가 `Long` 타입으로 정의되어 있으므로, `JpaRepository`에 기본 키 타입으로 `Long`을 지정한 것입니다.  
   - 기본 키 타입이 `UUID`라면 `JpaRepository<Favorite, UUID>`와 같이 설정합니다.

---

### 코드 예제: Favorite Entity
```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 기본 키(Long 타입)

    @Column(nullable = false)
    private String coinName; // 선호 코인 이름

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 사용자 외래 키
}
```

- 여기서 `id` 필드는 `Long` 타입으로 선언되었습니다. 따라서, `JpaRepository`가 기본 키를 다룰 때 `Long` 타입으로 사용됩니다.

---

### `findByUserId(Long userId)` 메서드
```java
List<Favorite> findByUserId(Long userId);
```
- 이 메서드는 특정 사용자(User)의 ID로 `Favorite` 엔티티 리스트를 조회하는 기능을 제공합니다.
- `Long userId`는 User 엔티티의 기본 키 타입을 기반으로 한 인자입니다.
- 메서드 이름은 Spring Data JPA의 **쿼리 메서드 규칙**에 따라 자동으로 쿼리를 생성합니다:
  - `findBy` → 조회 메서드.
  - `UserId` → Favorite 엔티티의 `user` 필드가 참조하는 `User` 엔티티의 기본 키를 기준으로 조회.

---

### 예제 사용
```java
@Autowired
private FavoriteRepository favoriteRepository;

public void getFavoritesByUserId(Long userId) {
    List<Favorite> favorites = favoriteRepository.findByUserId(userId);
    favorites.forEach(favorite -> System.out.println(favorite.getCoinName()));
}
```

- 만약 `userId`가 1인 사용자의 Favorite 데이터를 가져오고 싶다면:
```java
getFavoritesByUserId(1L);
```

---

### 결론
- **`Favorite`**: 데이터베이스 테이블과 매핑된 JPA 엔티티 클래스입니다.
- **`Long`**: `Favorite` 엔티티의 기본 키(`id`)의 타입입니다.
- `findByUserId` 메서드는 특정 사용자 ID를 기준으로 Favorite 리스트를 반환합니다.