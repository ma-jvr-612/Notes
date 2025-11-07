import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { BlueprintsService, Blueprint } from '../../services/blueprints.service';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-blueprint-selector',
  templateUrl: './blueprint-selector.modal.html',
  styleUrls: ['./blueprint-selector.modal.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
  ],
})
export class BlueprintSelectorModal implements OnInit {
  blueprints: Blueprint[] = [];

  constructor(
    private modalController: ModalController,
    private blueprintsService: BlueprintsService
  ) {
    addIcons({ close });
  }

  async ngOnInit() {
    try {
      this.blueprints = await this.blueprintsService.getAllBlueprints();
    } catch (error) {
      console.error('Error loading blueprints:', error);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  selectBlueprint(blueprint: Blueprint) {
    this.modalController.dismiss({
      blueprint: blueprint,
    });
  }

  getPreview(content: string): string {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  }
}
