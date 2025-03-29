import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-center-modal',
  imports: [
    NgIf
  ],
  templateUrl: './center-modal.component.html',
  standalone: true,
  styleUrl: './center-modal.component.css'
})
export class CenterModalComponent {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>(); // Emit event when closing

  close() {
    this.isOpen = false;
    this.closed.emit(); // Notify parent component
  }

  show() {
    this.isOpen = true;
  }

}
