import { Injectable } from '@angular/core';
import { Product } from './_model/product.model';
import { FileHandle } from './_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  constructor(private sanitizer: DomSanitizer) { }

  public createImages(product: Product): Product {
    const productImages: any[] = product.productImages || [];  
    const productImagesToFileHandle: FileHandle[] = [];
    
    if (productImages.length === 0) {
      return product;
    }

    for (let i = 0; i < productImages.length; i++) {
      const imageFileData = productImages[i];

      if (imageFileData && imageFileData.picByte && imageFileData.type && imageFileData.name){
        const imageBlob = this.dataURItoBlob(imageFileData.picByte, imageFileData.type);

        // const imageBlob = this.dataURItoBlob(imageFileData.picBytes, imageFileData.type);
        const imageFile = new File([imageBlob], imageFileData.name, { type: imageFileData.type });

        const finalFileHandle: FileHandle = {
          file: imageFile,
          url: this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
        };

        productImagesToFileHandle.push(finalFileHandle);
      } else {
        console.error(`Invalid image data at index ${i}`, imageFileData);
      }
    }
    product.productImages= productImagesToFileHandle;
    return product;
    // return {
    //   ...product,  
    //   productImages: productImagesToFileHandle  
    // };
  }

  
  public dataURItoBlob(picBytes: string, imageType: string): Blob {
    const byteString = window.atob(picBytes);  // Decode base64 to binary string
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);


    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: imageType });
    return blob;
  }
}
