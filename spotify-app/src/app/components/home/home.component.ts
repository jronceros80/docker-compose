import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
    selector: 'home',
    templateUrl: 'home.component.html'
  })
  export class HomeComponent implements OnInit{

    public titulo: string;
    
    public dato_externo ='Jorge Ronceros';
    public identity = {
      id:1,
      web: 'jronceros80@gmail.com',
      tematica: 'desarrollo web'
    }

    public dato_number=5234;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
      ){
        this.titulo='Home';
      }

    ngOnInit(){
        console.log('home cargado');
      }

  }