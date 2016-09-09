import { IUserDetails } from '../dtos/IUserDetails';
import { IUserProfileService } from '../interfaces/IUserProfileService';
import { ServiceScope, HttpClient } from '@microsoft/sp-client-base';

export class MockUserProfileService implements IUserProfileService {

  private httpClient: HttpClient;

  constructor(serviceScope: ServiceScope){
  }

  public getUserAccountName(): Promise<IUserDetails> {
    return new Promise<IUserDetails>((resolve)=>{
     resolve({ AccountName: "mockAccount: vardhaman" });
    });
  }
}