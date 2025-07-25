import { Component } from '@angular/core';
import { NavComponent } from "../../../shared/nav/nav.component";

@Component({
  selector: 'app-home',
  imports: [NavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  totalPosts = 47;
  totalViews = 12854;
  activeUsers = 23;
}
