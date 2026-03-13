package com.smartmart.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartmart.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
}
