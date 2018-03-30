import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Song } from '../../models/song';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'song-add',
  templateUrl: 'song-add.component.html',
  providers: [UserService,SongService,UploadService]
})
export class SongEditComponent implements OnInit {

  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public alertMessage: string;
  public is_edit: boolean;
  
  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserService,
      private _songService: SongService,
      private _uploadService: UploadService
    ){
      this.titulo='Editar canción';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();  
      this.url = GLOBAL.url;
      this.song = new Song(1,'','','','');
      this.is_edit = true;
  }

  ngOnInit(){
      console.log('song-edit cargado');

      //Sacar cancion a editar
      this.getSong();
    }

    getSong(){
      this._route.params.forEach((params: Params)=>{
          let id = params['id'];

          this._songService.getSong(this.token, id).subscribe(
              response =>{
                  if(!response.song){
                      this._router.navigate(['/']);
                  }else{
                      this.song = response.song;
                      console.log(this.song);
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
         
         this._songService.editSong(this.token, id, this.song).subscribe(
              response =>{
                      if(!response.song){
                          this.alertMessage = 'error en el servidor';
                      }else{
                          this.alertMessage = '!La cancion se ha guardado correctamente';
                          
                          if(!this.fileToUpload){
                            this._router.navigate(['/album', response.song.album]);
                          }else{
                            //Subir el fichero de audio
                            this._uploadService.makeFileRequest(this.url+ 'upload-file-song/'+ id, [], this.fileToUpload, this.token, 'file')
                            .then(
                                (result: any) => {
                  
                                    this._router.navigate(['/album', response.song.album]);
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
