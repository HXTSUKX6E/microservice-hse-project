package net.javaguides.springboot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.javaguides.springboot.dto.UserChangeCompany;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private static final String TOPIC_USER_COMPANY_ASSIGNED = "user.updated.company";
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);

    @Autowired
    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendUserInfoFromChangeCompany(Long id, Long company_id) {
        UserChangeCompany event = new UserChangeCompany();
        event.setId(id);
        event.setCompanyId(company_id);

        try {
            String message = objectMapper.writeValueAsString(event); // Сериализация в JSON
            kafkaTemplate.send(TOPIC_USER_COMPANY_ASSIGNED, message); // Отправка в Kafka
        } catch (JsonProcessingException e) {
            logger.error("An error occurred", e);
        }
    }
}
