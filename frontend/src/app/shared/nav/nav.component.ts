import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(private readonly _router: Router) { }




  switchToLogin() {
    this._router.navigate(['login'])
  }
  switchToHome() {
    this._router.navigate([''])
  }

}
