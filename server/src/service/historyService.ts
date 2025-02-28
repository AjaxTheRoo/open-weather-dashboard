import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'db', 'searchHistory.json');
  }

  private async ensureDirectoryExists(): Promise<void> {
    const dir = path.dirname(this.filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  private async read(): Promise<string> {
    try {
      return await fs.readFile(this.filePath, { encoding: 'utf8' });
    } catch (err) {
      console.error('Error reading file:', err);
      return '[]'; // Return an empty array if the file doesn't exist or can't be read
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, '\t'));
  }

  async getCities(): Promise<City[]> {
    const cities = await this.read();
    let parsedCities: City[];

    try {
      parsedCities = JSON.parse(cities) || [];
    } catch (err) {
      console.error('Error parsing cities:', err);
      parsedCities = [];
    }

    return parsedCities;
  }

  async addCity(city: string): Promise<City> {
    if (!city) {
      throw new Error('City cannot be blank');
    }

    await this.ensureDirectoryExists(); // Ensure the directory exists

    const newCity: City = new City(city, uuidv4());
    const cities = await this.getCities();

    // Check for duplicates in a case-insensitive manner
    if (cities.find((index) => index.name.toLowerCase() === city.toLowerCase())) {
      return cities.find((index) => index.name.toLowerCase() === city.toLowerCase())!; // Return the existing city if it is already in the list
    }

    const updatedCities = [...cities, newCity];
    await this.write(updatedCities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const filteredCities = cities.filter((city) => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();
