import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { map } from 'rxjs/operators';
import { Product } from '../_model/product.model';
import { ImageProcessingService } from '../image-processing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pageNumber:number=0;
  showLoadButton=false;
  productDetails: Product[] = []; 
  dataSource: Product[] = [];  

  constructor(private productService: ProductService,
              private imageProcessingService: ImageProcessingService,
            private router:Router) { }

  ngOnInit(): void {
    this.getAllProducts();  
  }

  public getAllProducts(): void {
    this.productService.getAllProducts(this.pageNumber)
      .pipe(
        map((products: Product[]) => products.map((product: Product) => 
          this.imageProcessingService.createImages(product)))  
      )  
      .subscribe(
        (resp: Product[]) => {
          console.log('Products:', resp);
          if(resp.length==12)
            {
              this.showLoadButton=true;
            }
            else{
              this.showLoadButton=false;
            }
            resp.forEach(p=>this.productDetails.push(p));
          // this.productDetails = resp;  
          this.dataSource = this.productDetails;  
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching products:', error); 
        }
      );
  }
  showProductDetails(productId){
    this.router.navigate(['/productViewDetails'], { queryParams: { productId: productId } });
  }
  public loadMoreProduct()
  {
    this.pageNumber=this.pageNumber + 1;
    this.getAllProducts();
  }
}
