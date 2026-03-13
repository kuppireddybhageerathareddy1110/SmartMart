package com.smartmart.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Order {
    @Id @GeneratedValue
    private Long id;
    private Long userId;
    private String status;
    private double totalAmount;
    private LocalDateTime orderDate;

    @ElementCollection
    private List<OrderItem> items;

    @PrePersist
    public void prePersist() {
        orderDate = LocalDateTime.now();
    }
}
