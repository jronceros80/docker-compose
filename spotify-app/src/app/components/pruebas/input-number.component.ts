import { Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'input-number',
    templateUrl: 'input-number.component.html'
  })
  export class InputNumberComponent implements OnInit{

    public titulo: string;
    @Input() valueNumber: number;

    constructor(){
        this.titulo='Componente input number';
    }

    ngOnInit(){
       // console.log(this.valueNumber);
      }
    
      prueba(){
        alert(this.valueNumber); 
      }
  } 