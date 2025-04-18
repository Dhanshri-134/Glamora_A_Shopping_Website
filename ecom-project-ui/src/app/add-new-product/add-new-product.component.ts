import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { DomSanitizer } from "@angular/platform-browser";
import { FileHandle } from "../_model/file-handle.model";
import { Product } from "../_model/product.model";
import { ProductService } from "../_services/product.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent implements OnInit {
  isNewProduct = true;

  product: Product = {
    productId:null,
    productName: '',
    productDescription: '',
    productDiscountedPrice: 0,
    productActualPrice: 0,
    productImages: [] 
  };

  constructor(
    private productService: ProductService,
    private sanitizer:DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];

    if(this.product && this.product.productId){
      this.isNewProduct = false;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const fileHandle: FileHandle = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file))


        };
        this.product.productImages.push(fileHandle);
      }
    }
  }
  removeImages(index: number) {
    this.product.productImages.splice(index, 1);
  }
  addProduct(productForm: NgForm) {
    const productFormData=this.prepareFormData(this.product);
    this.productService.addProduct(productFormData).subscribe(
      (response: Product) => {
        console.log(response);
        productForm.resetForm();
        this.product.productImages=[];
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
  prepareFormData(product:Product):FormData{
    const formData=new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(product)],{type:'application/json'})
    );
    for(var i=0;i<product.productImages.length;i++){
      formData.append(
        'imageFile',
        product.productImages[i].file,
        product.productImages[i].file.name

      );
    }
    return formData;
  }
  fileDropped(fileHandle:FileHandle)
  {
    this.product.productImages.push(fileHandle);
  }
}