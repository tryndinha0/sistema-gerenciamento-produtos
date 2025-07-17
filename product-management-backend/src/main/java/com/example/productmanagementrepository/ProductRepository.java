package com.example.productmanagementrepository;

import com.example.productmanagementmodel.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {   
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}