import {ItemInstanceModel} from './Item-instance-model';
import {CommonItemTemplateModel} from '../template/common-item-template-model';

export class CommonItemInstanceModel extends ItemInstanceModel{

  commonItemTemplate: CommonItemTemplateModel = new CommonItemTemplateModel();
}
