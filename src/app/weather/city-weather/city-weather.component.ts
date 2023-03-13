import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { CityWeatherService } from '../city-weather.service';
 
@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.css']
})
export class CityWeatherComponent implements OnInit{
  api_key: string = '49cc8c821cd2aff9af04c9f98c36eb74';
  currentWeather: any;
  
  user:{name:string, tz:string};


  constructor(private route: ActivatedRoute, private cityWeatherService: CityWeatherService, private router: Router) { }
  
  ngOnInit(): void {
    
    this.route.params.subscribe((data: Params) => {
      this.user={
        name: data['name'],
        tz:data['tz']
      }
    });

    let cityName = document.getElementById(`city-name`) as HTMLDivElement;
    let cityTime = document.getElementById(`city-time`) as HTMLDivElement;
    let cityTemp = document.getElementById(`city-temp`) as HTMLDivElement;
    let cityMinTemp = document.getElementById(`city-min-temp`) as HTMLDivElement;
    let cityMaxTemp = document.getElementById(`city-max-temp`) as HTMLDivElement;
    let cityIconURL = document.getElementById(`weather-icon`) as HTMLImageElement;
    let cityWeatherStatus = document.getElementById(`weather-status`) as HTMLDivElement;
    let cityPressure = document.getElementById(`city-pressure`) as HTMLDivElement;
    let cityHumidity = document.getElementById(`city-humidity`) as HTMLDivElement;
    let cityVisibility = document.getElementById(`city-visibility`) as HTMLDivElement;
    let cityLocation = document.getElementById(`city-location`) as HTMLDivElement;
    let citySunRise = document.getElementById(`city-sunrise`) as HTMLDivElement;
    let citySunSet = document.getElementById(`city-sunset`) as HTMLDivElement;

    this.cityWeatherService.getWeatherData(this.user.name, this.api_key).subscribe({
      next: (res) => {
  
        this.currentWeather = res;
        cityName.innerHTML = this.currentWeather.name;
        cityTime.innerHTML = `${getDateTime(this.currentWeather.dt, this.user.tz)}`;
        cityTemp.innerHTML = `${(this.currentWeather.main.temp).toFixed(1)}&#176;C`;
        cityMinTemp.innerHTML = `Temp Min : ${this.currentWeather.main.temp_min}`;
        cityMaxTemp.innerHTML = `Temp Max : ${this.currentWeather.main.temp_max}`;
        cityIconURL.src = 'https://openweathermap.org/img/wn/' + this.currentWeather.weather[0].icon + '@2x.png';
        cityWeatherStatus.innerHTML = `${getWeatherstatus(this.currentWeather)}`;
        cityPressure.innerHTML = `Pressure : ${this.currentWeather.main.pressure} hPa`;
        cityHumidity.innerHTML = `Humidity : ${this.currentWeather.main.humidity}%`;
        cityVisibility.innerHTML = `Visibility : ${(this.currentWeather.visibility/1000).toFixed(1)} km`;
        cityLocation.innerHTML = `${Math.round(this.currentWeather.wind.speed)}m/s ${Math.round(this.currentWeather.wind.deg)} Degree`;
        citySunRise.innerHTML = `Sunrise : ${timeRiseSet(this.currentWeather.sys.sunrise, this.user.tz)}`;
        citySunSet.innerHTML = `Sunset : ${timeRiseSet(this.currentWeather.sys.sunset, this.user.tz)}`;
      },

      error: (error) => console.log(error.message),

      complete: () => console.info('API Called successed')
    })
  }


}

function getDateTime(timeStamp: any, timeZone: string){
  const unixTimestamp = timeStamp;
  const date = new Date(unixTimestamp * 1000);
  var newDate = date.toLocaleString('en-US', { timeZone: `${timeZone}` });

  const originalDate = new Date(`${newDate}`);

  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();

  let suffix = 'am';
  let displayHours = hours;
  if (hours >= 12) {
  suffix = 'pm';
  displayHours = hours === 12 ? 12 : hours - 12;
  }

  const displayDate = originalDate.toLocaleString('en-US', {
  month: 'short',
  day: 'numeric'
  });

  const displayString = `${displayHours}.${minutes < 10? '0'+minutes: minutes} ${suffix}, ${displayDate}`;

  return displayString; 
}

function getWeatherstatus(data1: { weather: { description: any; }[]; }){
  const weatherStatus = data1.weather[0].description;
  const capitalizedWeather = weatherStatus.split(" ").map((word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");

  return capitalizedWeather;
}

function timeRiseSet(timeStamp: any, timeZone: string){
  const unixTimestamp = timeStamp;
  const date = new Date(unixTimestamp * 1000);
  var newDate = date.toLocaleString('en-US', { timeZone: `${timeZone}` });

  const originalDate = new Date(`${newDate}`);

  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();

  let suffix = 'am';
  let displayHours = hours;
  if (hours >= 12) {
  suffix = 'pm';
  displayHours = hours === 12 ? 12 : hours - 12;
  }

  const displayString = `${displayHours}.${minutes < 10? '0'+minutes: minutes} ${suffix}`;

  return displayString;
}

