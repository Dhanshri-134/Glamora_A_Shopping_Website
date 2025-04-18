package com.project.eccom.dao;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.eccom.entity.Product;

import java.util.List;

@Repository
public interface ProductDao  extends CrudRepository<Product,Integer>{

    public List<Product> findAll(Pageable pageable);
}