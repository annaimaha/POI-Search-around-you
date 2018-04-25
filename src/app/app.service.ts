import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { myGlobals } from '../constants/globals';
@Injectable()
export class AppService {

    headers: any;
    options: any;
    constructor(private http: HttpClient) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.options = { headers: this.headers, withCredentials: true };
    }

    

    searchtheNearBy(values: any) {        
         return this.http.get(myGlobals.searchNearBy + "%" + values + "%",  this.options);
    }

    private extractData(res: Response) {
        let body = <any>res.json;    // return array from json file
        return body || [];     // also return empty array if there is no data
      }

}
