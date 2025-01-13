import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  template: `
    <div class="overlay">
      <div class="spinner"></div>
    </div>
  `,
  styles: `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(#151619, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #F39765;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
})
export class SpinnerComponent {

}
