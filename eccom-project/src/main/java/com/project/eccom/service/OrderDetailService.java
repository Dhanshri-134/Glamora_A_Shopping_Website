package com.project.eccom.service;

import com.project.eccom.configuration.JwtRequestFilter;
import com.project.eccom.dao.OrderDetailDao;
import com.project.eccom.dao.ProductDao;
import com.project.eccom.dao.UserDao;
import com.project.eccom.entity.OrderDetail;
import com.project.eccom.entity.OrderInput;
import com.project.eccom.entity.OrderProductQuantity;
import com.project.eccom.entity.Product;
import com.project.eccom.entity.User;

import java.util.List;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

@Service

public class OrderDetailService {
    private static final String ORDER_PLACED = "Placed";

    @Autowired
    private OrderDetailDao orderDetailDao;

    @Autowired
    private ProductDao productDao;

    @Autowired
    private UserDao userDao;
    private Object orderAmount;

    @Transactional
    public void placeOrder(OrderInput orderInput) {
        List<OrderProductQuantity> productQuantityList = orderInput.getOrderProductQuantityList();

        for (OrderProductQuantity o: productQuantityList) {
            Product product= productDao.findById(o.getProductId()).get();
            String currentUser=JwtRequestFilter.CURRENT_USER;
            User user=userDao.findById(currentUser).get();

            OrderDetail orderDetail= new OrderDetail(
                    orderInput.getFullName(),
                    orderInput.getFullAddress(),
                    orderInput.getContactNumber(),
                    orderInput.getAlternateContactNumber(),
                        ORDER_PLACED,
                        product.getProductDiscountedPrice() * o.getQuantity(),
                        product,
                        user
	    		  );
            orderDetailDao.save(orderDetail);
        }
    }
}