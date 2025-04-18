import { TestBed } from '@angular/core/testing';

import { ImageProcesingService } from './image-processing.service';

describe('ImageProcesingService', () => {
  let service: ImageProcesingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageProcesingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
