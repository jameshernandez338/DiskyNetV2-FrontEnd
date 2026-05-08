import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  House,
  LucideAngularModule,
  Pencil,
  Search,
  UserRoundPlus,
  ChevronRight
} from 'lucide-angular';

import { UsersService } from '@core/services/users.service';
import { UserListResponse } from '../../models/user-list-response.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

@Component({
  selector: 'app-user-list',
  imports: [NgClass, RouterLink, FormsModule, LucideAngularModule, LoadingSpinnerComponent, PaginationComponent, TooltipDirective],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  icons = {
    House,
    Search,
    UserRoundPlus,
    Pencil,
    ChevronRight
  };

  search = '';
  users: UserListResponse[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.currentPage = 1;
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredUsers(): UserListResponse[] {
    const q = this.search.toLowerCase();
    if (!q) return this.users;
    return this.users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userName.toLowerCase().includes(q)
    );
  }

  get pagedUsers(): UserListResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }
}