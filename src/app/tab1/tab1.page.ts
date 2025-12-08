import { Component, Input } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, 
  IonIcon, IonInput, IonButton, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonImg 
} from '@ionic/angular/standalone';

import { ExternalApiServiceService } from '../services/api-external.service';
import { ExternalApiResponse } from '../services/api-response';
import { search, star } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { FavouriteService, SavedFavourites } from '../services/favourite.service';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonImg, IonCardContent, IonCard, FormsModule, IonButton,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonInput, IonItem, IonLabel, IonIcon
  ],
})
export class Tab1Page {

  numObject?: ExternalApiResponse | null = null;
  @Input() name = '';
  teamName?: string;
  showDetail = false;

  constructor(
    private apiService: ExternalApiServiceService,
    public favouriteService: FavouriteService,
    private router: Router
  ) {
    addIcons({ star, search });
  }

  toggleDetails() {
    this.showDetail = !this.showDetail;
  }

  async onGetInfo() {
    if (this.name.trim().length === 0) {
      alert('Zadejte název týmu');
      return;
    }

    this.numObject = await this.apiService.getInfo(this.name);

    if (!this.numObject?.teams) {
      alert('Tým s názvem ' + this.name + ' nenalezen');
      return;
    }

    console.log('Nalezen tým:', this.numObject.teams[0].strTeam);
  }

  async onSave() {
    if (this.name.trim().length === 0) {
      alert('Zadejte název týmu');
      return;
    }

    const favourite: SavedFavourites = { 
      name: this.name, 
      uuid: crypto.randomUUID() 
    };

    await this.favouriteService.add(favourite);
    this.name = '';
  }

  ionViewWillEnter() {
    this.router.routerState.root.queryParamMap.subscribe(params => {
      this.teamName = params.get('name') || undefined;
      this.name = this.teamName || '';

      if (this.name) {
        this.onGetInfo();
      }
    });
  }
}
