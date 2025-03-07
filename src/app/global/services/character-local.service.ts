import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterLocalService {

  private readonly CHARACTER_ID = 'characterId';
  private readonly CHARACTER_NAME = 'characterName';


  constructor() { }

  saveCharacterData(id: string, name: string): void {
    localStorage.setItem(this.CHARACTER_ID, id);
    localStorage.setItem(this.CHARACTER_NAME, name);
  }

  getId(): string | null {
    return localStorage.getItem(this.CHARACTER_ID);
  }

  getName(): string | null {
    return localStorage.getItem(this.CHARACTER_NAME);
  }

  removeCharacterData(): void {
    localStorage.removeItem(this.CHARACTER_ID);
    localStorage.removeItem(this.CHARACTER_NAME);
  }

  hasCharacterData(): boolean {
    return !!this.getId();
  }

}
