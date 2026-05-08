import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { House, LogOut, LucideAngularModule, Menu, PanelLeftClose, PanelLeftOpen, UserRound } from 'lucide-angular';

import { AuthService } from '@core/services/auth.service';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule, TooltipDirective],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() isNavigationCollapsed = false;
  @Input() isNavigationOpen = false;
  @Output() navigationCollapseToggle = new EventEmitter<void>();
  @Output() navigationToggle = new EventEmitter<void>();

  icons = {
    House,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    UserRound
  };

  constructor(private authService: AuthService) {}

  get fullName() {
    return this.authService.getFullName() || 'Usuario';
  }

  logout() {
    this.authService.logout();
  }
}