package net.javaguides.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDTO {
    private String password;
    private String repeatPassword;

    public boolean passwordsMatch() {
        return password != null && password.equals(repeatPassword);
    }
}
