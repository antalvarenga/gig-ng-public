import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodeService } from '../code.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  indexes = new Array(10);
  grid: any[]
  char: string;
  chars = "abcdefghijklmnopqrstuvwxyz".split("");
  charPool = new Array(Math.pow(this.indexes.length, 2));
  weight = 0.2
  inputDisabled = false
  buttonDisabled = false

  constructor(private codeService: CodeService) { }

  ngOnInit(): void {
    this.grid = this.codeService.getGrid()
    console.log(this.grid)
  }

  initGridGenerator() {
    this.buttonDisabled = true
    this.generateGrid();
    setInterval(this.generateGrid.bind(this), 2000)
  }

  generateGrid(): void {
    let startIndex = 0;
    console.log(this.weight)
      if (this.char) {
        console.log(this.char)
        let reservedSlots = this.weight * Math.pow(this.indexes.length, 2)
        startIndex = reservedSlots; // if a character is entered start populating with random chars after the reserved slots
        for (let i = 0; i < reservedSlots; i++) {
          this.charPool[i] = this.char
        }
      }
      for (let i = startIndex; i < this.charPool.length; i++) {
        this.charPool[i] = this.chars[this.randomIntFromInterval(0, this.chars.length - 1)]
      }
      this.shuffleArray(this.charPool)
      console.log(this.charPool)
      this.charPool.forEach((val, ind) => {
        // transform 1D index to 2D indexes
        let i = Math.floor(ind / this.grid.length)
        let j = ind % this.grid.length
        this.grid[i][j] = val
      })
      this.codeService.saveGridAndGenerateCode(this.grid, this.charPool)
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.randomIntFromInterval(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  onCharKeyup(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90)) {
      this.inputDisabled = true
    }
    setTimeout(() => {
      this.inputDisabled = false
    }, 1000)
  }

  onCharKeydown(event) {
    // this.inputDisabled = true
    // setTimeout(() => {
    //   this.inputDisabled = false
    // }, 1000)
    if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 8) {
      this.char = ''
    } else {
      event.preventDefault();
    }
  }

}
