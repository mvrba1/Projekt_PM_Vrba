import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FavouriteService, SavedFavourites } from '../services/favourite.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonLabel, IonItem, IonList, IonCardContent, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon]
})
export class Tab2Page {

  constructor(
    public favouriteService: FavouriteService,
    private router: Router
  ) {
    addIcons({ trash });
  }

  async onRemove(favourite: SavedFavourites) {
    await this.favouriteService.remove(favourite.uuid);
  }

  onGetInfo(favourite: SavedFavourites) {
    this.router.navigate(['/tabs/tab1'], { queryParams: { name: favourite.name } });
  }

  async ionViewWillEnter() {
    await this.favouriteService.load();
  }

}
