import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Payment } from '../models/payments.interface';
import { CodeService } from '../services/code.service';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

form: FormGroup
payments: Payment[]

  constructor(
    private codeService: CodeService,
    private paymentsService: PaymentsService) { }

  ngOnInit(): void {
    this.payments = this.paymentsService.getPayments()
    console.log(this.payments)
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required)
    })
  }

  onSubmit(): void {
    if (this.codeService.getStatus() == "Idle" ) {
      alert("You need to start the generator to create payments!")
      return
    }
    if (this.form.valid) {
      const code = this.codeService.getCode()
      const grid = this.codeService.getGridSnapshot()
      if (this.payments[6].name == null) {
        for (let i = 0; i < 7; i++) {
          if (this.payments[i].name == null) {
            Object.assign(this.payments[i], this.form.value)
            this.payments[i].code = code
            this.payments[i].grid = grid
            break
          }
        }
        
      } else {
        let mergedObject = Object.assign({code: code, grid: grid}, this.form.value)
        this.payments.push(mergedObject)
      }
      this.form.reset()
      this.paymentsService.savePayments(this.payments);
    }
  }

  postPayments() {
    this.paymentsService.postPayments()
  }
}
