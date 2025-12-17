import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, 
  IonIcon, IonImg, IonBadge 
} from '@ionic/angular/standalone';
import { FavouriteService } from '../services/favourite.service';
import { Team } from '../services/api-response';
import { addIcons } from 'ionicons';
import { 
  trash, heart, informationCircle, globe, football, location,
  trophy, business, calendar, logoFacebook, logoTwitter, logoInstagram 
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    CommonModule,
    IonLabel, IonItem, IonList, IonCardContent, IonCard, IonCardHeader, 
    IonCardTitle, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonIcon, IonImg, IonBadge
  ]
})
export class Tab2Page implements OnInit, OnDestroy {
  favourites: Team[] = [];
  selectedTeam?: Team;
  showDetail = false;
  private subscription?: Subscription;

  constructor(public favouriteService: FavouriteService) {
    addIcons({ 
      trash, heart, informationCircle, globe, football, location,
      trophy, business, calendar, logoFacebook, logoTwitter, logoInstagram 
    });
  }

  ngOnInit() {
    this.subscription = this.favouriteService.favourites$.subscribe(teams => {
      this.favourites = teams;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async onRemove(team: Team) {
    if (confirm(`Opravdu chcete odebrat ${team.displayName || team.strTeam} z oblíbených?`)) {
      await this.favouriteService.removeFromFavorites(team.idTeam);
    }
  }

  toggleDetail(team?: Team) {
    if (team) {
      this.selectedTeam = team;
      this.showDetail = true;
    } else {
      this.showDetail = false;
      this.selectedTeam = undefined;
    }
  }

  async ionViewWillEnter() {
    await this.favouriteService.load();
  }

}
