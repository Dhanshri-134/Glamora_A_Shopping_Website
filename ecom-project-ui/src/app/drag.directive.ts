import { Directive, HostListener, ElementRef, HostBinding, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandle } from './_model/file-handle.model'; 

@Directive({
  selector: '[appDrag]'
})
export class DragDirective {

  @Output() files: EventEmitter<FileHandle> = new EventEmitter(); 

  @HostBinding("style.background") private background = "#eee";

  constructor(private sanitizer: DomSanitizer, private el: ElementRef) { }

  
  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.preventDefault();  
    event.stopPropagation();
    this.background = '#999'; 
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = "#eee"; 
  }

  
  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.setBackground('#eee');

    // const files = event.dataTransfer?.files;
    const file = event.dataTransfer.files[0];
    const fileUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));

    const fileHandle: FileHandle = { file, url: fileUrl }; 

    this.files.emit(fileHandle); 
  
  }

  private setBackground(color: string): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
