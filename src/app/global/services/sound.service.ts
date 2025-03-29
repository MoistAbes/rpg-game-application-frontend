import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private audioPath: string = '/audio/';

  constructor() { }

  playSound(url: string, volume: number = 1, loop: boolean = false) {
    const finalUrl:string = this.audioPath + url;

    if (!this.audioCache.has(finalUrl)) {
      const audio = new Audio(finalUrl);
      audio.volume = volume;
      audio.loop = loop;
      this.audioCache.set(finalUrl, audio);
    }

    const audio = this.audioCache.get(finalUrl)!;
    audio.currentTime = 0; // Reset if already playing
    audio.play().catch(error => console.error('Error playing sound:', error));
  }

  stopSound(url: string) {
    const audio = this.audioCache.get(url);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  stopAllSounds() {
    this.audioCache.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
}
