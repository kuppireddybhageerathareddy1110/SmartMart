package com.smartmart.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class Product {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String category;
}
