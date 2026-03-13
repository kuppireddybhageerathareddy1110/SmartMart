package com.smartmart.dto;

import lombok.*;

@Getter @Setter
public class OrderItemRequest {
    private Long productId;
    private String productName;
    private double price;
    private int quantity;
}