import { Component, OnInit } from '@angular/core';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {
status: string
code: string

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
    this.code = this.codeService.getCode()
    this.status = this.codeService.getStatus()
    this.codeService.setCodeUpdated().subscribe(code => {
      this.status = this.codeService.getStatus()
      this.code = code
    })
  }

}
