import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import{Product} from '../_model/product.model';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../../app/image-processing.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.css']
})
export class ProductViewDetailsComponent implements OnInit {

  selectedProductIndex=0;
  product:Product;
  constructor(private activatedRoute:ActivatedRoute,
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService,
    private router:Router  ) { }

  ngOnInit(): void {
    // this.product = this.activatedRoute.snapshot.data['product'];
    this.activatedRoute.queryParamMap.subscribe(params => {
      const productId = params.get('productId');
      if (productId) {

        this.productService.getProductDetailsById(+productId).subscribe(
          (res: Product) => {
        //     this.product = res;
        //     console.log("Product loaded:", this.product);
              const processedProduct = this.imageProcessingService.createImages(res);
              this.product = processedProduct;

              console.log("Processed product:", this.product);
          },
          (err) => {
            console.error("Error loading product", err);
          }
        );
      }
    });
    console.log(this.product);
  }
  
  changeIndex(index)
  {
    this.selectedProductIndex=index;
  }
  buyProduct(productId){
    this.router.navigate(['/buyProduct', {
      isSingleProductCheckout: true, id: productId
    }]);
  }
}
