import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ExternalApiResponse } from './api-response';


export interface SavedFavourites {
  uuid?: string,
  name: string,
}

const KEY = 'drinks';

@Injectable({
  providedIn: 'root',
})

export class FavouriteService {
  favourites: SavedFavourites[] = [];
  numObject?: ExternalApiResponse | null = null
  
  async load(): Promise<void> {
    const { value } = await Preferences.get({ key: KEY });
    this.favourites = value ? JSON.parse(value) : [];
  }

  async save() {
    await Preferences.set({ key: KEY, value: JSON.stringify(this.favourites) });
  }

  async add(favourite: SavedFavourites) {
    this.favourites.unshift(favourite);
    await this.save();
  }

  async remove(uuid?: string) {
    if (!uuid) return;
    this.favourites = this.favourites.filter(f => f.uuid !== uuid);
    await this.save();
  }

}
