declare interface IUserInformationStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'userInformationStrings' {
  const strings: IUserInformationStrings;
  export = strings;
}
