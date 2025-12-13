import { UserModel } from "../user/user.model";

export const AuthRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email });
  },

  createUser(data: Partial<any>) {
    return UserModel.create(data);
  },
};
