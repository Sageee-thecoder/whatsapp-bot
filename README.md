# WhatsApp Bot

A simple WhatsApp bot built with Node.js that can respond to various commands and automate tasks.

## Features

- 🤖 Automated responses to commands
- 📱 QR code authentication
- 🕐 Time and date information
- 😂 Random jokes
- 🌤️ Weather information (placeholder)
- 📊 Bot information and status

## Prerequisites

- Node.js (version 14 or higher)
- WhatsApp account
- Chrome/Chromium browser (for Puppeteer)

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the bot:
   ```bash
   node bot.js
   ```

2. Scan the QR code with your WhatsApp app:
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Tap "Link a Device"
   - Scan the QR code displayed in the terminal

3. Once connected, the bot will start listening for messages

## Available Commands

- `/help` - Show help message with all commands
- `/ping` - Check if bot is online
- `/time` - Get current time
- `/joke` - Get a random joke
- `/info` - Get bot information
- `/weather [city]` - Get weather info (placeholder)

## How It Works

The bot uses `whatsapp-web.js` library which:
- Connects to WhatsApp Web
- Uses Puppeteer to control a headless Chrome browser
- Listens for incoming messages
- Responds based on predefined commands

## Important Notes

- ⚠️ This bot is for educational and legitimate automation purposes only
- 📱 Keep your phone connected to the internet for the bot to work
- 🔒 Session data is stored locally for authentication
- 🚫 Do not use this for spam or harassment

## Customization

You can easily add more commands by modifying the `switch` statement in `bot.js`. Examples:

```javascript
case '/custom':
    await message.reply('Your custom response here!');
    break;
```

## Troubleshooting

- If the bot doesn't connect, try restarting and scanning the QR code again
- Make sure your phone has internet connection
- Check that WhatsApp Web is not open in any browser tabs
- For Windows users, make sure you have the Visual C++ Redistributable installed

## Legal Disclaimer

This bot is created for educational purposes. Make sure to:
- Comply with WhatsApp's Terms of Service
- Respect other users' privacy
- Use automation responsibly
- Not send spam or unwanted messages

## Contributing

Feel free to fork this project and add new features! Some ideas:
- Weather API integration
- Database storage for user preferences
- More interactive commands
- File sharing capabilities
- Group management features
