package net.javaguides.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.javaguides.springboot.model.Response;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ResponseNotificationEvent {
    private String username;  // Имя пользователя
    private String response; // name вакансии
    private String email; //куда присылаем
}
