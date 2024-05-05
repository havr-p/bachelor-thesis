import { Injectable } from '@angular/core';

export const EDITOR_STATE_KEY = 'editorState';
export const CURRENT_PROJECT_KEY = 'currentProject';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public saveData(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData(key: string): any {
    let item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public hasKey(key: string) {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) === key) return true;
    }
    return false;
  }
}
