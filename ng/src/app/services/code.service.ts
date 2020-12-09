import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
  
  private gridSize = 10
  private chars = "abcdefghijklmnopqrstuvwxyz".split("");
  private charPool = new Array(Math.pow(this.gridSize, 2));
  private weight = 0.2
  private grid = new Array(this.gridSize)
  private code: string
  private status = "Idle"
  private char: string
  private _codeUpdated = new Subject<string>()

  constructor() { }

  saveGridAndGenerateCode(grid, charPool, char) {
    this.status = "Live"
    this.grid = grid
    this.charPool = charPool
    this.char = char
    this.generateCode()
    this._codeUpdated.next(this.code)
  }

  setCodeUpdated(): Observable<any> {
    return this._codeUpdated.asObservable()
  }

  getGrid() {
    return this.grid
  }

  getGridSnapshot() {
    return _.cloneDeep(this.grid)
  }

  getChar() {
    return this.char ? this.char : ""
  }

  setChar(char) {
    this.char = char
  }

  getGridSize() {
    return this.gridSize
  }

  getCode() {
    return this.code
  }

  getStatus() {
    return this.status
  }

  initializeGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(10)
    }
  }

  initGridGenerator() {
    this.generateGrid();
    setInterval(this.generateGrid.bind(this), 2000)
  }

  generateGrid(): void {
    let startIndex = 0;
    console.log(this.char)
    if (this.char) {
      let reservedSlots = this.weight * Math.pow(this.gridSize, 2)
      startIndex = reservedSlots; // if a character is entered start populating with random chars after the reserved slots
      for (let i = 0; i < reservedSlots; i++) {
        this.charPool[i] = this.char
      }
    }
    for (let i = startIndex; i < this.charPool.length; i++) {
      this.charPool[i] = this.chars[this.randomIntFromInterval(0, this.chars.length - 1)]
    }
    this.shuffleArray(this.charPool)
    this.charPool.forEach((val, ind) => {
      // transform 1D index to 2D indexes
      let i = Math.floor(ind / this.grid.length)
      let j = ind % this.grid.length
      this.grid[i][j] = val
    })
    this.saveGridAndGenerateCode(this.grid, this.charPool, this.char)
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.randomIntFromInterval(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private generateCode(): void {
    const today = new Date()
    const seconds = today.getSeconds()
    const secsArr = `${seconds}`.split("").map(x => Number(x))
    if (secsArr.length == 1) {
      secsArr.push(0) // add 0 if single digit
    }
    const match1 = this.grid[secsArr[0]][secsArr[1]]
    const match2 = this.grid[secsArr[1]][secsArr[0]]
    const count1 = this.countOcurrences(this.charPool, match1)
    let digit1 = count1
    // if count larger than 9, divide result by lowest possible integer

    if (digit1 > 9) {
      digit1 = this.divideByLowest(digit1)
    }

    let digit2
    if (match1 === match2) {
      digit2 = digit1
    } else {
      const count2 = this.countOcurrences(this.charPool, match2)
      digit2 = count2
      if (digit2 > 9) {
        digit2 = this.divideByLowest(digit2)
      }
    }
    this.code = `${digit1}${digit2}`
    
  } 
  private countOcurrences(arr, val): number {
    return arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
  }

  private divideByLowest(number) {
      const ten = Math.floor(number / 10)
      let divisor = ten
      while (number > 9) {
        divisor++
        number = number / divisor
      }
      return Math.round(number)
  }


}
