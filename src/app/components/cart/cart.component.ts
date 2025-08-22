import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = {};          // the whole cart object
  items: any[] = [];  // cart items
  total: number = 0;  // total price
  totalPrice: number = 0;


  constructor(private router: Router,
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService

  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);

    this.cartService.getCart(user.id).subscribe((data: any[]) => {
      console.log(data);

      if (data.length > 0) {
        this.cart = data; // first cart
        this.items = data;
        this.total = this.cart.total;
        for (let item of this.items) {

          this.totalPrice += item.price * item.quantity;
        }

      }
});
  }
  removeItem(itemId: number) {
    this.confirmationService.confirm({
      message: 'Do you really want to remove this item?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartService.removeItem(itemId).subscribe(() => {
          if (this.items && this.items.length > 0) {
            this.items = this.items.filter(i => i.id !== itemId);
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          } else {
            this.items = [];
            this.total = 0;
          }
          this.messageService.add({ severity: 'success', summary: 'Removed', detail: 'Item removed from cart' });
          window.location.reload();
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Item not removed' });
      }
    });
  }
  dashBoard() {
    this.router.navigate(['/user-dashboard']);
  }
}

