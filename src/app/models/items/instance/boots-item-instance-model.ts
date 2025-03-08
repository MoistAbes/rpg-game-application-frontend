import {ArmorItemInstanceModel} from './armor-item-instance-model';
import {BootsItemTemplateModel} from '../template/boots-item-template-model';

export class BootsItemInstanceModel extends ArmorItemInstanceModel {
  bootsTemplate: BootsItemTemplateModel | undefined;
  // override type: string = 'BootsItemInstanceModel';
}
