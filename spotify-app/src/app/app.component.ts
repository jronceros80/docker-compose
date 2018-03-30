import { Component, OnInit } from '@angular/core';
import {User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUFISY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){
      //Conseguir los datos del usuario identificado
      this._userService.signut(this.user).subscribe(
          response =>{
            let identity = response.user;
            this.identity = identity;

            if(!this.identity){
              alert("el usuario no esta logeado");
            }else{
              //Crear elemento en el localStorage para tener al usuario en sesion
              localStorage.setItem('identity', JSON.stringify(identity));

              //Conseguir el token para enviarselo a cada peticion http
              this._userService.signut(this.user, 'true').subscribe(
                response =>{
                  let token = response.token;
                  this.token = token;

                  if(this.token.length <= 0){
                    alert("el usuario no esta logeado");
                  }else{
                    //Crear elemento en el localStorage para tener el token disponible
                    localStorage.setItem('token', token);
                    this.user = new User('','','','','','ROLE_USER',''); //vaciamos e inicializamos el user

                  }
                },
                error =>{
                    var errorMessage = <any>error;
                    var body = JSON.parse(error._body);
                    this.errorMessage = body.message;
                }
            );
            }
          },
          error =>{
              var errorMessage = <any>error;
              var body = JSON.parse(error._body);
              this.errorMessage = body.message;
          }
      );
  }

  public onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con el email ' + this.user_register.email;
          this.user_register = new User('','','','','','ROLE_USER',''); //vaciamos e inicializamos el user
        }
      },
      error =>{
        var errorMessage = <any>error;
        var body = JSON.parse(error._body);
        this.alertRegister = body.message;
    }
    );
  }

  public logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;
    this.alertRegister = null;

    this._router.navigate(['/']);
  }
}
