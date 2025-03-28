
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// ✅ Расширенная настройка CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.options('/generate', cors(corsOptions));

app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post('/generate', async (req, res) => {
  const {
    prompt,
    width,
    height,
    negative_prompt,
    strength = 1.0
  } = req.body;

  try {
    const response = await axios.post('https://modelslab.com/api/v1/enterprise/realtime/text2img', {
      key: API_KEY,
      prompt,
      width,
      height,
      negative_prompt,
      samples: 1,
      strength,
      safety_checker: true
    });

    res.json(response.data);
  } catch (error) {
    console.error('Ошибка API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при генерации изображения' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Сервер работает! Используй POST /generate');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
