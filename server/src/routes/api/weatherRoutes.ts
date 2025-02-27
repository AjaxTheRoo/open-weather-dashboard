import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const city = req.body.cityName;
  WeatherService.getWeatherForCity(city)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
  // TODO: GET weather data from city name
  router.get('/', async (req: Request, res: Response) => {
    try {
      const city = req.query.city as string;
      const weatherData = await WeatherService.getWeatherForCity(city);
      res.json(weatherData);
    }
    catch (err) {
      res.status(500).json(err);
    }
  });
  // TODO: save city to search history
  router.post('/history', async (req: Request, res: Response) => {
    const city = req.body.city;
    await HistoryService.addCity(city);
    res.sendStatus(201);
  });

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const cities = await HistoryService.getCities();
  res.json(cities);
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  await HistoryService.removeCity(id);
  res.sendStatus(204);
});

export default router;