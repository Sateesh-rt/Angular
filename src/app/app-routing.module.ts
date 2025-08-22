import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
 
  {path:'', redirectTo: 'navbar', pathMatch: 'full'},
  {path: 'navbar', component: NavbarComponent},
  {path: 'admin-dashboard',component:AdminDashboardComponent,},
  {path: 'user-dashboard', component:UserDashboardComponent, },
  {path: 'cart', component:CartComponent,},
 
  
  // Add more routes here as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
