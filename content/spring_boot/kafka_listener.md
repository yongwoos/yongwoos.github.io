---
title: KafkaListener
weight: 3
---
스프링부트에서 `@KafkaListener`를 사용하여 Kafka 메시지를 자동으로 수신하는 과정은 여러 스프링의 설정과 Kafka 클라이언트를 통해 이루어집니다. 이 과정을 좀 더 구체적으로 설명하면 다음과 같습니다:

### 1. **`@EnableKafka` 애노테이션**

스프링부트에서 `@KafkaListener`를 사용하려면 `@EnableKafka` 애노테이션을 클래스에 추가하여 Kafka 리스너를 활성화해야 합니다. 이 애노테이션은 스프링이 Kafka 관련 기능을 자동으로 설정하고, Kafka 리스너의 동작을 관리할 수 있도록 도와줍니다.

예시:
```java
@Configuration
@EnableKafka
public class KafkaConfig {
    // Kafka 관련 설정들
}
```

### 2. **KafkaListenerContainerFactory 설정**

`@KafkaListener` 애노테이션이 작동하려면 Kafka 리스너 컨테이너 팩토리 설정이 필요합니다. 스프링부트에서는 기본적으로 `KafkaListenerContainerFactory`를 자동으로 설정하지만, 필요에 따라 커스터마이징 할 수 있습니다.

예시:
```java
@Bean
public ConcurrentMessageListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
    ConcurrentMessageListenerContainerFactory<String, String> factory = new ConcurrentMessageListenerContainerFactory<>();
    factory.setConsumerFactory(new DefaultKafkaConsumerFactory<>(consumerConfig()));
    return factory;
}

@Bean
public Map<String, Object> consumerConfig() {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    return props;
}
```

### 3. **`@KafkaListener` 애노테이션 사용**

`@KafkaListener` 애노테이션을 메서드에 붙여서 해당 메서드가 Kafka 토픽의 메시지를 자동으로 수신하도록 할 수 있습니다. 이때, `@KafkaListener` 애노테이션은 Kafka 토픽을 구독하고, 메시지가 오면 자동으로 호출되는 메서드를 지정합니다.

예시:
```java
@Component
public class KafkaListenerService {

    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void listen(String message) {
        System.out.println("Received message: " + message);
    }
}
```

### 4. **Listener 자동 실행의 동작 원리**

스프링부트에서 Kafka 리스너가 자동으로 실행되는 과정은 다음과 같습니다:

- 스프링 부트 애플리케이션이 시작되면, `@EnableKafka` 애노테이션이 Kafka 관련 설정을 활성화합니다.
- `@KafkaListener`가 붙은 메서드는 `KafkaListenerEndpointRegistrar`에 의해 Kafka 리스너 컨테이너로 등록됩니다.
- 해당 메서드에 지정된 토픽에서 메시지가 수신되면, 스프링은 해당 메시지를 자동으로 처리하도록 설정된 메서드를 호출합니다.

스프링의 Kafka 리스너는 비동기적으로 동작하며, Kafka 서버와 연결되어 지속적으로 메시지를 대기합니다. 메시지가 도착하면, 해당 메서드가 자동으로 호출되어 메시지를 처리하게 됩니다.

### 5. **애플리케이션 구동 시 동작**

- 애플리케이션이 시작되면, 스프링은 `@KafkaListener`를 분석하고 이를 처리할 `MessageListenerContainer`를 생성합니다.
- 이 컨테이너는 Kafka 서버와 연결되어, 지정된 토픽에 대한 메시지를 수신하고, 메시지가 도착할 때마다 `@KafkaListener`가 적용된 메서드를 호출하여 메시지를 처리합니다.

이 모든 과정은 스프링이 자동으로 관리해주므로, `@KafkaListener` 애노테이션을 단 메서드만 작성하면, 그 메서드는 자동으로 Kafka 메시지를 수신하고 처리하는 역할을 하게 됩니다.