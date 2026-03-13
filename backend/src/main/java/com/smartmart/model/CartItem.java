package com.smartmart.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
public class CartItem {
    @Id @GeneratedValue
    private Long id;
    private Long userId;
    private Long productId;
    private int quantity;
}
