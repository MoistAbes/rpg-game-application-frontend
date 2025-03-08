import {WeaponItemInstanceModel} from './weapon-item-instance-model';
import {SwordItemTemplateModel} from '../template/sword-item-template-model';

export class SwordItemInstanceModel extends WeaponItemInstanceModel{

  swordTemplate: SwordItemTemplateModel | undefined;
  // override type: string = 'SwordItemInstanceModel';  // Unique type identifier

}
