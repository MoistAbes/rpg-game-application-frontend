import {CharacterEquipmentModel} from './character-equipment-model';
import {CharacterInventoryModel} from './character-inventory-model';
import {CharacterStats} from './character-stats-model';

export class CharacterModel {
    id: number = 0;
    name: string = "";
    level: number = 0;
    experience: number = 0;
    nextLevelExperience: number = 0;

    goldAmount: number = 0;

    equipment: CharacterEquipmentModel | undefined;
    inventory: CharacterInventoryModel | undefined;
    characterStats: CharacterStats | undefined;
}
