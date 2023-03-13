import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { CityWeatherComponent } from './weather/city-weather/city-weather.component';

const appRoutes: Routes = [
  {path: '', component: WeatherComponent},
  {path: 'weather', component: WeatherComponent},
  {path: 'weather/city-weather', component: CityWeatherComponent},
  {path: 'weather/city-weather/:name/:tz', component: CityWeatherComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    CityWeatherComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
