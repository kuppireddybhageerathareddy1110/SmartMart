package com.smartmart.model;

import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class OrderItem {
    private Long productId;
    private String productName;
    private double price;
    private int quantity;
}