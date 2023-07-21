type DataToStore = {
  [k: string]: string;
};

export const types = {
  REFRESH_TOKEN: "refreshToken",
  REFRESH_TOKEN_EXP: "refreshTokenExpiration",
  AUTHENTICATION: "authentication",
  AUTHENTICATION_EXP: "authenticationExpiration",
  THEME: "theme",
  USER: "user",
  LOGIN_EMAIL: "loginEmail",
};

export function get(type: string) {
  const item = localStorage.getItem(type);

  return item ? JSON.parse(item || "") : "";
}

export function save(type: string, data: DataToStore | string) {
  localStorage.setItem(type, JSON.stringify(data));
}

export function remove(type: string) {
  localStorage.removeItem(type);
}

export function clearAll(exceptions: Array<string>) {
  const dataToStore = {} as DataToStore;
  const hasExceptions = exceptions && exceptions.length > 0;
  if (hasExceptions) {
    exceptions.forEach((exc) => {
      dataToStore[exc] = get(exc);
    });
  }

  localStorage.clear();

  if (hasExceptions) {
    exceptions.forEach((exc) => {
      save(exc, dataToStore[exc]);
    });
  }
}
