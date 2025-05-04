package com.example.demo.service;

import com.example.demo.dto.ResponseNotificationEvent;
import com.example.demo.dto.UserRegistrationEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper;

    @Autowired
    public EmailService(JavaMailSender mailSender, ObjectMapper objectMapper) {
        this.mailSender = mailSender;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "user-change-event", groupId = "email-change-group")
    public void changeEmail(String message) {
        try {
            // Десериализация JSON в DTO
            UserRegistrationEvent event = objectMapper.readValue(message, UserRegistrationEvent.class);

            // Логика обработки события (отправка уведомления)
            sendConfirmationChangeEmail(event.getLogin(), event.getToken());

        } catch (Exception e) {
            logger.error("An error occurred", e);
        }
    }


    @KafkaListener(topics = "user-registration", groupId = "registration-group")
    public void listenRegistration(String message) {
        try {
            // Десериализация JSON в DTO
            UserRegistrationEvent event = objectMapper.readValue(message, UserRegistrationEvent.class);

            // Логика обработки события (отправка уведомления)
            sendVerificationEmail(event.getLogin(), event.getToken());

        } catch (Exception e) {
            logger.error("An error occurred", e);
        }
    }

    @KafkaListener(topics = "user-forgot-event", groupId = "user-forgot-event")
    public void listenForgotEmail(String message) {
        try {
            // Десериализация JSON в DTO
            UserRegistrationEvent event = objectMapper.readValue(message, UserRegistrationEvent.class);

            // Логика обработки события (отправка уведомления)
            sendForgotEmail(event.getLogin(), event.getToken());

        } catch (Exception e) {
            logger.error("An error occurred", e);
        }
    }


    @KafkaListener(topics = "response-notifications", groupId = "response-notifications")
    public void listenAddResponse(String message) {
        try {
            // Десериализация JSON в DTO
            ResponseNotificationEvent event = objectMapper.readValue(message, ResponseNotificationEvent.class);

            // Логика обработки события (отправка уведомления)
            sendMsgAboutResponse(event.getUsername(), event.getResponseName(), event.getEmail());

        } catch (Exception e) {
            logger.error("An error occurred", e);
        }
    }



    @Async
    public void sendConfirmationChangeEmail(String to, String token) {
        String subject = "Подтверждение изменения ";
        String confirmationUrl = "http://localhost/api/auth/confirm-email-change?token=" + token;
        String message = "Перейдите по ссылке для подтверждения смены email: " + confirmationUrl;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);

        mailSender.send(email);
    }

    @Async
    public void sendVerificationEmail(String to, String token) {
        String subject = "Подтверждение регистрации";
        String confirmationUrl = "http://localhost/api/auth/confirm?token=" + token;
        String message = "Перейдите по ссылке для подтверждения верификации аккаунта: " + confirmationUrl;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);

        mailSender.send(email);
    }

    @Async
    public void sendForgotEmail(String to, String token) {
        String subject = "Восстановление аккаунта";
        String confirmationUrl = "http://localhost/api/auth/confirm-reset-password?token=" + token;
        String message = "Для восстановления аккаунта следуйте инструкции по ссылке: " + confirmationUrl + "\nЕсли вы не пытались изменить пароль проигнорируйте данное сообщение!";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);

        mailSender.send(email);
    }

    @Async
    public void sendMsgAboutResponse(String username, String responseName, String to) {
        String subject = "Новый отклик на вакансию " + responseName;
        String message = String.format(
                "Уважаемый работодатель,\n" +
                        "На вашу вакансию «%s» откликнулся новый кандидат.\n\n" +
                        "Контактные данные для связи:\n" +
                        "📧 Email: %s\n\n" +
                        "Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.",
                responseName, username
        );

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);

        mailSender.send(email);
    }
}
