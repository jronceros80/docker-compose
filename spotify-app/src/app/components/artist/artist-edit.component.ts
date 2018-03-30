import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../../models/artist';
import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'artist-edit',
    templateUrl: 'artist-add.component.html',
    providers: [UserService, ArtistService, UploadService]
  })
  export class ArtistEditComponent implements OnInit{

    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public is_edit;
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService
      ){
        this.titulo='Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();  
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
        this.is_edit = true;
      }

    ngOnInit(){
        console.log('artist-edit cargado');

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
                        console.log(this.artist)
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

    public fileToUpload: Array<File>;
    fileChangeEvent(fileInput: any){
        this.fileToUpload = <Array<File>>fileInput.target.files;
    }

    onSubmit(){

        this._route.params.forEach((params: Params) =>{
            let id = params['id'];
            
            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response =>{
                        if(!response.artist){
                            this.alertMessage = 'error';
                        }else{
                            this.alertMessage = 'El artista se actualizado correctamente';

                            if(!this.fileToUpload){
                                this._router.navigate(['/artista', response.artist._id]);
                            }else{
                                    //Subida de la imagen
                                    this._uploadService.makeFileRequest(this.url+ 'upload-image-artist/'+ id, [], this.fileToUpload, this.token, 'image')
                                    .then(
                                        (result: any) => {
                                            this._router.navigate(['/artista', response.artist._id]);
                                        },
                                        (error) =>{
                                            console.log(error);
                                        }
                                    );
                                }
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