package com.smartmart.service;

import org.springframework.stereotype.Service;

import com.smartmart.model.CartItem;
import com.smartmart.repository.CartRepository;

@Service
public class CartService {

    private final CartRepository repo;

    public CartService(CartRepository repo) {
        this.repo = repo;
    }

    public CartItem add(CartItem item) {
        return repo.save(item);
    }

    public java.util.List<CartItem> getAll() {
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
