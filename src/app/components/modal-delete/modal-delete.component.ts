import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';
import { MarkdownFileService } from '../../services/markdown-file.service';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  template: `
    <div class="modal-delete">
      <h2 class="modal-delete__title">Delete this document?</h2>
      <p class="modal-delete__content">
        Are you sure you want to delete the <span class="document-name">"{{ currentFile()?.name }}"</span> document and its contents? <br />
        This action cannot be reversed.
      </p>
      <button class="modal-delete__action" (click)="onConfirmDelete()">Confirm & Delete</button>
    </div>
  `,
  styleUrl: './modal-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ModalDeleteComponent {
  markdownService = inject(MarkdownFileService);
  currentFile = this.markdownService.currentFile;
  dialogRef = inject(DialogRef);

  onConfirmDelete() {
    const id = this.currentFile()?.id;
    if (id) {
     this.markdownService.deleteMarkdownFile(id);
     this.dialogRef.close();
    }
  }
}
