package com.cfs.order_service.controller;

import com.cfs.order_service.config.UserClient;
import com.cfs.order_service.dto.OrderResponse;
import com.cfs.order_service.dto.User;
import com.cfs.order_service.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private UserClient userClient;

    private List<Order> orderList = Arrays.asList(
            new Order(1L, 1L, "washing machine", 54000.00),
            new Order(2L, 2L, " Macbook M5", 354000.00),
            new Order(3L, 3L, "HeadPhones", 5400.00),
            new Order(4L, 4L, "phone iphone", 154000.00)
    );

    @GetMapping
    public List<Order> getAllOrders() {
        return orderList;
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderList.stream()
                .filter(order -> order.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    // getOrder with user details
    @GetMapping("/{id}/with-user")
    public OrderResponse getOrderWithUser(@PathVariable Long id) {

        Order order = getOrderById(id);

        if (order == null) {
            return null;
        }

        User user = userClient.getUserById(order.getUserId());
        return new OrderResponse(order, user);
    }
}