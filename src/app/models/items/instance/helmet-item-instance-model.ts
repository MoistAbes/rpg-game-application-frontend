import {ArmorItemInstanceModel} from './armor-item-instance-model';
import {HelmetItemTemplateModel} from '../template/helmet-item-template-model';

export class HelmetItemInstanceModel extends ArmorItemInstanceModel{

  helmetTemplate: HelmetItemTemplateModel | undefined;
  override type: string = 'HelmetItemInstanceModel';  // Unique type identifier

}
