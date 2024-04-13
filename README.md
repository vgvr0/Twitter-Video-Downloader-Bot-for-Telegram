# Twitter Video Downloader Bot for Telegram

This is a Telegram bot that allows users to download videos from Twitter by sending a tweet URL. The bot extracts the video from the tweet and sends it back to the user.

## Features
- Download videos from Twitter by sending a tweet URL
- Automatically selects the highest resolution video available
- Easy to set up and use

## Prerequisites
- Node.js installed on your system
- A Telegram bot token obtained from the BotFather
- A Twitter Bearer token for authentication

## Installation
1. Clone the repository or download the source code files.
2. Install the required dependencies by running the following command:

```
npm install
```

3. Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token in the code.
4. Replace 'YOUR_TWITTER_BEARER_TOKEN' with your actual Twitter Bearer token in the code.
5. Run the bot using the following command:

```
node index.js
```

## Usage
1. Start a conversation with your Telegram bot.
2. Send a tweet URL containing a video to the bot.
3. The bot will download the video and send it back to you as a response.

## Dependencies
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api): A library for interacting with the Telegram Bot API.
- [https](https://nodejs.org/api/https.html): A built-in Node.js module for making HTTPS requests.
- [fs](https://nodejs.org/api/fs.html): A built-in Node.js module for file system operations.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

## Acknowledgments
This bot was created using the node-telegram-bot-api library.
Thanks to the Twitter API for providing access to tweet data.

## Disclaimer
Please note that downloading videos from Twitter may be subject to their terms of service and copyright policies. Use this bot responsibly and respect the rights of content creators.
