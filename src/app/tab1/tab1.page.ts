import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, 
  IonIcon, IonInput, IonButton, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonImg 
} from '@ionic/angular/standalone';

import { ExternalApiServiceService } from '../services/api-external.service';
import { ExternalApiResponse, Team } from '../services/api-response';
import { 
  search, star, heart, heartOutline, informationCircle,
  football, location, trophy, business, calendar, globe,
  logoFacebook, logoTwitter, logoInstagram 
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { FavouriteService } from '../services/favourite.service';
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
    addIcons({ 
      star, search, heart, heartOutline, informationCircle,
      football, location, trophy, business, calendar, globe,
      logoFacebook, logoTwitter, logoInstagram 
    });
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

  async onAddFavourite(team: Team) {
    if (!team) return;
    
    const added = await this.favouriteService.addToFavorites(team);
    if (added) {
      alert(`${team.displayName || team.strTeam} byl přidán do oblíbených`);
    } else {
      alert(`${team.displayName || team.strTeam} je již v oblíbených`);
    }
  }

  isFavorite(team: Team): boolean {
    return team ? this.favouriteService.isFavorite(team.idTeam) : false;
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
