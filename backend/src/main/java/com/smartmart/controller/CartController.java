package com.smartmart.controller;

import org.springframework.web.bind.annotation.*;

import com.smartmart.model.CartItem;
import com.smartmart.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5183", "http://localhost:5184", "http://localhost:5185"})
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @PostMapping
    public CartItem add(@RequestBody CartItem item) {
        return service.add(item);
    }

    @GetMapping
    public java.util.List<CartItem> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
