
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  icon: string;
  constructor(
    city: string,
    date: string,
    description: string,
    temp: number,
    humidity: number,
    wind: number,
    icon: string
  ) {
    this.city = city;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = 'defaultCity';
  }

  // TODO: Create fetchLocationData method
private async fetchLocationData(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data; // This returns the full data object
}

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return locationData.coord;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;

  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const url = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(url);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return new Weather(
      this.cityName,
      new Date(response.dt * 1000).toLocaleDateString(), // Convert timestamp to date
      response.weather[0].description,
      response.main.temp, // Ensure this is the correct path
      response.main.humidity,
      response.wind.speed,
      response.weather[0].icon
    );
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    const forecastArray = [];
    forecastArray.push(currentWeather);
    for (let i = 1; i < 6; i++) {
      const forecast = this.parseCurrentWeather(weatherData.list[i]);
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method

  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      return this.buildForecastArray(currentWeather, weatherData);
    }
    catch (error) {
      console.error(error);
      return [];
    }
  }
}

export default new WeatherService();