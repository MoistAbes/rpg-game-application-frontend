import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NgForOf} from '@angular/common';

import {FormsModule} from '@angular/forms';
import {CenterModalComponent} from '../../../../global/components/center-modal/center-modal.component';
import {JwtService} from '../../../../global/services/jwt.service';
import {CharacterApiService} from '../../../../services/api/character-api.service';
import {CharacterModel} from '../../../../models/character/character-model';
import {AuthService} from '../../../../global/services/auth.service';

@Component({
  selector: 'app-character-selection-page',
  imports: [
    NgForOf,
    CenterModalComponent,
    FormsModule,
  ],
  templateUrl: './character-selection-page.component.html',
  standalone: true,
  styleUrl: './character-selection-page.component.css'
})
export class CharacterSelectionPageComponent implements OnInit {

  characterList: CharacterModel[] = [];

  newCharacterName: string | undefined;

  showModal: boolean = false;


  constructor(private router: Router,
              private authService: AuthService,
              private jwtService: JwtService,
              private characterService: CharacterApiService) {
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

  onNewCharacterCardClicked() {
    this.showModal = true;
  }

  playCharacter(id: number, name: string) {

    this.authService.selectCharacter(id).subscribe({
      next: generatedToken => {
        this.jwtService.saveToken(generatedToken.token);
      },
      error: () => {},
      complete: () => {
        console.log(this.jwtService.getToken())
        //save to local
        // this.characterLocalService.saveCharacterData(id.toString(), name)

        //move to character page
        this.router.navigate(['/character']);
      },
    })


  }

  createCharacter() {
    this.characterService.createCharacter(this.newCharacterName! ,this.jwtService.getUserIdFromToken()).subscribe({
      next: (characterId) => {
        // this.characterLocalService.saveCharacterData(characterId.toString(), "")
        this.authService.selectCharacter(characterId).subscribe({
          next: generatedToken => {
            this.jwtService.saveToken(generatedToken.token);
          },
          error: () => {},
          complete: () => {
            this.router.navigate(['/character']);
          },
        });

      },
      error: () => {},
      complete: () => {
      },
    })
  }

  onModalClose() {
    this.showModal = false;
  }
}
