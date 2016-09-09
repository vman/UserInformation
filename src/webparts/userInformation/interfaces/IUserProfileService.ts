import { IUserDetails } from '../dtos/IUserDetails.ts';

export interface IUserProfileService {
  getUserAccountName: () => Promise<IUserDetails>;
}