package com.smartmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartmart.model.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Long> {
}
