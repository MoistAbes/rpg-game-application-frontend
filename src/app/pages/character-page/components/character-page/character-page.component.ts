import {Component, OnInit} from '@angular/core';
import {CharacterInventoryComponent} from '../character-inventory/character-inventory.component';
import {CharacterStatsComponent} from '../character-stats/character-stats.component';
import {CharacterManagerService} from '../../../../global/services/character-manager.service';
import {CharacterModel} from '../../../../models/character/character-model';



@Component({
  selector: 'app-character-page',
  imports: [
    CharacterInventoryComponent,
    CharacterStatsComponent
  ],
  templateUrl: './character-page.component.html',
  standalone: true,
  styleUrl: './character-page.component.css'
})
export class CharacterPageComponent implements OnInit{
  character: CharacterModel | null = null;

  constructor(private characterManager: CharacterManagerService) {}

  ngOnInit(): void {
    this.characterManager.character$.subscribe(character => {
      this.character = character;
    });

    this.characterManager.loadCharacter(); // Load character data
  }

}
