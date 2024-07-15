import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 8080;
const URL = 'https://www.newbridgefx.com/currency-codes-symbols/';

app.get('/scrape-currencies', async (req, res) => {
    
  try {
    const { data } = await axios.get(URL);
    const dom = new JSDOM(data);
    const document = dom.window.document;

    const dataObj = {};
    const rows = document.querySelectorAll('div:contains("Currency ISO 4217 Code Currency Symbol") + table tr');

    rows.forEach(row => {
      const columns = row.querySelectorAll('td');
      if (columns.length === 3) {
        const country = columns[0].textContent.trim();
        const code = columns[1].textContent.trim();
        const symbol = columns[2].textContent.trim();
        dataObj[country] = { code, symbol };
      }
    });

    res.json(dataObj);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
