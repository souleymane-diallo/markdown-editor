import { Component, input, signal } from '@angular/core';
import { MarkdownFile } from '../../models/markdown-file.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-document-item',
  imports: [DatePipe],
  template: `
    <div class="document-item">
      <img src="assets/icon-document.svg" alt="Document icon" />
      <div class="document-item__info">
        <span class="document-item__date">{{ file().createdAt | date }}</span>
        <span class="document-item__text-file">{{ file().name }}</span>
      </div>
    </div>
  `,
  styles: `
    .document-item {
      display: flex;
      align-items: center;
      gap: 1rem;

      &__info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      &__date {
        font-size: 0.75rem;
        color: #7C8187;
      }

      &__text-file {
        transition: color .3s ease;
        &:hover {
          color: #E46643;
        }
      }
    }
  `
})
export class DocumentItemComponent {
  file = input.required<MarkdownFile>();
}
