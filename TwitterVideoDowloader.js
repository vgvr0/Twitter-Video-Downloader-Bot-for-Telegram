const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Token de acceso al bot de Telegram y Twitter Bearer Token
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Crea el objeto bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Directorio para guardar los videos temporalmente
const TEMP_DIR = path.join(__dirname, 'temp');

// Asegurarse de que el directorio temporal existe
fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

// Manejador de mensajes con enlaces
bot.onText(/https?:\/\/(?:www\.)?twitter\.com\/\w+\/status\/(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tweetId = match[1];
  
  try {
    await bot.sendMessage(chatId, 'Procesando el tweet...');

    const tweetData = await getTweetData(tweetId);
    const videoData = chooseVideoResolution(tweetData.extended_entities.media[0].video_info.variants);
    const videoUrl = videoData.url;
    
    // Descarga el video
    const videoFilePath = path.join(TEMP_DIR, `video_${tweetId}.mp4`);
    await downloadFile(videoUrl, videoFilePath);
    
    // Envía el video como respuesta
    await bot.sendVideo(chatId, videoFilePath, {
      caption: `Video descargado de Twitter.\nResolución: ${videoData.resolution || 'Desconocida'}\nBitrate: ${videoData.bitrate ? (videoData.bitrate / 1000000).toFixed(2) + ' Mbps' : 'Desconocido'}`
    });

    // Elimina el archivo temporal
    await fs.unlink(videoFilePath);
  } catch (error) {
    console.error('Error:', error.message);
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Función para obtener los datos de un tweet
async function getTweetData(tweetId) {
  try {
    const response = await axios.get(`https://api.twitter.com/1.1/statuses/show/${tweetId}.json`, {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`No se pudo obtener la información del tweet: ${error.message}`);
  }
}

// Función para elegir la resolución del video
function chooseVideoResolution(variants) {
  const mp4Variants = variants.filter(v => v.content_type === 'video/mp4' && v.bitrate);
  const sortedVariants = mp4Variants.sort((a, b) => b.bitrate - a.bitrate);
  const chosen = sortedVariants[0];
  
  // Extraer la resolución del URL si está disponible
  const resolutionMatch = chosen.url.match(/\/(\d+x\d+)\//);
  if (resolutionMatch) {
    chosen.resolution = resolutionMatch[1];
  }
  
  return chosen;
}

// Función para descargar un archivo
async function downloadFile(url, filePath) {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Manejador de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Bot is running...');
