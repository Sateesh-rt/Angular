import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { Product } from './models/product.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductService } from './services/product.service.spec';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserService } from './services/user.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartComponent } from './components/cart/cart.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { CartService } from './services/cart.service';
import { DetailsComponent } from './components/details/details.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    CartComponent,
    DetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ModalModule,
    ModalModule.forRoot(),
    HttpClientModule,
    NgbModule,
    ConfirmDialogModule,
    ToastModule,

  ],
  providers: [ConfirmationService, MessageService, ProductService, UserService,  CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
