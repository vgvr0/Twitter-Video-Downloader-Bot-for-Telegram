# Twitter Video Download Bot

A Telegram bot that downloads and sends videos from Twitter links. This bot automatically detects Twitter links in messages, downloads the associated videos in the highest available quality, and sends them back to the chat.

## Features

- Automatically detects Twitter video links in messages
- Downloads videos in the highest available quality
- Provides video resolution and bitrate information
- Handles temporary file management
- Includes error handling and logging

## Prerequisites

- Node.js (12.x or higher)
- npm or yarn package manager
- Telegram Bot Token
- Twitter Bearer Token

## Required Dependencies

```bash
npm install node-telegram-bot-api axios dotenv
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
TELEGRAM_TOKEN=your_telegram_bot_token
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd twitter-video-bot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables as described above

4. Run the bot:
```bash
node index.js
```

## Usage

1. Add the bot to a Telegram chat
2. Send a Twitter link containing a video
3. The bot will process the link and send back the video file

Example:
```
User: https://twitter.com/username/status/123456789
Bot: Processing the tweet...
[Bot sends video with resolution and bitrate information]
```

## Project Structure

- `index.js`: Main bot logic
- `temp/`: Temporary directory for video downloads (created automatically)
- `.env`: Environment variables configuration

## Features in Detail

- **Video Quality Selection**: Automatically selects the highest quality version available
- **Temporary File Management**: Downloads are stored temporarily and cleaned up after sending
- **Error Handling**: Comprehensive error handling for network issues and API failures
- **Resolution Information**: Provides video resolution and bitrate details with each download

## Error Handling

The bot includes handlers for:
- Network failures
- Invalid Twitter links
- Missing video content
- API rate limiting
- Uncaught exceptions
- Unhandled promise rejections

## Contributing

Feel free to submit issues and pull requests.

## Disclaimer

This bot is intended for personal use and should be used in accordance with Twitter's terms of service and API usage guidelines.
