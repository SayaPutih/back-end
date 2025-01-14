import { createClient } from '@supabase/supabase-js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

const supabaseUrl = 'https://hqtuykqfqmflrljfsgkf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxdHV5a3FmcW1mbHJsamZzZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjgxNjIsImV4cCI6MjA1MjQ0NDE2Mn0.Vf7mHeTt_hcj2hTuE_zwN29wayyJXzz2ETG5NftXcL0';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000','https://evander-mgg-ino.vercel.app/' ,'https://react-back-31sufniwh-sayaputihs-projects.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req, res) => {
  res.send('Welcome to the API! Use /api/transactions to access the transactions data :) !!!!');
});

app.get('/api/transactions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) throw error;

    const mappedData = data.map((transaction) => ({
      ...transaction,
      status: transaction.status === 0 ? 'SUCCESS' : 'FAILED',
    }));

    res.send(mappedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send({ error: 'Error fetching transactions' });
  }
});

app.get('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();
    if (error) throw error;
    if (data) {
      data.status = data.status === 0 ? 'SUCCESS' : 'FAILED';
      res.send(data);
    } else {
      res.status(404).send({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).send({ error: 'Error fetching transaction' });
  }
});

app.post('/api/transactions', async (req, res) => {
  const transaction = {
    id: req.body.id,
    productID: req.body.productID,
    productName: req.body.productName,
    amount: req.body.amount,
    customerName: req.body.customerName,
    status: req.body.status,
    transactionDate: req.body.transactionDate || new Date().toISOString(),
    createBy: req.body.createBy || 'Admin',
    createOn: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('transactions').insert(transaction);
    if (error) throw error;
    res.send({ message: 'Transaction added successfully!', id: transaction.id });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).send({ error: 'Error adding transaction' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (updatedData.status) {
    updatedData.status = updatedData.status === 'SUCCESS' ? 0 : 1;
  }

  try {
    const { data, error } = await supabase.from('transactions').update(updatedData).eq('id', id);
    if (error) throw error;
    if (data) {
      res.send({ message: 'Transaction updated successfully!' });
    } else {
      res.status(404).send({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).send({ error: 'Error updating transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    if (data) {
      res.send({ message: 'Transaction deleted successfully!' });
    } else {
      res.status(404).send({ message: 'Transaction not found' });
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).send({ error: 'Error deleting transaction' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});