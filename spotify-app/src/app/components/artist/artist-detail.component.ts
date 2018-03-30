import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../../models/artist';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'artist-detail',
    templateUrl: 'artist-detail.component.html',
    providers: [UserService, ArtistService, AlbumService]
  })
  export class ArtistDetailComponent implements OnInit{
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public albums;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
      ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();  
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
      }

    ngOnInit(){
        console.log('artist-add cargado');

        //Lamar almetodo del api para sacar un artista en base a su getArtist
        this.getArtist();
      }

    getArtist(){
        this._route.params.forEach((params: Params) =>{
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response =>{
                    if(!response.artist){
                        this._router.navigate(['/']);
                    }else{
                        this.artist = response.artist;

                        //obtener los albunes del artista
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response =>{
                                if(!response.albums){
                                    this.alertMessage='Este artista no tiene albunes';
                                }else{
                                    this.albums = response.albums;
                                }
                            },
                            error =>{
                                var errorMessage = <any>error;
                                if(errorMessage != null){
                                    var body = JSON.parse(error._body);
                                }
                            }
                        ); 
                    }
            },
            error =>{
                var errorMessage = <any>error;
                if(errorMessage != null){
                    var body = JSON.parse(error._body);
                }
            });
        });
    }

    public confirmado;
    onDeleteConfirmAlbum(id){
      this.confirmado = id;
    }
    
    onCancelAlbum(id){
      this.confirmado = null;
    }

    onDeleteAlbum(id){
      this._albumService.deleteAlbum(this.token, id).subscribe(
        response =>{
            if(!response.album){
                alert("Error en el servidor");
            }else{
                this.getArtist();
            }
        },
        error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
                var body = JSON.parse(error._body);
                console.log(error);
            }
        });
    }
  }