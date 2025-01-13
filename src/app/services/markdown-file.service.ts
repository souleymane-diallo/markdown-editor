import { Injectable, signal, computed } from '@angular/core';
import {
  MarkdownFile,
  MarkdownFileState,
  markdownFiles as initialMarkdownFiles,
} from '../models/markdown-file.model';
import { Observable, of, Subject, tap, switchMap, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkdownFileService {
  // Initial State
  private state = signal<MarkdownFileState>({
    isLoading: false,
    markdownFiles: this.loadInitialData(),
    currentFile: null,
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  markdownFiles = computed(() => this.state().markdownFiles);
  currentFile = computed(() => this.state().currentFile);

  private selectedIdSubject = new Subject<string | null>();

  constructor() {
    // Gérer la sélection des fichiers
    this.selectedIdSubject
      .pipe(
        tap(() => this.setLoadingIndicator(true)),
        switchMap(id => {
          if (!id) {
            this.updateState({ currentFile: null });
            return this.getMarkdownFiles();
          }
          return this.getMarkdownFile(id);
        }),
        delay(1000) // Simulate loading delay
      )
      .subscribe(result => {
        if (Array.isArray(result)) {
          this.setMarkdownFiles(result);
        } else {
          // Mettre à jour explicitement currentFile dans l'état
          this.updateState({
            currentFile: result,
            isLoading: false
          });
        }
      });
    const files = this.loadInitialData();
    if (files.length > 0) {
      this.selectMarkdownFile(files[0].id);
    }
  }

  // Charger tous les fichiers
  private getMarkdownFiles(): Observable<MarkdownFile[]> {
    return of(this.state().markdownFiles);
  }

  // Charger un fichier spécifique
  private getMarkdownFile(id: string): Observable<MarkdownFile> {
    const file = this.state().markdownFiles.find(file => file.id === id);
    if (!file) {
      throw new Error(`File with id ${id} not found`);
    }
    return of(file);
  }

  // Actions
  selectMarkdownFile(id: string) {
    this.selectedIdSubject.next(id);
  }

  addMarkdownFile() {
    const newFile: MarkdownFile = {
      id: crypto.randomUUID(),
      name: 'untitled-document.md',
      content: '',
      createdAt: new Date().toISOString(),
    };
    this.updateState({
      markdownFiles: [...this.state().markdownFiles, newFile],
    });
    this.saveToLocalStorage();
    this.selectMarkdownFile(newFile.id);
  }

  updateMarkdownFile(id: string, changes: Partial<MarkdownFile>) {
    this.setLoadingIndicator(true);
    const updatedFiles = this.state().markdownFiles.map(file =>
      file.id === id ? { ...file, ...changes } : file
    );

    // Mettre à jour à la fois markdownFiles et currentFile si nécessaire
    this.updateState({
      markdownFiles: updatedFiles,
      currentFile: id === this.state().currentFile?.id
        ? { ...this.state().currentFile, ...changes } as MarkdownFile
        : this.state().currentFile,
    });
    this.saveToLocalStorage();

    setTimeout(() => {
      this.setLoadingIndicator(false);
    }, 1000);
  }

  deleteMarkdownFile(id: string) {
    const files = this.state().markdownFiles.filter(file => file.id !== id);
    const isCurrentFileDeleted = this.state().currentFile?.id === id;

    this.updateState({
      markdownFiles: files,
      currentFile: isCurrentFileDeleted ? null : this.state().currentFile,
    });
    this.saveToLocalStorage();
    if (files.length > 0) {
      this.selectMarkdownFile(files[0].id);
    }
  }

  // Mise à jour de l'état
  private updateState(changes: Partial<MarkdownFileState>) {
    this.state.update(state => ({ ...state, ...changes }));
  }

  // Gestion des données initiales et LocalStorage
  private loadInitialData(): MarkdownFile[] {
    const savedFiles = localStorage.getItem('markdownFiles');
    return savedFiles ? JSON.parse(savedFiles) : initialMarkdownFiles;
  }

  private saveToLocalStorage() {
    localStorage.setItem(
      'markdownFiles',
      JSON.stringify(this.state().markdownFiles)
    );
  }

  private setLoadingIndicator(isLoading: boolean) {
    this.updateState({ isLoading });
  }

  private setMarkdownFiles(files: MarkdownFile[]) {
    this.updateState({ markdownFiles: files, isLoading: false });
  }
}
