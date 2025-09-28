export type CredentialDataModel = {
  email: string;
  password: string;
};

export type TokenDataModel = {
  id: string;
  email: string;
  roleIds: string[];
};

export type AuthModel = {
  accessToken: string;
};
