import {ArmorItemInstanceModel} from './armor-item-instance-model';
import {ChestItemTemplateModel} from '../template/chest-item-template-model';

export class ChestItemInstanceModel extends ArmorItemInstanceModel{

  chestTemplate: ChestItemTemplateModel | undefined;
  // override type: string = 'HelmetItemInstanceModel';  // Unique type identifier

}
