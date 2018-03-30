import { Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'componente-hijo',
    templateUrl: 'hijo.component.html'
  })
  export class HijoComponent implements OnInit{

    public titulo: string;
    @Input() propiedad_uno: string;
    @Input() propiedad_dos: string;

    constructor(){
        this.titulo='Componente hijo';
    }

    //Si queremos hacer uso de las propiedades del input, hay q ponerlo en el onInit, 
    //no en el constructor xq sino dara error de undefined.
    //Constructor: se carga cuando se crea el componente
    //Oninit: Cuando se carga la aplicacion correctamente(ya estarian los valores de los inputs)
    ngOnInit(){
        console.log(this.propiedad_uno);
        console.log(this.propiedad_dos);
      }
  }