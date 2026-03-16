const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client for Serverless Function
const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route
app.get('/api', (req, res) => {
  res.json({ message: 'PPKD Hotel Backend Server is running on Vercel with Supabase!' });
});

// API Route - Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select('id, username, role')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) return res.status(error.code === 'PGRST116' ? 401 : 500).json({ error: error.message });
  res.json({ message: 'Login successful', user: data });
});

// API Route - Get all guests
app.get('/api/guests', async (req, res) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'success', data: data });
});

// API Route - Create new guest
app.post('/api/guests', async (req, res) => {
  const { data, error } = await supabase
    .from('guests')
    .insert([req.body])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'success', data: data });
});

// API Route - Delete guest
app.delete('/api/guests/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'deleted' });
});

// API Route - Update guest
app.put('/api/guests/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('guests')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'updated', data: data });
});

module.exports = app;
