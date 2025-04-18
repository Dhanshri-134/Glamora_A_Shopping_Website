import { DragDirective } from './drag.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock component for testing the directive in a real DOM context
@Component({
  template: `<div appDrag></div>`,
})
class TestComponent {}

describe('DragDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    // Provide a mock or actual DomSanitizer
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);

    TestBed.configureTestingModule({
      declarations: [DragDirective, TestComponent],
      providers: [
        { provide: DomSanitizer, useValue: sanitizer }, // Mock DomSanitizer
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore any other errors related to child components
    });

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.query(By.css('div')).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance of the directive', () => {
    const directive = new DragDirective(sanitizer, new ElementRef(element)); // Provide both sanitizer and elementRef
    expect(directive).toBeTruthy();
  });

  // Other tests for functionality can go here
});
