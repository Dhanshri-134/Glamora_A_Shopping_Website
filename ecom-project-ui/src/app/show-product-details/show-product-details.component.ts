import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from "../_model/product.model"; 
import { ProductService } from '../_services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { ImageProcessingService } from '../image-processing.service'; 
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css']
})
export class ShowProductDetailsComponent implements OnInit {
  showLoadButton = false;
  showTable = false;
  pageNumber: number = 0;
  productDetails: Product[] = [];
  dataSource: Product[] = []; 
  displayedColumns: string[] = ['productId', 'productName', 'productDescription', 'productDiscountedPrice', 'productActualPrice','Images','Actions'];

  constructor(
    private productService: ProductService,
    public imagesDialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProduct();  
  }

  public getAllProduct() {
    this.showTable = false;
    this.productService.getAllProducts(this.pageNumber)
    .pipe(
      map((x : Product[],i) => x.map((product: Product) => this.imageProcessingService.createImages(product)))
    )
    .subscribe(
      (resp: Product[]) => {
        console.log('API Response:', resp);
        // this.productDetails = resp;
        resp.forEach(p => this.productDetails.push(p));
        this.showTable = true;
        if(resp.length == 12) {
          this.showLoadButton = true;
        }
        else {
          this.showLoadButton = false;
        }
        this.dataSource = this.productDetails;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching products:', error);
      }
    );
    
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      (resp) => {
        this.getAllProduct();
      },
      (error: HttpErrorResponse) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  showImages(product: Product): void {
    if (product.productImages && product.productImages.length > 0) {
      this.imagesDialog.open(ShowProductImagesDialogComponent, {
        data: {
          images: product.productImages
        },
        height: '500px',
        width: '800px'
      });
    } else {
      console.warn('No images available for this product.');
    }
  }

  editProductDetails(productId: number): void {
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }

  loadMoreProduct(){
    this.pageNumber = this.pageNumber + 1;
    this.getAllProduct();
  }
}