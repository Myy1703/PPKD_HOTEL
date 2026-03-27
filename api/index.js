import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env locally from root
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing!');
  console.log('Current process.env.VITE_PUBLIC_SUPABASE_URL:', supabaseUrl);
} else {
  console.log('Supabase initialized with URL:', supabaseUrl.substring(0, 20) + '...');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
  res.send('PPKD Hotel Backend is Running. Please access the app via Vite (port 5173).');
});

app.get('/api', (req, res) => {
  console.log('GET /api - Health check');
  res.json({ message: 'PPKD Hotel Backend Server is running on Vercel with Supabase (ESM)!' });
});

// API Route - Login
app.post('/api/login', async (req, res) => {
  console.log('POST /api/login - Attempting login for:', req.body.username);
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select('id, username, role')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) {
    console.error('Login Error:', error.message);
    return res.status(error.code === 'PGRST116' ? 401 : 500).json({ error: error.message });
  }
  console.log('Login Successful for:', username);
  res.json({ message: 'Login successful', user: data });
});

// API Route - Get all guests
app.get('/api/guests', async (req, res) => {
  console.log('GET /api/guests - Fetching all guests');
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch Guests Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Fetched', data.length, 'guests');
  res.json({ message: 'success', data: data });
});

// API Route - Create new guest
app.post('/api/guests', async (req, res) => {
  console.log('POST /api/guests - Creating new guest:', req.body.nama);
  const { data, error } = await supabase
    .from('guests')
    .insert([req.body])
    .select()
    .single();

  if (error) {
    console.error('Create Guest Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Guest Created Successfully:', data.id);
  res.status(201).json({ message: 'success', data: data });
});

// API Route - Delete guest
app.delete('/api/guests/:id', async (req, res) => {
  console.log('DELETE /api/guests/:id - Deleting guest:', req.params.id);
  const { id } = req.params;
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete Guest Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Guest Deleted Successfully');
  res.json({ message: 'deleted' });
});

// API Route - Update guest
app.put('/api/guests/:id', async (req, res) => {
  console.log('PUT /api/guests/:id - Updating guest:', req.params.id);
  const { id } = req.params;
  const { data, error } = await supabase
    .from('guests')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Update Guest Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Guest Updated Successfully');
  res.json({ message: 'updated', data: data });
});

export default app;

// For local testing (Vite dev server proxy)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Backend Hotel siap di http://localhost:${PORT}`);
    console.log(`📡 Menghubungkan ke Supabase: ${supabaseUrl?.substring(0, 30)}...\n`);
  });
}
