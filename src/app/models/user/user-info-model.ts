import {UserRoleModel} from './user-role-model';

export class UserInfoModel {

  id: number = 0;
  username: string = "";
  email: string = "";
  roles: UserRoleModel[] = [];

}
