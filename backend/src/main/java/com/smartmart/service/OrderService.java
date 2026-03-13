package com.smartmart.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartmart.model.Order;
import com.smartmart.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public Order place(Order order) {
        order.setStatus("PLACED");
        return repo.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return repo.findByUserId(userId);
    }
}
