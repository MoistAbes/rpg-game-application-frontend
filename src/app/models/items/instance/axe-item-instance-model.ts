import {WeaponItemInstanceModel} from './weapon-item-instance-model';
import {AxeItemTemplateModel} from '../template/axe-item-template-model';

export class AxeItemInstanceModel extends WeaponItemInstanceModel {
  axeTemplate: AxeItemTemplateModel | undefined;
}
