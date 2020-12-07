import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeService {
private grid = new Array(10)
private code: string
private status = "Idle"
private charPool: []
private _codeUpdated = new Subject<string>()

  constructor() { }

  public saveGridAndGenerateCode(grid, charPool) {
    console.log(this.code)
    this.status = "Live"
    this.grid = grid
    this.charPool = charPool
    this.generateCode()
    this._codeUpdated.next(this.code)
  }

  public setCodeUpdated(): Observable<any> {
    return this._codeUpdated.asObservable()
  }

  public getGrid() {
    return [...this.grid]
  }

  public getCode() {
    return this.code
  }

  public getStatus() {
    return this.status
  }

  public initializeGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(10)
    }
  }

  private generateCode(): void {
    const today = new Date()
    const seconds = today.getSeconds()
    const secsArr = `${seconds}`.split("").map(x => Number(x))
    console.log(secsArr)
    if (secsArr.length == 1) {
      secsArr.push(0) // add 0 if single digit
    }
    console.log(secsArr)
    const match1 = this.grid[secsArr[0]][secsArr[1]]
    const match2 = this.grid[secsArr[1]][secsArr[0]]
    console.log(match1)
    console.log(match2)
    const count1 = this.countOcurrences(this.charPool, match1)
    let digit1 = count1
    console.log(count1)
    // if count larger than 9, divide result by lowest possible integer

    if (digit1 > 9) {
      digit1 = this.divideByLowest(digit1)
    }
    console.log(digit1)

    let digit2
    if (match1 === match2) {
      digit2 = digit1
    } else {
      const count2 = this.countOcurrences(this.charPool, match2)
      digit2 = count2
      console.log(count2)
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
