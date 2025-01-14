import axios from 'axios';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Mendapatkan direktori file saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'viewData.json');

const insertData = async () => {
  try {
    const rawData = await readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    if (!jsonData.data || jsonData.data.length === 0) {
      console.error('No data found in the JSON file.');
      return;
    }

    for (const transaction of jsonData.data) {
      const response = await axios.post('http://localhost:5000/api/transactions', transaction);
      console.log(`Transaction ID ${transaction.id} inserted:`, response.data);
    }

    console.log('All data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error.response?.data || error.message);
  }
};

insertData();
