import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { MardownComponent } from './components/mardown/mardown.component';
import { MarkdownFileService } from './services/markdown-file.service';
import { MarkdownModule } from 'ngx-markdown';
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { toggleTheme } from './logic/markdown-helpers';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    SidebarComponent,
    MardownComponent,
    SpinnerComponent,
  ],
  template: `
    <app-header (sidebarToggle)="toggleSidebar()" [isSidebarOpen]="isSidebarOpen()"></app-header>
    <app-sidebar
      [isOpen]="isSidebarOpen()"
      (sidebarClose)="closeSidebar()"
      ></app-sidebar>
    <main>
      @if (isLoading()) {
        <app-spinner></app-spinner>
      }
      <app-mardown [isSidebarOpen]="isSidebarOpen()"></app-mardown>
    </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isSidebarOpen = signal<boolean>(false);
  isPreviewMode = signal<boolean>(false);

  markdownService = inject(MarkdownFileService);
  isLoading = this.markdownService.isLoading;

  toggleSidebar() {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  closeSidebar() {
    this.isSidebarOpen.update(() => false);
  }
}
