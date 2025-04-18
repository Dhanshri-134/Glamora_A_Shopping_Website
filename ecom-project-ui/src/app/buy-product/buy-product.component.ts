import { Component, OnInit } from '@angular/core';
import { OrderDetails } from '../_model/order-details.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {
  productDetails: Product[] = [];
  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    orderProductQuantityList: []
  };
  productTotalMap: { [productId: number]: number } = {};
  grandTotal = 0;

  constructor(
    private activateRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productDetails = this.activateRoute.snapshot.data['productDetails'];

    this.productDetails.forEach(product => {
      this.orderDetails.orderProductQuantityList.push({
        productId: product.productId,
        quantity: 1
      });
      this.productTotalMap[product.productId] = product.productDiscountedPrice;
    });

    this.calculateGrandTotal();
  }

  placeOrder(orderForm: NgForm): void {
    this.productService.placeOrder(this.orderDetails).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();
        this.router.navigate(['/orderConfirm']);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onQuantityChanged(value: string, productId: number): void {
    const quantity = +value;
    const orderProduct = this.orderDetails.orderProductQuantityList.find(
      item => item.productId === productId
    );

    if (orderProduct) {
      orderProduct.quantity = quantity;
    }

    const product = this.productDetails.find(p => p.productId === productId);
    if (product) {
      this.productTotalMap[productId] = quantity * product.productDiscountedPrice;
    }

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    this.grandTotal = 0;
    for (let productId in this.productTotalMap) {
      this.grandTotal += this.productTotalMap[productId];
    }
  }
}
