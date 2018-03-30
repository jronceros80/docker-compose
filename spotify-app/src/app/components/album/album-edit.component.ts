import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { UserService } from '../../services/user.service';
import { AlbumService } from '../../services/album.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'album-edit',
    templateUrl: 'album-add.component.html',
    providers: [UserService, AlbumService, UploadService]
  })
  export class AlbumEditComponent implements OnInit{

    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public is_edit;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService
      ){
        this.titulo='Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();  
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
        this.album = new Album('','',2017,'','');
        this.is_edit=true;
    }
    
    ngOnInit(){
        console.log('album-edit cargado');

        //Conseguir el album
        this.getAlbum();
      }
    
    getAlbum(){
        this._route.params.forEach((params: Params)=>{
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response =>{
                    if(!response.album){
                        this._router.navigate(['/']);
                    }else{
                        this.album = response.album;
                    }
                },
                error =>{
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;
                    }
                }
            )
        });

    }

    public fileToUpload: Array<File>;
    fileChangeEvent(fileInput: any){
        this.fileToUpload = <Array<File>>fileInput.target.files;
    }

    onSubmit(){
        this._route.params.forEach((params: Params)=>{
           let id = params['id'];
           
           this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response =>{
                    if(!response.album){
                        this.alertMessage = 'error en el servidor';
                    }else{
                        this.alertMessage = 'El album se ha actualizado correctamente';
                        
                        //Subida de la imagen
                        this._uploadService.makeFileRequest(this.url+ 'upload-image-album/'+ id, [], this.fileToUpload, this.token, 'image')
                        .then(
                            (result: any) => {
                                let objectArtist = this.album.artist;
                                let sArtist = JSON.stringify(objectArtist);
                                let jsonArtist = JSON.parse(sArtist);
                                let idArtist = jsonArtist._id;
                                
                                this._router.navigate(['/artista', idArtist]);
                            },
                            (error) =>{
                                console.log(error);
                            }
                        );  
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