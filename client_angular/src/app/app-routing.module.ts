import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StudentWorkspaceComponent } from './Modules/tutor-kai/sites/student-workspace/student-workspace.component';

const routes: Routes = [
  { path: '', redirectTo: 'tutor-kai/code/1', pathMatch: 'full' },
  { path: 'app', component: AppComponent,},

    {
      path: 'tutor-kai/code/:taskId',
      component: StudentWorkspaceComponent
    },
    // andere Routen


  // Turor-Kai as lazy loaded module (https://medium.com/@jaydeepvpatil225/feature-module-with-lazy-loading-in-angular-15-53bb8e15d193) Maybe we can use the same for UML Tasks?
  //{ path: 'tutor-kai', loadChildren: () => import('./Modules/tutor-kai/tutor-kai.module').then(m => m.TutorKaiModule) },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
