package com.firstapp.javaapp.service;

import com.firstapp.javaapp.model.Product;
import com.firstapp.javaapp.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProducts(){
        System.out.println(repo.findAll());
        return repo.findAll();
    }

    public Product getProductById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
        product.setImageName(imageFile.getOriginalFilename());
        product.setImageType(imageFile.getContentType());
        product.setImageDate(imageFile.getBytes());
        if(product.getId() != -1 && repo.existsById(product.getId())){
            Product existingProduct = repo.findById(product.getId()).orElseThrow(()->
                    new IllegalArgumentException("Product with ID " + product.getId() + " does not exist."));
            existingProduct.setName(product.getName());
            existingProduct.setDesc(product.getDesc());
            existingProduct.setPrice(product.getPrice());

            if (imageFile != null && !imageFile.isEmpty()) {
                existingProduct.setImageName(imageFile.getOriginalFilename());
                existingProduct.setImageType(imageFile.getContentType());
                existingProduct.setImageDate(imageFile.getBytes());
            }
            return repo.save(existingProduct);

        }
        else{
            if (imageFile != null && !imageFile.isEmpty()) {
                product.setImageName(imageFile.getOriginalFilename());
                product.setImageType(imageFile.getContentType());
                product.setImageDate(imageFile.getBytes());
            }
            return  repo.save(product);
        }

    }

    public void deleteProduct(int id) {
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProduct(keyword);
    }
}
