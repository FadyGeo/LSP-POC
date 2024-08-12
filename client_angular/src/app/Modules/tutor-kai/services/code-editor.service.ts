import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {
  private codeMap = new Map<string, BehaviorSubject<string>>();

  setCode(id: string, code: string): void {
    if (!this.codeMap.has(id)) {
      this.codeMap.set(id, new BehaviorSubject<string>(code));
    } else {
      this.codeMap.get(id)?.next(code);
    }
  }

  getCodeObservable(id: string): BehaviorSubject<string> {
    if (!this.codeMap.has(id)) {
      const newSubject = new BehaviorSubject<string>('');
      this.codeMap.set(id, newSubject);
      return newSubject;
    }
    return this.codeMap.get(id)!;
  }
}