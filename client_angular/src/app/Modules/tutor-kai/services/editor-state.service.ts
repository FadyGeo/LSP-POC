import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EditorStateService {
  private editorInitializedSubject = new BehaviorSubject<boolean>(false);
  public editorInitialized$ = this.editorInitializedSubject.asObservable();

  public setEditorInitialized(initialized: boolean): void {
    this.editorInitializedSubject.next(initialized);
  }
}
