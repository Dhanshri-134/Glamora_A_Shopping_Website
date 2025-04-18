package com.project.eccom.dao;
import com.project.eccom.entity.OrderDetail;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface OrderDetailDao extends CrudRepository<OrderDetail,Integer> {

}