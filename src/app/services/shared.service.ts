import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SharedService {

  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();
  
  private sharedToken: Subject<any> = new Subject<any>()
  sharedToken$: Observable<any> = this.sharedToken.asObservable()


  constructor() { }

    setSharedData(data: any) {
        this.sharedData.next(data);
    }

}