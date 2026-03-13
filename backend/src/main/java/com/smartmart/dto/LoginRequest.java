package com.smartmart.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}
