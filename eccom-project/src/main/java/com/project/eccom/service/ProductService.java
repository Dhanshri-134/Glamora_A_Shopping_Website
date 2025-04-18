package com.project.eccom.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.project.eccom.dao.ProductDao;
import com.project.eccom.entity.Product;
import org.springframework.web.bind.annotation.PathVariable;


@Service
public class ProductService {

    @Autowired
    private ProductDao productDao;

    public Product addNewProduct(Product product) { return productDao.save(product);}
        
    public List<Product> getAllProducts(int pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber, 12);
        return (List<Product>)productDao.findAll(pageable);
    }
    
    public Product getProductDetailsById(Integer productId){
        return productDao.findById(productId).get();
    }

    public void deleteProductDetails(Integer productId){
        productDao.deleteById(productId);
    }

    public List<Product> getProductDetails(boolean isSingleProductCheckout, Integer productId){
    if(isSingleProductCheckout){
        List<Product> list = new ArrayList<>();
        Product product = productDao.findById(productId).get();
        list.add(product);
        return list;
    }
    else{

    }
    return new ArrayList<>();
    }
}