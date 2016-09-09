import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';

import styles from './UserInformation.module.scss';
import * as strings from 'userInformationStrings';
import { IUserInformationWebPartProps } from './IUserInformationWebPartProps';
import { ServiceScope, ServiceKey } from '@microsoft/sp-client-base';
import { IUserProfileService } from './interfaces/IUserProfileService';
import { UserProfileService } from './services/UserProfileService';
import { MockUserProfileService } from './mocks/MockUserProfileService';
import { EnvironmentType } from '@microsoft/sp-client-base';
import { IUserDetails } from './dtos/IUserDetails';

export default class UserInformationWebPart extends BaseClientSideWebPart<IUserInformationWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.userInformation}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${this.properties.description}</p>
              <p id="accountNameContainer" class="ms-font-l ms-fontColor-white"></p>
              <a href="https://github.com/SharePoint/sp-dev-docs/wiki" class="ms-Button ${styles.button}">
                <span class="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    const serviceScope: ServiceScope = ServiceScope.startNewRoot();
    const currentScope: ServiceScope = this.context.serviceScope;
    const userProfileServiceKey: ServiceKey<IUserProfileService> = ServiceKey.create<IUserProfileService>("userprofileservicekey", UserProfileService);
    const mockUserProfileServiceKey: ServiceKey<IUserProfileService> = ServiceKey.create<IUserProfileService>("mockuserprofileservicekey", MockUserProfileService);
    serviceScope.createDefaultAndProvide(userProfileServiceKey);
    serviceScope.createDefaultAndProvide(mockUserProfileServiceKey);
    serviceScope.finish();

    let userProfileServiceInstance: IUserProfileService;

    switch(this.context.environment.type){
      case EnvironmentType.ClassicSharePoint:
      case EnvironmentType.SharePoint:
        userProfileServiceInstance = serviceScope.consume(userProfileServiceKey);
        break;
      case EnvironmentType.Local:
      case EnvironmentType.Test:
        userProfileServiceInstance = serviceScope.consume(mockUserProfileServiceKey);
        break;
    }

    userProfileServiceInstance.getUserAccountName().then((response: IUserDetails) => {
      document.getElementById("accountNameContainer").innerText = response.AccountName;
    });
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
