import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {JwtService} from '../../../global/services/jwt.service';
import {CharacterApiService} from '../../../services/api/character-api.service';
import {CharacterModel} from '../../../models/character-model';
import {NgForOf} from '@angular/common';
import {CharacterLocalService} from '../../../global/services/character-local.service';

@Component({
  selector: 'app-character-selection-page',
  imports: [
    NgForOf
  ],
  templateUrl: './character-selection-page.component.html',
  standalone: true,
  styleUrl: './character-selection-page.component.css'
})
export class CharacterSelectionPageComponent implements OnInit {

  characterList: CharacterModel[] = [];

  constructor(private router: Router,
              private jwtService: JwtService,
              private characterService: CharacterApiService,
              private characterLocalService: CharacterLocalService,) {
  }

  ngOnInit(): void {
    this.loadCharacters();
  }


  public loadCharacters(): void {

    this.characterService.getUserCharacters(this.jwtService.getUserIdFromToken()).subscribe({
      next: characters => {
        this.characterList = characters;
        console.log(this.characterList)
      },
      error: () => {

      },
      complete: () => {

      }
    })

  }

  createNewCharacter() {

  }

  playCharacter(id: number, name: string) {

    //save to local
    this.characterLocalService.saveCharacterData(id.toString(), name)

    //move to character page
    this.router.navigate(['/character']);


  }
}
