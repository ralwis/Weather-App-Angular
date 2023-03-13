import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getweather(city: string, api_key: string){
    return this.http.get('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid='+ api_key +'&units=metric');
  }
}
