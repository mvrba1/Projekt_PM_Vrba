import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ExternalApiResponse, Team } from './api-response';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiServiceService {
  private base = 'https://www.thesportsdb.com/api/v1/json/3';

  constructor(private http: HttpClient) {}

  private normalizeTeam(t: Team): Team {
    const displayName = (t.strTeam && t.strTeam.trim()) || (t.strTeamAlternate && t.strTeamAlternate.trim()) || undefined;
    const primaryRaw = (t.strFanart1 || t.strFanart2 || t.strBanner || t.strBadge || '');
    const primaryImage = primaryRaw && primaryRaw.trim() ? primaryRaw.trim() : undefined;
    return { ...t, displayName, primaryImage };
  }

  // RxJS variant for UI usage
  searchTeams$(name: string): Observable<Team[]> {
    const q = (name || '').trim();
    if (!q) return of([]);
    const params = new HttpParams().set('t', q);
    return this.http.get<ExternalApiResponse>(`${this.base}/searchteams.php`, { params }).pipe(
      map(res => (res?.teams ?? []).map(t => this.normalizeTeam(t))),
      catchError((_err: HttpErrorResponse) => of([]))
    );
  }

  // Promise variant kept for backward compatibility
  async getInfo(name: string): Promise<ExternalApiResponse> {
    const q = (name || '').trim();
    if (!q) return { teams: [] };
    const params = new HttpParams().set('t', q);
    const obs = this.http.get<ExternalApiResponse>(`${this.base}/searchteams.php`, { params });
    const data = await firstValueFrom(obs);
    return { teams: data?.teams ?? [] };
  }
}
