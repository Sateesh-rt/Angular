import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class AuthModelService {

  loginTemplate!: TemplateRef<any>;
  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {}

  registerLoginTemplate(template: TemplateRef<any>) {
    this.loginTemplate = template;
  }

  openLogin() {
    if (this.loginTemplate) {
      this.modalRef = this.modalService.show(this.loginTemplate);
    } else {
      console.error('Login template not registered!');
    }
  }

  close() {
    this.modalRef?.hide();
  }
}
