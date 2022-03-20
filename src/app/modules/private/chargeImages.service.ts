import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from 'src/app/core/models/interfaces/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChargeImagesService {
  constructor(private http: HttpClient) {}


  postImage(image: any, name:string, folder:string, id:string): Observable<any> {

    const formData = new FormData();

    formData.append('image', image, name);

    return this.http.post(environment.apiUrl+'cargarImagen?folder='+folder+"&id="+id, formData);
  }

  responseAfterPost(resp:any){

  }


}
