import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user/user-edit.component';

//Importar artistas
import { ArtistListComponent } from './components/artist/artist-list.component';
import { ArtistAddComponent } from './components/artist/artist-add.component';
import { ArtistEditComponent } from './components/artist/artist-edit.component';
import { ArtistDetailComponent } from './components/artist/artist-detail.component';

//Importar Albums
import { AlbumAddComponent } from './components/album/album-add.component';
import { AlbumEditComponent } from './components/album/album-edit.component';
import { AlbumDetailComponent } from './components/album/album-detail.component';

//Importar Canciones
import { SongAddComponent } from './components/song/song-add.component';
import { SongEditComponent } from './components/song/song-edit.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artistas/:page', component: ArtistListComponent},
    {path: 'crear-artista', component: ArtistAddComponent},
    {path: 'editar-artista/:id', component: ArtistEditComponent},
    {path: 'artista/:id', component: ArtistDetailComponent},
    {path: 'crear-album/:artist', component: AlbumAddComponent},
    {path: 'editar-album/:id', component: AlbumEditComponent},
    {path: 'album/:id', component: AlbumDetailComponent},
    {path: 'crear-tema/:album', component: SongAddComponent},
    {path: 'editar-tema/:id', component: SongEditComponent},
    {path: 'mis-datos', component: UserEditComponent},
	{path: '**', component: ArtistListComponent}
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);