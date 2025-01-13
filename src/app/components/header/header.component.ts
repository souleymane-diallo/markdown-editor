import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { MarkdownFileService } from '../../services/markdown-file.service';
import { FormsModule } from '@angular/forms';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import {Dialog, DialogModule} from '@angular/cdk/dialog';

@Component({
  selector: 'app-header',
  imports: [FormsModule, DialogModule],
  template: `
    <header class="markdown-header" [class.sidebar-open]="isSidebarOpen()">
      <nav class="markdown-header__nav">
        <ul class="markdown-header__nav-item">
          <li class="markdown-header__nav-list">
            <button class="markdown-header__burger-menu" (click)="toggleSidebar()">
              @if (!isSidebarOpen()) {
                <img src="assets/icon-menu.svg" alt="Menu Icon" />
              } @else {
                <img src="assets/icon-close.svg" alt="Fermer Sidebar" />
              }
            </button>
            <img src="assets/logo.svg" alt="Logo" class="markdown-header__logo-desktop" />
            <div class="markdown-header__separator"></div>
            <div class="markdown-header__name-file">
              <img src="assets/icon-document.svg" alt="Document Icon" />
              <div class="markdown-header__content-doc">
                <span class="markdown-header__label">Document Name</span>
                <input type="text"
                  [ngModel]="currentFile()?.name"
                  #nameInput
                  class="markdown-header__input"
                />
              </div>
            </div>
          </li>
          <li class="markdown-header__nav-list">
            <button class="markdown-header__button-delete" (click)="openDialogDelete()">
              <svg width="18" height="20" xmlns="http://www.w3.org/2000/svg" class="markdown-header__delete-svg">
                <path d="M7 16a1 1 0 0 0 1-1V9a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM17 4h-4V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H1a1 1 0 1 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6h1a1 1 0 0 0 0-2ZM7 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1H7V3Zm7 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6h10v11Zm-3-1a1 1 0 0 0 1-1V9a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z" fill="currentColor"/>
              </svg>
            </button>
            <button class="markdown-header__button-save" (click)="onSaveDocument()">
              <img src="assets/icon-save.svg" alt="Save Icon" />
              <span class="markdown-header__text-button">Save Changes</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @ViewChild('nameInput') nameInput!: ElementRef;
  markdownService = inject(MarkdownFileService);
  readonly dialog = inject(Dialog);
  sidebarToggle = output();
  isSidebarOpen = input(false);
  currentFile = this.markdownService.currentFile;

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  openDialogDelete() {
    this.dialog.open(ModalDeleteComponent);
  }

  onSaveDocument() {
    const currentFile = this.currentFile();
    if (currentFile) {
      const updatedName = this.nameInput.nativeElement.value;
      const updatedContent = currentFile.content;
      this.markdownService.updateMarkdownFile(currentFile.id, {
        name: updatedName,
        content: updatedContent
      });
    }
  }
}
