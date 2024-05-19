import {Space} from './space';
import {Permission} from './permission';

export class Role implements IdInterface {
  private _id: number;

  private _name: string;
  private _default: boolean;
  private _space_default: boolean;
  private _space: Space;
  private _permissions: Permission[];


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get default(): boolean {
    return this._default;
  }

  set default(value: boolean) {
    this._default = value;
  }

  get space_default(): boolean {
    return this._space_default;
  }

  set space_default(value: boolean) {
    this._space_default = value;
  }

  get space(): Space {
    return this._space;
  }

  set space(value: Space) {
    this._space = value;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }

  set permissions(value: Permission[]) {
    this._permissions = value;
  }
}
