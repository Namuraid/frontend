import { Injectable } from '@angular/core';


@Injectable()
export class Logger {
  public name: string = 'RootLogger';

  constructor() {}

  public getLogger(name: string) {
    let l = new Logger();
    l.name = name;
    return l;
  }

  public log(msg: any)   { console.log(this.fmtMessage(msg)); }
  public error(msg: any) { console.error(this.fmtMessage(msg)); }
  public warn(msg: any)  { console.warn(this.fmtMessage(msg)); }

  private fmtMessage(msg: any) { return `${this.name}: ${msg}`; }
}
