import { Component, OnInit } from '@angular/core';
import { CodeService } from '../services/code.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {


indexes: any[]
grid: any[]
char: string
inputDisabled = false
buttonDisabled = false

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
    if (this.codeService.getStatus() == "Live") {
      this.buttonDisabled = true
    }
    this.indexes = new Array(this.codeService.getGridSize())
    this.grid = this.codeService.getGrid()
    this.char = this.codeService.getChar()
  }

  initGridGenerator() {
    this.buttonDisabled = true
    this.codeService.initGridGenerator()
  }

  onCharKeyup(event) {

    if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.char = event.key.toLowerCase()
    }
    
    this.codeService.setChar(this.char)
    this.inputDisabled = true
    setTimeout(() => {
      this.inputDisabled = false
    }, 4000)
  }

  onCharKeydown(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 8) {
      this.char = ''
    } else {
      event.preventDefault()
    }
  }

}
