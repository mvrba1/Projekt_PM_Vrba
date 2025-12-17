import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Team } from './api-response';
import { BehaviorSubject, Observable } from 'rxjs';

const KEY = 'favourite_teams';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  private favouritesSubject = new BehaviorSubject<Team[]>([]);
  public favourites$ = this.favouritesSubject.asObservable();

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    const { value } = await Preferences.get({ key: KEY });
    const teams: Team[] = value ? JSON.parse(value) : [];
    this.favouritesSubject.next(teams);
  }

  private async save(teams: Team[]): Promise<void> {
    await Preferences.set({ key: KEY, value: JSON.stringify(teams) });
    this.favouritesSubject.next(teams);
  }

  getFavorites(): Team[] {
    return this.favouritesSubject.getValue();
  }

  isFavorite(teamId: string): boolean {
    return this.favouritesSubject.getValue().some(t => t.idTeam === teamId);
  }

  async addToFavorites(team: Team): Promise<boolean> {
    if (this.isFavorite(team.idTeam)) {
      return false; // Already exists
    }
    const updated = [team, ...this.favouritesSubject.getValue()];
    await this.save(updated);
    return true;
  }

  async removeFromFavorites(teamId: string): Promise<void> {
    const updated = this.favouritesSubject.getValue().filter(t => t.idTeam !== teamId);
    await this.save(updated);
  }

  // Legacy methods for backward compatibility (deprecated)
  async add(favourite: { name: string; uuid?: string }): Promise<void> {
    // Keep for backward compatibility if needed
  }

  async remove(uuid?: string): Promise<void> {
    // Keep for backward compatibility if needed
  }
}
