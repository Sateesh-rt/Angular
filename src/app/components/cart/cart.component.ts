import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import{ DetailsService } from 'src/app/services/details.service';

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
  bankForm!: FormGroup;
  modalRef?: any;
  


  constructor(private router: Router,
    private cartService: CartService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder, 
    private modalService: BsModalService,
    private detailsService: DetailsService

  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);

    this.cartService.getCart(user.id).subscribe((data: any[]) => {
      console.log(data);
      this.initbankForm()

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
   initbankForm(){
     this.bankForm = this.fb.group({
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[0-9]{6}$/)]],
      accountNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(18)]]
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

    openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template);
    }
   closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();  // ✅ Correct way to close modal
      this.modalRef = undefined;
    }
  }

  // ✅ Submit Bank Form
  submitBankForm() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (this.bankForm.valid) {
      
      this.detailsService.addBankDetails(this.bankForm.value,userId).subscribe({
        next: (res) => {
          console.log('Bank details submitted successfully', res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bank details submitted successfully' });
          this.closeModal();  // Close modal on success
        },
        error: (err) => {
          console.error('Error submitting bank details', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit bank details' });
        }
      });
    } else {
      this.closeModal();
    }
  }
  
}

