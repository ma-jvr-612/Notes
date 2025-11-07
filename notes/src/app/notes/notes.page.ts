import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { NotesService, Note } from '../services/notes.service';
import { BlueprintSelectorModal } from '../modals/blueprint-selector/blueprint-selector.modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NotesPage implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  searchTerm: string = '';
  private cursorPosition: number = 0;
  isPreviewMode: boolean = false;
  renderedContent: SafeHtml = '';
  previewLines: Array<{ type: 'checkbox' | 'text' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; text?: string; checked?: boolean; lineIndex?: number }> = [];

  constructor(
    private notesService: NotesService,
    private modalController: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadNotes();
  }

  async loadNotes() {
    try {
      this.notes = await this.notesService.getNotes();
      this.filteredNotes = this.notes;
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }

  async createNewNote() {
    try {
      const newNote = await this.notesService.createNote();
      await this.loadNotes();
      this.selectNote(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  selectNote(note: Note) {
    this.selectedNote = { ...note };
  }

  async saveNote() {
    if (this.selectedNote) {
      try {
        await this.notesService.updateNote(this.selectedNote);
        await this.loadNotes();
        this.selectedNote = { ...this.selectedNote };
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  }

  async deleteNote(note: Note) {
    try {
      await this.notesService.deleteNote(note.id);
      await this.loadNotes();
      if (this.selectedNote?.id === note.id) {
        this.selectedNote = null;
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  searchNotes(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.trim() === '') {
      this.filteredNotes = this.notes;
    } else {
      this.filteredNotes = this.notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getPreview(content: string): string {
    return content.substring(0, 60) + (content.length > 60 ? '...' : '');
  }

  async openBlueprintSelector() {
    if (!this.selectedNote) return;

    const modal = await this.modalController.create({
      component: BlueprintSelectorModal,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.blueprint) {
      this.insertBlueprintIntoNote(data.blueprint);
    }
  }

  onContentChange(event: any) {
    // Track cursor position whenever content changes
    const textarea = this.getTextareaElement(event);
    if (textarea) {
      this.cursorPosition = textarea.selectionStart || 0;
    }
  }

  onContentFocus(event: any) {
    // Track cursor position when textarea is focused
    const textarea = this.getTextareaElement(event);
    if (textarea) {
      this.cursorPosition = textarea.selectionStart || 0;
    }
  }

  private getTextareaElement(event: any): HTMLTextAreaElement | null {
    // Try to get textarea from event target
    if (event.target?.tagName === 'TEXTAREA') {
      return event.target as HTMLTextAreaElement;
    }
    // Try to find textarea within the event target
    if (event.target?.querySelector) {
      const textarea = event.target.querySelector('textarea');
      if (textarea) return textarea as HTMLTextAreaElement;
    }
    // Fallback to document query
    return document.querySelector('.note-content textarea') as HTMLTextAreaElement;
  }

  private insertBlueprintIntoNote(blueprint: any) {
    if (!this.selectedNote) return;

    const blueprintContent = blueprint.content;
    const currentContent = this.selectedNote.content || '';

    // Get the textarea element to check cursor position
    const textarea = document.querySelector('.note-content textarea') as HTMLTextAreaElement;
    let insertPosition = this.cursorPosition;

    // If textarea exists and has focus, use its current selection
    if (textarea && document.activeElement === textarea) {
      insertPosition = textarea.selectionStart || 0;
    }

    // If cursor position is valid, insert at that position
    if (insertPosition >= 0 && insertPosition <= currentContent.length) {
      this.selectedNote.content =
        currentContent.substring(0, insertPosition) +
        blueprintContent +
        currentContent.substring(insertPosition);
    } else {
      // Otherwise, append to the end
      this.selectedNote.content = currentContent + blueprintContent;
    }

    this.saveNote();
  }

  togglePreviewMode() {
    this.isPreviewMode = !this.isPreviewMode;
    if (this.isPreviewMode) {
      this.updateRenderedContent();
    }
  }

  updateRenderedContent() {
    if (!this.selectedNote) return;

    const content = this.selectedNote.content || '';
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
          lineIndex: index
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
          lineIndex: index
        });
        return;
      }

      // Regular line
      this.previewLines.push({
        type: 'text',
        text: line || ' '
      });
    });
  }

  onCheckboxToggle(item: any) {
    if (!this.selectedNote || item.lineIndex === undefined) return;

    const lines = (this.selectedNote.content || '').split('\n');
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

      this.selectedNote.content = lines.join('\n');
      this.saveNote();
    }
  }
}
