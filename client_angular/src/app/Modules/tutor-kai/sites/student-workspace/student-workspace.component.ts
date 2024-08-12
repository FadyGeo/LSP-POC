import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { CodeEditorComponent } from "../code-editor/code-editor.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from '@angular/router';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { EditorFile } from '../../models/editorFile';

import { Title } from '@angular/platform-browser';
/**
 * The different states representing the current status of the student workspace.
 */
enum States {
  startState = 0, // start state - before a task is selected (hide code editor)
  editingCode = 1, // after a task is selected (show code editor)
  submittedCode = 2, // after code is submitted (show buttom textfield for feedback
  startGeneratingKIFeedback = 3, // begin animation for generating feedback
  receivingKIFeedback = 3.5, // stops animation for generating feedback and display streamed response
  finishedGeneratingKIFeedback = 4, // end animation for generating feedback and display stars and textfield for feedback
  sendStudentFeedback = 5, // student feedback is sent to the server
}

@Component({
  selector: 'app-student-workspace',
  templateUrl: './student-workspace.component.html',
  styleUrls: ['./student-workspace.component.scss'],
})
export class StudentWorkspaceComponent implements OnInit {
  @ViewChild('codeEditorMonaco') codeEditorComponent?: CodeEditorComponent; // we get access to the codeEditorComponent and can call its methods

  currentState: States = States.startState;
  selectedLanguage: string = 'python';
  currentTask: any;
  currentTaskId: number = 0;
  tasks: any = [];
  tasksOfSelectedWeek: any = [];
  flavor: string = 'Schnelles Feedback';
  flavorOptions: string[] = [
    'Schnelles Feedback',
    'Feedback mit Vorlesungsinformationen',
  ];

  selectedWeek = 0;
  rating: number = 0;
  hoverState: number = 0;
  feedback: string = '';
  lastSubmissionId: string = ''; // encrypted - only server can decrypt
  defaultWeek: number = 0;
  isLoading: boolean = false;
  compilerOutput: string | null = '';
  lastResult: any;

  editorFiles: EditorFile[] = [];
  selectedTabIndex: number = 0;
  code: string = '';
  supportedLanguages = [
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'TypeScript', value: 'typescript' },
  ];
test: any;

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private title: Title
  ) {}

  /**
   * Initialize the component by getting question data from the API.
   * The default week is set to the highest week number.
   */
  ngOnInit(): void {
    this.getCurrentTaskFromRoute();
    this.title.setTitle('GOALS: Tutor Kai');
  }

  getCurrentTaskFromRoute(): void {
    this.editorFiles = [];
    this.route.params.subscribe((params) => {
      const taskId = params['taskId'];
      if (taskId) {
        this.currentTaskId = taskId;
        this.code = `
        def berechne_gesamtpreis(einkaufsliste, preis_pro_gegenstand):
            gesamtpreis = 0
            # Deine Lösung
            return gesamtpreis

        # Deine Lösung: Erstelle die Einkaufsliste und verlängere diese mit append()


        # Preis pro Gegenstand
        preis_pro_gegenstand = 3
        # Ausgabe der Einkaufsliste und des Gesamtpreises
        print("Einkaufsliste:", einkaufsliste)
        print("Gesamtpreis des Einkaufs:", berechne_gesamtpreis(einkaufsliste, preis_pro_gegenstand), "Euro")
        `;
      } });
  }



}
