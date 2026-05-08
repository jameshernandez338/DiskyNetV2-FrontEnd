import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    NavigationComponent,
    FooterComponent
  ],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  isNavigationCollapsed = false;
  isNavigationOpen = false;

  openNavigation() {
    this.isNavigationOpen = true;
  }

  closeNavigation() {
    this.isNavigationOpen = false;
  }

  toggleNavigationCollapsed() {
    this.isNavigationCollapsed = !this.isNavigationCollapsed;
  }
}
