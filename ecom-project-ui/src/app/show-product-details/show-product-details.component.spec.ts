import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowProductDetailsComponent } from './show-product-details.component';
import { ProductService } from '../_services/product.service';
import { ImageProcessingService } from '../image-processing.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ShowProductDetailsComponent', () => {
  let component: ShowProductDetailsComponent;
  let fixture: ComponentFixture<ShowProductDetailsComponent>;

  // Create mock services
  const productServiceMock = {
    getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of([])), // Mock an empty response
    deleteProduct: jasmine.createSpy('deleteProduct')
  };

  const imageProcessingServiceMock = {
    createImages: jasmine.createSpy('createImages').and.callFake(product => product)
  };

  const matDialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of({})
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowProductDetailsComponent ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: ImageProcessingService, useValue: imageProcessingServiceMock },
        { provide: MatDialog, useValue: matDialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA] // To ignore unknown elements (like mat-table, mat-icon)
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllProducts on ngOnInit', () => {
    component.ngOnInit();
    expect(productServiceMock.getAllProducts).toHaveBeenCalled();
  });

  it('should open the images dialog when showImages is called', () => {
    // const mockProduct = { productImages: [] }; 
    const mockProduct = { productId: 2,
      productName: 'No Image Product',
      productDescription: 'Product with no image',
      productDiscountedPrice: 80,
      productActualPrice: 100,
      productImages: [] }; // Mock product object
    component.showImages(mockProduct);
    expect(matDialogMock.open).toHaveBeenCalled();
  });

  it('should call deleteProduct when deleteProduct is called', () => {
    const mockProductId = 1;
    component.deleteProduct(mockProductId);
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(mockProductId);
  });
});
