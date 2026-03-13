package com.smartmart.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
public class OrderRequest {
    private double totalAmount;
    private List<OrderItemRequest> items;
}