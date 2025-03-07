import {ItemTemplate} from './item-template';

export class CommonItemTemplateModel extends ItemTemplate{

  constructor() {
    super();
  }

  getItemType(): string {
    return 'Common';
  }

}
