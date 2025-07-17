package com.example; // Este é o pacote base

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan; 


@SpringBootApplication

public class ProductManagementBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProductManagementBackendApplication.class, args);
    }

}