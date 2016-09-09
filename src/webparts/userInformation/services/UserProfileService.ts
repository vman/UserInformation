import { IUserDetails } from '../dtos/IUserDetails';
import { IUserProfileService } from '../interfaces/IUserProfileService.ts';
import { ServiceScope, HttpClient } from '@microsoft/sp-client-base';

export class UserProfileService implements IUserProfileService {

  private httpClient: HttpClient;

  constructor(serviceScope: ServiceScope) {
    this.httpClient = new HttpClient(serviceScope);
  }

  public getUserAccountName(): Promise<IUserDetails> {
    return this.httpClient.get(
      `/_api/SP.UserProfiles.PeopleManager/GetMyProperties?$select=AccountName`)
      .then((response: Response) => {
        return response.json();
      });
  }
}