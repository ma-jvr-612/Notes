import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BlueprintsService, Blueprint } from '../services/blueprints.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blueprints',
  templateUrl: './blueprints.page.html',
  styleUrls: ['./blueprints.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BlueprintsPage implements OnInit {
  blueprints: Blueprint[] = [];
  filteredBlueprints: Blueprint[] = [];
  selectedBlueprint: Blueprint | null = null;
  searchTerm: string = '';
  isPreviewMode: boolean = false;
  renderedContent: SafeHtml = '';
  previewLines: Array<{ type: 'checkbox' | 'text' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; text?: string; checked?: boolean; lineIndex?: number }> = [];

  constructor(
    private blueprintsService: BlueprintsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadBlueprints();
  }

  async loadBlueprints() {
    try {
      this.blueprints = await this.blueprintsService.getBlueprints();
      this.filteredBlueprints = this.blueprints;
    } catch (error) {
      console.error('Error loading blueprints:', error);
    }
  }

  async createNewBlueprint() {
    try {
      const newBlueprint = await this.blueprintsService.createBlueprint();
      await this.loadBlueprints();
      this.selectBlueprint(newBlueprint);
    } catch (error) {
      console.error('Error creating blueprint:', error);
    }
  }

  selectBlueprint(blueprint: Blueprint) {
    this.selectedBlueprint = { ...blueprint };
  }

  goBackToList() {
    this.selectedBlueprint = null;
  }

  async saveBlueprint() {
    if (this.selectedBlueprint) {
      try {
        await this.blueprintsService.updateBlueprint(this.selectedBlueprint);
        await this.loadBlueprints();
        this.selectedBlueprint = { ...this.selectedBlueprint };
      } catch (error) {
        console.error('Error saving blueprint:', error);
      }
    }
  }

  async deleteBlueprint(blueprint: Blueprint) {
    try {
      await this.blueprintsService.deleteBlueprint(blueprint.id);
      await this.loadBlueprints();
      if (this.selectedBlueprint?.id === blueprint.id) {
        this.selectedBlueprint = null;
      }
    } catch (error) {
      console.error('Error deleting blueprint:', error);
    }
  }

  searchBlueprints(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.trim() === '') {
      this.filteredBlueprints = this.blueprints;
    } else {
      this.filteredBlueprints = this.blueprints.filter(blueprint =>
        blueprint.title.toLowerCase().includes(query) ||
        blueprint.content.toLowerCase().includes(query)
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

  togglePreviewMode() {
    this.isPreviewMode = !this.isPreviewMode;
    if (this.isPreviewMode) {
      this.updateRenderedContent();
    }
  }

  updateRenderedContent() {
    if (!this.selectedBlueprint) return;

    const content = this.selectedBlueprint.content || '';
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
    if (!this.selectedBlueprint || item.lineIndex === undefined) return;

    const lines = (this.selectedBlueprint.content || '').split('\n');
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

      this.selectedBlueprint.content = lines.join('\n');
      this.saveBlueprint();
    }
  }

  onTextareaKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || !this.selectedBlueprint) return;

    // Get the native textarea element
    const ionTextarea = event.target as any;
    const textarea = ionTextarea.getInputElement ? ionTextarea.getInputElement() : Promise.resolve(event.target);

    textarea.then((nativeTextarea: HTMLTextAreaElement) => {
      const cursorPos = nativeTextarea.selectionStart;
      const content = this.selectedBlueprint!.content || '';

      // Find the current line
      const beforeCursor = content.substring(0, cursorPos);
      const afterCursor = content.substring(cursorPos);
      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
      const currentLineEnd = afterCursor.indexOf('\n');
      const nextLineStart = currentLineEnd === -1 ? content.length : cursorPos + currentLineEnd;
      const currentLine = content.substring(currentLineStart, cursorPos) +
                         (currentLineEnd === -1 ? afterCursor : afterCursor.substring(0, currentLineEnd));

      // Check if current line is a checkbox
      const checkboxMatch = currentLine.match(/^- \[ \] (.*)$/);

      if (checkboxMatch) {
        event.preventDefault();

        const textAfterCheckbox = checkboxMatch[1];

        if (textAfterCheckbox.trim() === '') {
          // Empty checkbox - remove it
          const newContent = content.substring(0, currentLineStart) +
                            content.substring(nextLineStart);
          this.selectedBlueprint!.content = newContent;

          // Set cursor position after removal
          setTimeout(() => {
            nativeTextarea.setSelectionRange(currentLineStart, currentLineStart);
          }, 10);
        } else {
          // Has text - create new checkbox on next line
          const cursorPosInLine = cursorPos - currentLineStart;
          const textBeforeCursor = currentLine.substring(0, cursorPosInLine);
          const textAfterCursorInLine = currentLine.substring(cursorPosInLine);

          const newContent = content.substring(0, currentLineStart) +
                            textBeforeCursor + '\n- [ ] ' +
                            textAfterCursorInLine +
                            content.substring(nextLineStart);

          this.selectedBlueprint!.content = newContent;

          // Set cursor position after the new checkbox marker
          const newCursorPos = currentLineStart + textBeforeCursor.length + 7; // +7 for "\n- [ ] "
          setTimeout(() => {
            nativeTextarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 10);
        }

        this.saveBlueprint();
      }
    });
  }
}
