import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EditorFile } from '../../models/editorFile';
import { EditorStateService } from '../../services/editor-state.service';
import { CodeEditorService } from '../../services/code-editor.service';
import { MonacoEditorLanguageClientWrapper, UserConfig} from 'monaco-editor-wrapper';
import { Subscription, interval } from 'rxjs';
import { createUserConfigCpp, createUserConfigPython } from '../../services/code-editor-config.service';
import { getWrapper, startEditor, swapEditors } from 'monaco-languageclient-examples';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';

useWorkerFactory({
  rootPath: window.location.href + '../..',
  basePath: '../assets',
});
/**
 * A component that wraps the monaco-editor and provides additional functionality.
 */
@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent {
  //do you want to use a language server (true) or just the editor (false)?
  useLanguageServer: boolean = true;
  //the selected language 
  @Input() selectedLanguage: string|undefined = 'python';
  //the code to be displayed in the editor
  @Input() code: string = '';
  //the file to be displayed and changed
  @Input() file!: EditorFile;

  //emits the code change
  @Output() codeChange = new EventEmitter<string>();

  //the editor container
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLDivElement>;
  
  //the editor wrapper (to manipulate initialized code editor instances)
  private editorWrapper!: MonacoEditorLanguageClientWrapper;

  //the editor initialization subscription to decide between new instance or swap editor
  editorInitSubscription!: Subscription;

  //send a request every 30 seconds to keep the server session alive
  private keepAliveSubscription!: Subscription;
  private keepAliveInterval: number = 30000; // 30 seconds
  
  //the editor options
  editorOptions = {
    theme: 'vs-bright',
  };

  constructor(private editorStateService: EditorStateService,
              private codeEditorService: CodeEditorService) {}
  
  ngOnInit(): void {
    this.registerFileCode();
  }
  
  registerFileCode():void {
    this.codeEditorService.setCode(this.file.uniqueName, this.code);
  }

  /**
   * Subscribes to the editorInitialized$ observable of the editorStateService.
   * Depending on the current state of the editor, it either initializes the editor for the first time
   * or swaps the editor to use the new code of the given file (this is useful to avoid multiple editor inits).
   */
  ngAfterViewInit(): void {
    this.editorInitSubscription = this.editorStateService.editorInitialized$.subscribe((isInitialized) => {
      if (!isInitialized) { // if editor is not initialized, initialize it
        this.initEditor();
        this.editorStateService.setEditorInitialized(true); // set editor to initialized
      } else { // if editor is already initialized, swap it to the new file
        this.swapEditor();
      }
      // send a request every 30 seconds to keep the server session alive
      this.keepAliveSubscription = interval(this.keepAliveInterval).subscribe(() => {
        this.sendKeepAlive();
      });
    });
  }

  /**
   * Sends a 'stay alive' notification to the language server to keep the server session alive.
   * This function is called every 30 seconds (keepAliveInterval) to keep the server session alive.
   */
  private sendKeepAlive(): void {
    const languageClient = this.editorWrapper.getLanguageClient();
    if (languageClient) {
      languageClient.sendNotification('stay alive'); // send a 'stay alive' notification to the language server
    }
  }

  /**
   * Initializes the code editor and registers on change event on the editor instance
   */
   initEditor(): void {
    // create user configuration for the editor
    const userConfig = this.configureLanguageServer(this.code, undefined);
    if (userConfig !== undefined) {
      // start the editor with the user config, the editor container and the code to be initialized
      startEditor(userConfig, this.editorContainer.nativeElement, this.code).then(async () => {
        // get a reference to the current editor wrapper
        this.editorWrapper = getWrapper();
        if (this.editorWrapper) {
          // set the value of the editor to the current code
          this.editorWrapper.getModel()?.setValue(this.code);
          // when the editor's content changes, update the code editor service with the new code and emit an event
          this.editorWrapper.getModel()?.onDidChangeContent(() => {
            this.codeEditorService.setCode(this.file.uniqueName, this.editorWrapper.getModel()?.getValue() ?? '');
            this.codeChange.emit(this.editorWrapper.getModel()?.getValue() ?? '');
          });
        }
        // save the current code to the file's code property (the file's code property is used to store the file's code)
        this.file.code = this.code;
      });
    }
  }

  /**
   * Swaps the editor to use the new code of the given file.
   * This is useful to avoid multiple editor inits. 
   */
  swapEditor(): void {
    const originalCode = this.codeEditorService.getCodeObservable(this.file.uniqueName).getValue();
    const currentCode = this.code; // Assuming this.code is always up to date with the editor's content
    if (!originalCode || !currentCode) {
        console.error("Original code or current code is undefined.");
        return;
    }
    // Get a reference to the current editor
    this.editorWrapper = getWrapper();
    // Get the current code from the editor
    this.file.code = this.editorWrapper?.getModel()?.getValue() ?? '';
    // When the editor's content changes, update the code editor service with the new code and emit an event
    this.editorWrapper?.getModel()?.onDidChangeContent(() => {
      this.codeEditorService.setCode(this.file.uniqueName, this.editorWrapper?.getModel()?.getValue() ?? '');
      this.codeChange.emit(this.editorWrapper?.getModel()?.getValue() ?? '');
    });
    // Create a user config for the swap editor function
    const userConfig = this.configureLanguageServer(currentCode, originalCode);
    if (userConfig !== undefined) {
      // If the editor container and its native element exist, swap the editor with the original code
      if (this.editorContainer && this.editorContainer.nativeElement) {
        swapEditors(userConfig, this.editorContainer.nativeElement, currentCode, originalCode);
      }
    }
  }

  /**
   * Configures the language server and editor.
   * This function is used to configure the language server and editor
   * when the language server and/or the selected language is changed.
   * @param code The current code in the editor.
   * @param codeOriginal The original code of the file. 
   * if the current code is different from the original code.
   */
  configureLanguageServer(code: string, codeOriginal?: string): UserConfig | void {
    if (this.selectedLanguage === 'python') {
      // Configure the language server and editor for Python language
      return createUserConfigPython(code, codeOriginal, this.useLanguageServer, this.editorOptions);
    } else if (this.selectedLanguage === 'java') {
      // TODO: Add Java language support
      console.warn('Java language support is not yet implemented.');
    } else if (this.selectedLanguage === 'cpp') {
      // Configure the language server and editor for C++ language
      return createUserConfigCpp(code, codeOriginal, this.useLanguageServer, this.editorOptions);
    }
  }

  /**
   * Called when the component is destroyed.
   * Saves the current editor code to the file's code property and emits a change event.
   * Cleans up the editor instance.
   */
  ngOnDestroy(): void {
    // Get the current editor code
    this.editorWrapper = getWrapper();
    this.file.code = this.editorWrapper.getModel()!.getValue();
    // Save the current code to the file's code property
    this.code = this.file.code;
    // Update the code editor service with the new code
    this.codeEditorService.setCode(this.file.uniqueName, this.code);
    // Emit a change event
    this.codeChange.emit(this.code);
    // Unsubscribe from the editor init subscription
    this.editorInitSubscription.unsubscribe();
    // Unsubscribe from the keep alive subscription
    this.keepAliveSubscription.unsubscribe();
    // Mark the editor as uninitialized
    this.editorStateService.setEditorInitialized(false);
  }
}
