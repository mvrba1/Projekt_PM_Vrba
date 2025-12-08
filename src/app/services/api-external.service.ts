import { Injectable } from '@angular/core';
import { ExternalApiResponse, Team } from './api-response';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiServiceService {

  async getInfo(name: string): Promise<ExternalApiResponse> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${name}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Fetch failed');

  const data = await response.json();
  return {
    teams: data.teams ?? []
  };
}
}
