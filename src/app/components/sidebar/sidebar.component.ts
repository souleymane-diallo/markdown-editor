import { Component, inject, input, output, signal } from '@angular/core';
import { DocumentItemComponent } from "../document-item/document-item.component";
import { FormsModule } from '@angular/forms';
import { MarkdownFileService } from '../../services/markdown-file.service';
import { toggleTheme } from '../../logic/markdown-helpers';
@Component({
  selector: 'app-sidebar',
  imports: [DocumentItemComponent, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  markdownService = inject(MarkdownFileService);

  isOpen = input<boolean>(false);
  isLoading = this.markdownService.isLoading;
  markdownFiles = this.markdownService.markdownFiles
  sidebarClose = output();
  readonly isDarkTheme = signal<boolean>(false);

  isToggled = signal<boolean>(true);

  closeSidebar() {
    this.sidebarClose.emit();
  }

  addNewDocument() {
    this.markdownService.addMarkdownFile();
  }

  selectFile(id: string) {
    this.markdownService.selectMarkdownFile(id);
  }

  onSwitchTheme() {
    const newValue = !this.isDarkTheme();
    console.log("newValue", newValue);
    this.isDarkTheme.set(newValue);
    toggleTheme(newValue);
  }
}
