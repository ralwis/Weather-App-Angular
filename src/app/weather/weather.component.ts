import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Router } from '@angular/router';

var currentCityCode: string;
var currentCityName: string;
var cityCodeArray: string[] = [];
var cityNameArray: string[] = [];
var cityCode: string;
var city: string;
var timeZone: string;

function jsonToString(){
  let jsonString = '{"List":[{"CityCode":"1248991","CityName":"Colombo","Temp":"33.0","Status":"Clouds"},{"CityCode":"1850147","CityName":"Tokyo","Temp":"8.6","Status":"Clear"},{"CityCode":"2644210","CityName":"Liverpool","Temp":"16.5","Status":"Rain"},{"CityCode":"2988507","CityName":"Paris","Temp":"22.4","Status":"Clear"},{"CityCode":"2147714","CityName":"Sydney","Temp":"27.3","Status":"Rain"},{"CityCode":"4930956","CityName":"Boston","Temp":"4.2","Status":"Mist"},{"CityCode":"1796236","CityName":"Shanghai","Temp":"10.1","Status":"Clouds"},{"CityCode":"3143244","CityName":"Oslo","Temp":"-3.9","Status":"Clear"}]}';
  let jsonArray = JSON.parse(jsonString);

  for (let i in jsonArray.List) {
    currentCityCode = jsonArray.List[i].CityCode;
    currentCityName = jsonArray.List[i].CityName;
    cityCodeArray.push(currentCityCode);
    cityNameArray.push(currentCityName);
  }
  console.log(cityCodeArray);     //Console
  console.log(cityNameArray);     //Console
}

jsonToString();

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})

export class WeatherComponent implements OnInit{
  api_key: string = '49cc8c821cd2aff9af04c9f98c36eb74';
  currentWeather: any;
  timestamp:string = '';
  
  constructor(private weatherService : WeatherService, private router: Router) { }

  ngOnInit(): void {

    const updateData = (): void => {

      var timeZonesArray = ["Asia/Colombo","Asia/Tokyo","Europe/London","Europe/Paris","Australia/Sydney","EST","Asia/Shanghai","Europe/Oslo"];

      for(let i=0; i<timeZonesArray.length; i++){
        cityCode = cityCodeArray[i];
        city = cityNameArray[i];
        timeZone = timeZonesArray[i];

        let cityName = document.getElementById(`city${i+1}-name`) as HTMLDivElement;
        let cityTime = document.getElementById(`city${i+1}-time`) as HTMLDivElement;
        let cityTemp = document.getElementById(`city${i+1}-temp`) as HTMLDivElement;
        let cityMinTemp = document.getElementById(`city${i+1}-min-temp`) as HTMLDivElement;
        let cityMaxTemp = document.getElementById(`city${i+1}-max-temp`) as HTMLDivElement;
        let cityIconURL = document.getElementById(`weather${i+1}-icon`) as HTMLImageElement;
        let cityWeatherStatus = document.getElementById(`weather${i+1}-status`) as HTMLDivElement;
        let cityPressure = document.getElementById(`city${i+1}-pressure`) as HTMLDivElement;
        let cityHumidity = document.getElementById(`city${i+1}-humidity`) as HTMLDivElement;
        let cityVisibility = document.getElementById(`city${i+1}-visibility`) as HTMLDivElement;
        let cityLocation = document.getElementById(`city${i+1}-location`) as HTMLDivElement;
        let citySunRise = document.getElementById(`city${i+1}-sunrise`) as HTMLDivElement;
        let citySunSet = document.getElementById(`city${i+1}-sunset`) as HTMLDivElement;


        this.weatherService.getweather(city, this.api_key).subscribe({

          next: (res) => {
            
            this.currentWeather = res;
            cityName.innerHTML = this.currentWeather.name;
            cityTime.innerHTML = `${getDateTime(this.currentWeather.dt, timeZonesArray[i])}`;
            cityTemp.innerHTML = `${(this.currentWeather.main.temp).toFixed(1)}&#176;C`;
            cityMinTemp.innerHTML = `Temp Min : ${this.currentWeather.main.temp_min}`;
            cityMaxTemp.innerHTML = `Temp Max : ${this.currentWeather.main.temp_max}`;
            cityIconURL.src = 'https://openweathermap.org/img/wn/' + this.currentWeather.weather[0].icon + '@2x.png';
            cityWeatherStatus.innerHTML = `${getWeatherstatus(this.currentWeather)}`;
            cityPressure.innerHTML = `Pressure : ${this.currentWeather.main.pressure}`;
            cityHumidity.innerHTML = `Humidity : ${this.currentWeather.main.humidity}%`;
            cityVisibility.innerHTML = `Visibility : ${(this.currentWeather.visibility/1000).toFixed(1)} km`;
            cityLocation.innerHTML = `${Math.round(this.currentWeather.wind.speed)}m/s ${Math.round(this.currentWeather.wind.deg)} Degree`;
            citySunRise.innerHTML = `Sunrise : ${timeRiseSet(this.currentWeather.sys.sunrise, timeZonesArray[i])}`;
            citySunSet.innerHTML = `Sunset : ${timeRiseSet(this.currentWeather.sys.sunset, timeZonesArray[i])}`;
          },
    
          error: (error) => console.log(error.message),
    
          complete: () => console.info('API call completed')
        })
      }
    }
    
    setInterval(updateData, 1000);

  }

}



function getWeatherstatus(data1: { weather: { description: any; }[]; }){
  const weatherStatus = data1.weather[0].description;
  const capitalizedWeather = weatherStatus.split(" ").map((word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");

  return capitalizedWeather;
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


