package com.example.productmanagementservice;

import com.example.productmanagementmodel.Product;
import com.example.productmanagementrepository.ProductRepository;
import com.example.productmanagementexception.ResourceNotFoundException; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // criar produto
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // listar todos os produtos com paginação e ordenação
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    // listar produtos por nome (para desafio extra)
    public Page<Product> getProductsByName(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    // buscar produto por ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));
    }

    // atualizar produto
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));

        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        product.setQuantity(productDetails.getQuantity());

        return productRepository.save(product);
    }

    // excluir produto
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com id: " + id));
        productRepository.delete(product);
    }
}