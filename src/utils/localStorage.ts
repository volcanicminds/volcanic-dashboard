type DataToStore = {
  [k: string]: string;
};

export const TOKEN_STORAGE_KEY = "authToken";
export const LAST_PAGE_STORAGE_KEY = "lastPage";

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
