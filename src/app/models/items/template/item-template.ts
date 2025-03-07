export abstract class ItemTemplate {
  id!: number;
  name!: string;
  description!: string;
  isEnemyDrop!: boolean;
  isStackable!: boolean;
  iconPath!: string;

  // Optional constructor for shared fields
  protected constructor(init?: Partial<ItemTemplate>) {
    Object.assign(this, init);
  }

  abstract getItemType(): string; // Each subclass will implement this
}
