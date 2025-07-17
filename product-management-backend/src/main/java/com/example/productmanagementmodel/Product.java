package com.example.productmanagementmodel;

import jakarta.persistence.*; // Importe do pacote jakarta.persistence
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "products") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Campo id

    @Column(nullable = false)
    private String name; // Campo nome

    @Column(nullable = false)
    private Double price; // Campo preço

    @Column(length = 500) // Limita o tamanho da descrição
    private String description; // Campo descrição

    @Column(nullable = false)
    private Integer quantity; // Campo quantidade
}