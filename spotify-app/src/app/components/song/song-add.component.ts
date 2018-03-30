import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Song } from '../../models/song';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'song-add',
    templateUrl: 'song-add.component.html',
    providers: [UserService,SongService]
  })
  export class SongAddComponent implements OnInit{

    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _songService: SongService
      ){
        this.titulo='Añadir canción';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();  
        this.url = GLOBAL.url;
        this.song = new Song(1,'','','','');
    }

    ngOnInit(){
        console.log('song-add cargado');
      }
    
    onSubmit(){
        this._route.params.forEach((params: Params)=>{
           let album_id = params['album'];
           this.song.album=album_id;  
           console.log(this.song);
           
           this._songService.addSong(this.token, this.song).subscribe(
                response =>{
                        if(!response.song){
                            this.alertMessage = 'error en el servidor';
                        }else{
                            this.alertMessage = '!La cancion se ha creado correctamente';
                            this.song = response.song;
                            this._router.navigate(['/editar-tema', response.song._id]);
                        }
                },
                error =>{
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                    }
                }
            );
        });
    }
  }