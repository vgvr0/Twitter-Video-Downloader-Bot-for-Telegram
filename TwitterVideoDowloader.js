const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs');

// Token de acceso al bot de Telegram
const token = 'TU_TOKEN_DE_TELEGRAM';

// Crea el objeto bot
const bot = new TelegramBot(token, { polling: true });

// Manejador de mensajes con enlaces
bot.onText(/https?:\/\/twitter\.com\/\w+\/status\/(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tweetId = match[1];
  
  try {
    const tweetData = await getTweetData(tweetId);
    const videoData = chooseVideoResolution(tweetData.extended_entities.media[0].video_info.variants);
    const videoUrl = videoData.url;
    
    // Descarga el video
    const videoFilePath = `video_${tweetId}.mp4`;
    await downloadFile(videoUrl, videoFilePath);
    
    // Envía el video como respuesta
    bot.sendVideo(chatId, videoFilePath);
  } catch (error) {
    console.error('Error:', error.message);
    bot.sendMessage(chatId, 'No se pudo descargar el video.');
  }
});

// Función para obtener los datos de un tweet
function getTweetData(tweetId) {
  const options = {
    hostname: 'api.twitter.com',
    path: `/1.1/statuses/show/${tweetId}.json`,
    method: 'GET',
    headers: {
      Authorization: 'Bearer TUS_TWITTER_BEARER_TOKEN',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Función para elegir la resolución del video
function chooseVideoResolution(variants) {
  const sortedVariants = variants.sort((a, b) => b.bitrate - a.bitrate);
  return sortedVariants[0];
}

// Función para descargar un archivo
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(filePath, () => reject(error));
    });
  });
}
