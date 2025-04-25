package net.javaguides.springboot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.javaguides.springboot.dto.ResponseNotificationEvent;
import net.javaguides.springboot.model.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class KafkaProducerService {
    private static final String TOPIC_RESPONSE = "response-notifications";
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendResponseNotification(String username, Response response) {

        ResponseNotificationEvent event = ResponseNotificationEvent.builder()
                .username(username)
                .response(response)
                .build();

        try {
            String message = objectMapper.writeValueAsString(event); // Сериализация в JSON
            kafkaTemplate.send(TOPIC_RESPONSE, message); // Отправка в Kafka
        } catch (JsonProcessingException e) {
            logger.error("An error occurred", e);
        }
    }
}
