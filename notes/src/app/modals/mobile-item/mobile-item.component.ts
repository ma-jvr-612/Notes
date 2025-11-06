import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService, Note } from 'src/app/services/notes.service';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mobile-item',
  templateUrl: './mobile-item.component.html',
  styleUrls: ['./mobile-item.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MobileItemComponent implements OnInit {
  @Input() note: Note | undefined;
  previewLines: Array<{
    type: 'checkbox' | 'text' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    text?: string;
    checked?: boolean;
    lineIndex?: number;
  }> = [];

  constructor(
    private notesService: NotesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.updateRenderedContent();
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onCheckboxToggle(item: any) {
    if (!this.note || item.lineIndex === undefined) return;

    const lines = (this.note.content || '').split('\n');
    const lineIndex = item.lineIndex;

    if (lineIndex < lines.length) {
      const line = lines[lineIndex];

      if (item.checked) {
        // Change from unchecked to checked
        lines[lineIndex] = line.replace(/^- \[ \]/, '- [x]');
      } else {
        // Change from checked to unchecked
        lines[lineIndex] = line.replace(/^- \[x\]/i, '- [ ]');
      }

      this.note.content = lines.join('\n');
      this.saveNote();
    }
  }

  saveNote() {
    if (this.note) {
      this.notesService.updateNote(this.note);
      this.note = { ...this.note };
    }
  }

  updateRenderedContent() {
    if (!this.note) return;

    const content = this.note.content || '';
    const lines = content.split('\n');
    this.previewLines = [];

    lines.forEach((line, index) => {
      // Check for headers (# to ######)
      const h6Match = line.match(/^###### (.+)$/);
      if (h6Match) {
        this.previewLines.push({ type: 'h6', text: h6Match[1] });
        return;
      }

      const h5Match = line.match(/^##### (.+)$/);
      if (h5Match) {
        this.previewLines.push({ type: 'h5', text: h5Match[1] });
        return;
      }

      const h4Match = line.match(/^#### (.+)$/);
      if (h4Match) {
        this.previewLines.push({ type: 'h4', text: h4Match[1] });
        return;
      }

      const h3Match = line.match(/^### (.+)$/);
      if (h3Match) {
        this.previewLines.push({ type: 'h3', text: h3Match[1] });
        return;
      }

      const h2Match = line.match(/^## (.+)$/);
      if (h2Match) {
        this.previewLines.push({ type: 'h2', text: h2Match[1] });
        return;
      }

      const h1Match = line.match(/^# (.+)$/);
      if (h1Match) {
        this.previewLines.push({ type: 'h1', text: h1Match[1] });
        return;
      }

      // Check for unchecked checkbox
      const uncheckedMatch = line.match(/^- \[ \] (.+)$/);
      if (uncheckedMatch) {
        this.previewLines.push({
          type: 'checkbox',
          text: uncheckedMatch[1],
          checked: false,
          lineIndex: index,
        });
        return;
      }

      // Check for checked checkbox
      const checkedMatch = line.match(/^- \[x\] (.+)$/i);
      if (checkedMatch) {
        this.previewLines.push({
          type: 'checkbox',
          text: checkedMatch[1],
          checked: true,
          lineIndex: index,
        });
        return;
      }

      // Regular line
      this.previewLines.push({
        type: 'text',
        text: line || ' ',
      });
    });
  }
}
