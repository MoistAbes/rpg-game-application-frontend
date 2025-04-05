import {Component, OnInit} from '@angular/core';
import {CharacterStatsApiService} from '../../services/api/character-stats-api.service';
import {CharacterManagerService} from '../../global/services/character-manager.service';
import {CharacterModel} from '../../models/character/character-model';


@Component({
  selector: 'app-tavern-page',
  imports: [],
  templateUrl: './tavern-page.component.html',
  styleUrl: './tavern-page.component.css'
})
export class TavernPageComponent implements OnInit{

  constructor(private characterStatsApiService: CharacterStatsApiService,
              private characterManagerService: CharacterManagerService) {
  }

  character: CharacterModel | null = null;

  ngOnInit(): void {
    this.characterManagerService.character$.subscribe(character => {
      this.character = character;
      console.log("loaded character: ", this.character);
    });
  }



  onDrinkBeerButtonClicked() {

    this.updateCharacterCurrentHealthToMax()


  }


  updateCharacterCurrentHealthToMax() {
    this.characterStatsApiService.updateCharacterCurrentHealth(this.character!.characterStats!.id, this.character!.characterStats!.maxHealth).subscribe({
      next: () => {

      },
      error: err => {
        console.log(err);
      },
      complete: () => {}
    })
  }


}
