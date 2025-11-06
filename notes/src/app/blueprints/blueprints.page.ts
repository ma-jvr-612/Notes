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

  loadBlueprints() {
    this.blueprints = this.blueprintsService.getBlueprints();
    this.filteredBlueprints = this.blueprints;
  }

  createNewBlueprint() {
    const newBlueprint = this.blueprintsService.createBlueprint();
    this.loadBlueprints();
    this.selectBlueprint(newBlueprint);
  }

  selectBlueprint(blueprint: Blueprint) {
    this.selectedBlueprint = { ...blueprint };
  }

  saveBlueprint() {
    if (this.selectedBlueprint) {
      this.blueprintsService.updateBlueprint(this.selectedBlueprint);
      this.loadBlueprints();
      this.selectedBlueprint = { ...this.selectedBlueprint };
    }
  }

  deleteBlueprint(blueprint: Blueprint) {
    this.blueprintsService.deleteBlueprint(blueprint.id);
    this.loadBlueprints();
    if (this.selectedBlueprint?.id === blueprint.id) {
      this.selectedBlueprint = null;
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
}
