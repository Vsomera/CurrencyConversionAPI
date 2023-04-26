import express, { Request, Response } from 'express';
import axios from 'axios';
const app = express();
const port = 3000;

const url = "https://api.apilayer.com/exchangerates_data" // currency exchange api
const config = {
  headers: { 'apikey': 'OPca3nCXaXCEYXBEWeGmNfC2IX6UUc39' } // api key
} 

app.use(express.json()); // parses incoming JSON data from a request's body (req.body)

// Type Checking
interface convertRequest { // ensures requests has a to, from, and amount attribute
  to: string
  from: string
  amount: number | string
}

interface convertResponse { // ensures response matches the interface type
  success: true
  result: number
}

interface symbolResponse {
  success: true
  symbols: object
}

app.get('/', (req: Request, res: Response<symbolResponse>) => {
  // sends an object of symbols that can be used for converting currencies
  axios.get(`${url}/symbols`, config)
    .then(response => {
      const symbols: symbolResponse = {
        success: response.data.success,
        symbols: response.data.symbols
      }
      res.json(symbols)
    })
    .catch(err => res.json(err))
});

app.get('/convert', (req: Request<convertRequest>, res: Response<convertResponse>) => {
  const currTo = req.body.to // currency to convert to
  const currFrom = req.body.from // currency to convert from
  const amount = req.body.amount // amount to convert

  // sends a get request to currency exchange api
  axios.get(`${url}/convert?to=${currTo}&from=${currFrom}&amount=${amount}`, config)
    .then(response => {
      const result: convertResponse = { // ensures the result matches the response interface type
        success: response.data.success,
        result: response.data.result
      }
      res.json(result)
    })

    // @ts-ignore
    .catch(err => res.json({"Error": {"message": "Invalid request attribute"},}));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
