package com.smartmart.controller;

import org.springframework.web.bind.annotation.*;

import com.smartmart.dto.LoginRequest;
import com.smartmart.dto.LoginResponse;
import com.smartmart.dto.RegisterRequest;
import com.smartmart.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5183", "http://localhost:5184", "http://localhost:5185"})
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        String token = service.login(request.getEmail());
        return new LoginResponse(token);
    }

    @PostMapping("/register")
    public LoginResponse register(@RequestBody RegisterRequest request) {
        String token = service.register(request.getName(), request.getEmail(), request.getPassword());
        return new LoginResponse(token);
    }
}
