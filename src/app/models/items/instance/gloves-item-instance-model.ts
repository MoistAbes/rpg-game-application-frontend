import {ArmorItemInstanceModel} from './armor-item-instance-model';
import {GlovesItemTemplateModel} from '../template/gloves-item-template-model';

export class GlovesItemInstanceModel extends ArmorItemInstanceModel {
  glovesTemplate: GlovesItemTemplateModel | undefined;
  // override type: string = 'GlovesItemInstanceModel';  // Unique type identifier

}
