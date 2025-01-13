import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownFileService } from '../../services/markdown-file.service';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
})
@Component({
  selector: 'app-mardown',
  imports: [FormsModule, MarkdownModule, MarkdownComponent],
  template: `
    <section class="markdown" [class.sidebar-open]="isSidebarOpen()">
      <!-- Markdown Editor Section -->
      <div
        class="markdown__editor-container"
        [class.hidden]="isPreviewMode()"
        >
        <div class="markdown__header">
          <h2 class="markdown__title">Markdown</h2>
          <button (click)="togglePreviewMode()" class="preview-toggle-mobile">
            <img
              [src]="isPreviewMode() ? 'assets/icon-hide-preview.svg' : 'assets/icon-show-preview.svg'"
              [alt]="isPreviewMode() ? 'Hide Preview' : 'Show Preview'"
              class="markdown__preview-icon"
            />
          </button>
        </div>
        <textarea
          [ngModel]="markdownService.currentFile()?.content"
          (blur)="onContentBlur($event)"
          class="markdown__editor"></textarea>
      </div>
      <!-- Vertical Divider (Visible only on desktop) -->
      @if(!isMobileView()) {<div class="markdown__divider"></div>}
      <!-- Preview Section -->
      <div
        class="markdown__preview-container"
        [class.hidden]="!isPreviewMode() && isMobileView()"
        >
        <div class="markdown__header">
          <h2 class="markdown__title">Preview</h2>
          <button (click)="togglePreviewMode()" class="preview-toggle">
            @if (!isPreviewMode()) {
              <svg width="16" height="12" xmlns="http://www.w3.org/2000/svg" class="markdown__preview-icon">
                <path d="M7.784.003c4.782-.144 7.597 4.31 8.109 5.198a.8.8 0 0 1 0 .8c-.688 1.2-3.255 5.086-7.677 5.198h-.2c-4.71 0-7.405-4.326-7.909-5.198a.8.8 0 0 1 0-.8C.803 4.001 3.362.115 7.784.003Zm.38 1.6h-.3c-3.199.08-5.286 2.71-6.086 3.998C2.482 6.73 4.73 9.68 8.176 9.6c3.199-.08 5.262-2.711 6.086-3.999-.712-1.127-2.967-4.086-6.398-3.998ZM8 2.803A2.799 2.799 0 1 1 8 8.4a2.799 2.799 0 0 1 0-5.598Zm0 1.599A1.2 1.2 0 1 0 8 6.8a1.2 1.2 0 0 0 0-2.4Z" fill="currentColor"/>
              </svg>
            } @else {
              <svg width="16" height="15" xmlns="http://www.w3.org/2000/svg" class="markdown__preview-icon">
                <path d="M1.38.027a.795.795 0 0 1 .769.206L14.815 12.9a.792.792 0 0 1 0 1.124.792.792 0 0 1-1.124 0L9.234 9.567a2.77 2.77 0 0 1-3.753-3.753L1.024 1.357a.795.795 0 0 1 .357-1.33Zm.998 3.832 1.156 1.116a10.846 10.846 0 0 0-1.773 2.153c.696 1.117 2.929 4.038 6.333 3.959a6.127 6.127 0 0 0 1.346-.198l1.25 1.25a7.505 7.505 0 0 1-2.556.53h-.198c-4.663 0-7.331-4.282-7.83-5.145a.792.792 0 0 1 0-.792A12.58 12.58 0 0 1 2.378 3.86Zm5.328-2.272c4.726-.143 7.52 4.267 8.028 5.145.15.24.163.542.031.792a12.58 12.58 0 0 1-2.304 2.874l-1.195-1.116a10.846 10.846 0 0 0 1.813-2.154c-.705-1.116-2.937-4.045-6.333-3.958a6.127 6.127 0 0 0-1.346.198L5.149 2.117a7.505 7.505 0 0 1 2.557-.53Zm-.974 5.486v.055c0 .656.532 1.188 1.188 1.188l.047-.008-1.235-1.235Z" fill="currentColor"/>
              </svg>
            }
          </button>
        </div>
        <markdown
          [data]="markdownService.currentFile()?.content"
          class="markdown__preview">
        </markdown>
      </div>
    </section>
  `,
  styleUrl: './mardown.component.scss'
})
export class MardownComponent {
  isSidebarOpen = input<boolean>(false);
  markdownService = inject(MarkdownFileService);

  isPreviewMode = signal<boolean>(false);
  isMobileView = signal<boolean>(false);
  currentMarkdownFile = this.markdownService.currentFile;

  togglePreviewMode() {
    this.isPreviewMode.update((isPreviewMode) => !isPreviewMode);
  }

  constructor() {
    this.detectScreenSize();
  }

  detectScreenSize() {
    this.isMobileView.update(() => window.innerWidth < 768);
    window.addEventListener('resize', () => {
      this.isMobileView.update(() => window.innerWidth < 768);
    });
  }

  onContentBlur(event: FocusEvent) {
    const target = event.target as HTMLTextAreaElement;
    const newContent = target.value;
    const currentFile = this.markdownService.currentFile();
    if (currentFile) {
      this.markdownService.updateMarkdownFile(currentFile.id,  { content: newContent });
    }
  }
}
