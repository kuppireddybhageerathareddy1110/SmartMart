package com.smartmart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartmart.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
