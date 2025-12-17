import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, 
  IonIcon, IonInput, IonButton, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonImg 
} from '@ionic/angular/standalone';

import { ExternalApiServiceService } from '../services/api-external.service';
import { ExternalApiResponse, Team } from '../services/api-response';
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
    CommonModule,
    IonImg, IonCardHeader, IonCardTitle, IonCardContent, IonCard,
    FormsModule, IonButton,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonInput, IonItem, IonLabel, IonIcon
  ],
})
export class Tab1Page {

  numObject?: ExternalApiResponse | null = null;
  @Input() name = '';
  results: Team[] = [];
  teamName?: string;
  showDetail = false;
  loading = false;
  selectedTeam?: Team;

  constructor(
    private apiService: ExternalApiServiceService,
    public favouriteService: FavouriteService,
    private router: Router
  ) {
    addIcons({ star, search });
  }

  toggleDetails(team?: Team) {
    this.selectedTeam = team || undefined;
    this.showDetail = !this.showDetail;
  }

  async onGetInfo() {
    const q = this.name.trim();
    if (q.length === 0) {
      alert('Zadejte název týmu');
      return;
    }
    this.loading = true;
    this.apiService.searchTeams$(q).subscribe({
      next: (teams) => {
        const filtered = q.length === 1
          ? teams.filter(t => (t.strTeam || '').toLowerCase().startsWith(q.toLowerCase()))
          : teams;
        this.results = filtered;
        this.loading = false;
        if (!filtered.length) {
          alert('Žádný tým nenalezen');
        }
      },
      error: () => {
        this.results = [];
        this.loading = false;
        alert('Chyba při načítání dat. Zkuste to později.');
      }
    });
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

  async onAddFavourite(team: Team) {
    const name = team?.strTeam || team?.displayName || this.name?.trim();
    if (!name) return;
    const favourite: SavedFavourites = {
      name,
      uuid: crypto.randomUUID(),
    };
    await this.favouriteService.add(favourite);
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
