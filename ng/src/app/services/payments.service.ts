import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../models/payments.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  payments: Payment[]
  constructor(private http: HttpClient) { }

  savePayments(payments: Payment[]): void {
    this.payments = payments
  }

  getPayments(): Payment[] {
    if (this.payments) {

      return [...this.payments]

    } else {
      this.payments = []
      for (let i = 0; i < 7; i++) {
        this.payments.push({name: null, amount: null, code: null, grid: null})
      }
      return [...this.payments]
    }
  }

  postPayments() {
    // filter any objects with null values
    const payload = this.payments.filter(payment => payment.name)
    console.log(payload)
    this.http.post<Payment[]>('https://api-example.com/payments', payload).subscribe(
      response => console.log(response),
      error => console.log(error)
    )
  }
}
