import { Component, OnInit } from '@angular/core';
import { CodeService } from './services/code.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private codeService: CodeService) {}
  ngOnInit(): void {
    this.codeService.initializeGrid()
  }


}
