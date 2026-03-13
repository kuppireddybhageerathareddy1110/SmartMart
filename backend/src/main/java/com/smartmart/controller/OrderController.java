package com.smartmart.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.smartmart.dto.OrderRequest;
import com.smartmart.dto.OrderItemRequest;
import com.smartmart.model.Order;
import com.smartmart.model.OrderItem;
import com.smartmart.model.User;
import com.smartmart.repository.UserRepository;
import com.smartmart.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5183", "http://localhost:5184", "http://localhost:5185"}) // ✅ explicit CORS
public class OrderController {

    private final OrderService service;
    private final UserRepository userRepo;

    public OrderController(OrderService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    // ✅ PLACE ORDER
    @PostMapping
    public ResponseEntity<Order> place(
            @RequestBody OrderRequest request,
            Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepo.findByEmail(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Order order = new Order();
        order.setUserId(user.getId());
        order.setStatus("PLACED");
        order.setTotalAmount(request.getTotalAmount());
        order.setItems(request.getItems().stream().map(item -> {
            OrderItem oi = new OrderItem();
            oi.setProductId(item.getProductId());
            oi.setProductName(item.getProductName());
            oi.setPrice(item.getPrice());
            oi.setQuantity(item.getQuantity());
            return oi;
        }).toList());

        Order saved = service.place(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ✅ GET MY ORDERS
    @GetMapping
    public ResponseEntity<List<Order>> myOrders(Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepo.findByEmail(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Order> orders = service.getOrdersByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }
}
