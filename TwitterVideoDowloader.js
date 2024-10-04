const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Telegram bot access token and Twitter Bearer Token
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// Create bot object
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Directory to temporarily save videos
const TEMP_DIR = path.join(__dirname, 'temp');

// Ensure the temporary directory exists
fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

// Handler for messages with links
bot.onText(/https?:\/\/(?:www\.)?twitter\.com\/\w+\/status\/(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tweetId = match[1];
  
  try {
    await bot.sendMessage(chatId, 'Processing the tweet...');
    const tweetData = await getTweetData(tweetId);
    const videoData = chooseVideoResolution(tweetData.extended_entities.media[0].video_info.variants);
    const videoUrl = videoData.url;
    
    // Download the video
    const videoFilePath = path.join(TEMP_DIR, `video_${tweetId}.mp4`);
    await downloadFile(videoUrl, videoFilePath);
    
    // Send the video as a response
    await bot.sendVideo(chatId, videoFilePath, {
      caption: `Video downloaded from Twitter.\nResolution: ${videoData.resolution || 'Unknown'}\nBitrate: ${videoData.bitrate ? (videoData.bitrate / 1000000).toFixed(2) + ' Mbps' : 'Unknown'}`
    });
    // Delete the temporary file
    await fs.unlink(videoFilePath);
  } catch (error) {
    console.error('Error:', error.message);
    bot.sendMessage(chatId, `Error: ${error.message}`);
  }
});

// Function to get tweet data
async function getTweetData(tweetId) {
  try {
    const response = await axios.get(`https://api.twitter.com/1.1/statuses/show/${tweetId}.json`, {
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Could not get tweet information: ${error.message}`);
  }
}

// Function to choose video resolution
function chooseVideoResolution(variants) {
  const mp4Variants = variants.filter(v => v.content_type === 'video/mp4' && v.bitrate);
  const sortedVariants = mp4Variants.sort((a, b) => b.bitrate - a.bitrate);
  const chosen = sortedVariants[0];
  
  // Extract resolution from URL if available
  const resolutionMatch = chosen.url.match(/\/(\d+x\d+)\//);
  if (resolutionMatch) {
    chosen.resolution = resolutionMatch[1];
  }
  
  return chosen;
}

// Function to download a file
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

// Handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Bot is running...');
