package com.smartmart.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.smartmart.model.Product;
import com.smartmart.model.User;
import com.smartmart.repository.ProductRepository;
import com.smartmart.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    public DataInitializer(ProductRepository productRepo, UserRepository userRepo) {
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepo.count() == 0) {
            Product p1 = new Product();
            p1.setName("Laptop");
            p1.setDescription("High-performance laptop");
            p1.setPrice(55000);
            p1.setImageUrl("https://via.placeholder.com/200");
            p1.setCategory("Electronics");
            productRepo.save(p1);

            Product p2 = new Product();
            p2.setName("Headphones");
            p2.setDescription("Noise-cancelling headphones");
            p2.setPrice(3500);
            p2.setImageUrl("https://via.placeholder.com/200");
            p2.setCategory("Electronics");
            productRepo.save(p2);

            Product p3 = new Product();
            p3.setName("Shoes");
            p3.setDescription("Running shoes");
            p3.setPrice(4200);
            p3.setImageUrl("https://via.placeholder.com/200");
            p3.setCategory("Fashion");
            productRepo.save(p3);

            Product p4 = new Product();
            p4.setName("Watch");
            p4.setDescription("Smart watch");
            p4.setPrice(9800);
            p4.setImageUrl("https://via.placeholder.com/200");
            p4.setCategory("Electronics");
            productRepo.save(p4);

            Product p5 = new Product();
            p5.setName("T-Shirt");
            p5.setDescription("Cotton t-shirt");
            p5.setPrice(1200);
            p5.setImageUrl("https://via.placeholder.com/200");
            p5.setCategory("Fashion");
            productRepo.save(p5);

            Product p6 = new Product();
            p6.setName("Book");
            p6.setDescription("Programming book");
            p6.setPrice(800);
            p6.setImageUrl("https://via.placeholder.com/200");
            p6.setCategory("Books");
            productRepo.save(p6);
        }

        if (userRepo.count() == 0) {
            User u1 = new User();
            u1.setName("John Doe");
            u1.setEmail("john@example.com");
            u1.setPassword("password");
            u1.setRole("USER");
            userRepo.save(u1);

            User u2 = new User();
            u2.setName("Admin");
            u2.setEmail("admin@example.com");
            u2.setPassword("admin");
            u2.setRole("ADMIN");
            userRepo.save(u2);
        }
    }
}