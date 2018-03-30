import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { HijoComponent } from './components/pruebas/hijo.component';
import { InputNumberComponent } from './components/pruebas/input-number.component';
import { UserEditComponent } from './components/user/user-edit.component';
import { ArtistListComponent } from './components/artist/artist-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist/artist-add.component';
import { ArtistEditComponent } from './components/artist/artist-edit.component';
import { ArtistDetailComponent } from './components/artist/artist-detail.component';
import { AlbumAddComponent } from './components/album/album-add.component';
import { AlbumEditComponent } from './components/album/album-edit.component';
import { AlbumDetailComponent } from './components/album/album-detail.component';
import { SongAddComponent } from './components/song/song-add.component';
import { SongEditComponent } from './components/song/song-edit.component';
import { PlayerComponent } from './components/player/player.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    HijoComponent,
    InputNumberComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
