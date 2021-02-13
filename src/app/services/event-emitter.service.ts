import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeCartFunction = new EventEmitter();
  invokeLoginSuccess = new EventEmitter();
  subsVar: Subscription;
  constructor() { }

  onCartAdd() {
    this.invokeCartFunction.emit();
  }

  onLoginHeader() {
    this.invokeLoginSuccess.emit();
  }
}
