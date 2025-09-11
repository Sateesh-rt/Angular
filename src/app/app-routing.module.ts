import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CartComponent } from './components/cart/cart.component';
import { DetailsComponent } from './components/details/details.component';
import { AuthGuard } from './authorization/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/navbar', pathMatch: 'full' },

  { path: 'navbar', component: NavbarComponent },

  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },   // ✅ only Admin allowed

  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },   // ✅ only User allowed

  { path: 'cart', component: CartComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },   // only User can have cart

  { path: 'details', component: DetailsComponent, canActivate: [AuthGuard], data: { roles: ['User', 'Admin'] } }// both allowed

];



// Add more routes here as needed

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
