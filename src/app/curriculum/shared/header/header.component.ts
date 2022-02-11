import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactComponent } from 'src/app/curriculum/contact/contact.component';

@Component({
  selector: 'curriculum-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuActivado = false;


  activarMenu(){
    this.menuActivado = !this.menuActivado;

  }
  constructor(public contactDialog:MatDialog) { }

  ngOnInit(): void {
  }

  openContactDialog(){

    this.activarMenu();

    const contactDialogRef = this.contactDialog.open(ContactComponent, {width: '800px'})
    
  }

}