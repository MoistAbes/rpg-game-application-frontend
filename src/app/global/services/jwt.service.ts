import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  private readonly TOKEN_KEY = 'token';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  getUserIdFromToken(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
      return payload.userId || null; // Extract userId
    } catch (error) {
      console.error("Error decoding token:", error);
      return 0;
    }
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
      return payload.username || null; // Extract username
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  getUserRolesFromToken(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
      return payload.roles || []; // Extract username
    } catch (error) {
      console.error("Error decoding token:", error);
      return [];
    }
  }



  //ToDO trzeba to przerobic na number i wszystkie metody korzystajace z tego na number
  getCharacterIdFromToken(): string {
    const token = this.getToken();
    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode payload
      return payload.characterId || null; // Extract username
    } catch (error) {
      console.error("Error decoding token:", error);
      return "";
    }
  }

  isCharacterIdPresent(): boolean {
    const characterId: string | null = this.getCharacterIdFromToken();

    if (characterId === null || characterId === undefined) {
      return false;
    }

    return !(characterId.length == 0 || characterId == "0");


  }

}
