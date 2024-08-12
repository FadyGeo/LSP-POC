import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userMail: string = "";
  userRole: string = "";
  userIsLoggedIn: boolean = false;
  constructor
    (
      private router: Router,
    )
    {
      // Subscribe to the authentication observable
    }

  ngOnInit() {
    //this.toolbarService.show();
  }

  logOut() {
    this.router.navigate(['/login']);
  }

}
