import { Component } from '@angular/core';
import { LucideAngularModule, ShieldCheck, UsersRound } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  icons = {
    ShieldCheck,
    UsersRound
  };
}