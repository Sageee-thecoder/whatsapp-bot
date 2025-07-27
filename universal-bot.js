const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server listening on port ${PORT}`);
});

console.log('🚀 Starting Universal WhatsApp Bot...');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "universal-bot" }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
        ]
    }
});

let botNumber = '';
const startTime = Date.now();
const greetedNumbers = new Set();

client.on('qr', (qr) => {
    console.log('📱 QR Code received, scan with your phone:');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('✅ Authentication successful!');
});

client.on('ready', async () => {
    console.log('✅ WhatsApp Bot is ready!');
    const info = client.info;
    botNumber = info.wid.user;
    console.log(`📞 Connected as: ${info.pushname} (${botNumber})`);

    try {
        const chatId = botNumber + '@c.us';
        await client.sendMessage(chatId, '🤖 Universal Bot is now online! Send /help in any chat for commands.');
        console.log('✅ Sent startup message to yourself');
    } catch (error) {
        console.log('ℹ️ Could not send startup message:', error.message);
    }
});

client.on('message_create', async (message) => {
    // Otomatik selamlama
    if (!message.fromMe && message.type === 'chat' && message.body) {
        try {
            if (!greetedNumbers.has(message.from)) {
                const contact = await client.getContactById(message.from);
                if (!contact.isMyContact) {
                    await client.sendMessage(message.from, `Hello 👋, it seems like I'm not online right now. But hey, you can try my bot with the /help command in the meanwhile, I'll return as soon as possible, take care <3.`);
                    greetedNumbers.add(message.from);
                    console.log(`🤖 Otomatik selam gönderildi: ${message.from}`);
                }
            }
        } catch (err) {
            console.error('🤖 Otomatik selamda hata:', err);
        }
    }

    if (message.fromMe) return;
    if (message.type !== 'chat' || !message.body.startsWith('/')) return;

    const messageBody = message.body.toLowerCase().trim();

    // Chat türü ve adı
    let chatType = 'Unknown';
    let chatName = 'Unknown';

    if (message.to.includes('@g.us')) {
        chatType = 'Group';
        try {
            const chat = await client.getChatById(message.to);
            chatName = chat.name || 'Unknown Group';
        } catch {
            chatName = 'Unknown Group';
        }
    } else if (message.to.includes('@c.us')) {
        chatType = 'Individual';
        try {
            const chat = await client.getChatById(message.to);
            chatName = chat.name || message.to.replace('@c.us', '');
        } catch {
            chatName = message.to.replace('@c.us', '');
        }
    }

    console.log(`💬 Chat Type: ${chatType} - ${chatName}`);

    try {
        let response = '';

        switch (true) {
            case messageBody === '/help':
            case messageBody === '/start':
                response = `🤖 *WhatsApp Universal Bot Commands:*

Available commands:
• /help - Show this help message
• /ping - Check if bot is online
• /uptime - Show bot uptime
• /time - Get current time
• /joke - Get a random joke
• /quote - Get a motivational quote
• /info - Get bot information
• /echo [text] - Echo your message
• /whoami - Show your info
• /chatinfo - Show chat information
• /tagall - Tags all the group members
• /kick @user - Kick user(s) from group
• /promote @user - Promote user(s) to admin
• /roll - Roll a number 1-100
• /remindme <time> <msg> - Set a reminder
• /spam <count> <message> - Spam a message multiple times
• /restart - Restart the bot (requires process manager)
• /shutdown - Shut down the bot

📍 This bot responds to EVERYONE's commands in any chat!`;
                break;

            case messageBody === '/ping':
                response = `🏓 Pong! Bot is online and working in ${chatType}: ${chatName}`;
                break;

            case messageBody === '/uptime': {
                const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
                const hours = Math.floor(uptimeSeconds / 3600);
                const minutes = Math.floor((uptimeSeconds % 3600) / 60);
                const seconds = uptimeSeconds % 60;
                response = `⏱️ Bot uptime: ${hours}h ${minutes}m ${seconds}s`;
                break;
            }

            case messageBody === '/time':
                response = `🕐 Current time: ${new Date().toLocaleString()}`;
                break;

            case messageBody === '/joke': {
                const jokes = [
                    "Why don't scientists trust atoms? Because they make up everything!",
                    "Why did the scarecrow win an award? He was outstanding in his field!",
                    "Why don't eggs tell jokes? They'd crack each other up!",
                    "What do you call a bear with no teeth? A gummy bear!",
                    "Why did the math book look so sad? Because it had too many problems!",
                    "What do you call a fake noodle? An impasta!",
                    "Why don't skeletons fight each other? They don't have the guts!",
                    "What do you call a sleeping bull? A bulldozer!",
                    "Why did the coffee file a police report? It got mugged!",
                    "What's the best thing about Switzerland? I don't know, but the flag is a big plus!"
                ];
                response = `😂 ${jokes[Math.floor(Math.random() * jokes.length)]}`;
                break;
            }

            case messageBody === '/quote': {
                const quotes = [
                    "Believe you can and you're halfway there. – Theodore Roosevelt",
                    "Do one thing every day that scares you. – Eleanor Roosevelt",
                    "Keep your face always toward the sunshine—and shadows will fall behind you. – Walt Whitman",
                    "The only way to do great work is to love what you do. – Steve Jobs",
                    "The best way out is always through. – Robert Frost"
                ];
                response = `💡 Motivational Quote:\n"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
                break;
            }

            case messageBody === '/info':
                response = `🤖 *Bot Information:*

Name: WhatsApp Universal Bot
Version: 1.0.0
Status: Online ✅
Uptime: ${Math.floor(process.uptime())} seconds
Node.js: ${process.version}
Bot Number: ${botNumber}
Current Chat: ${chatType} - ${chatName}

This bot responds to EVERYONE's commands in any chat!`;
                break;

            case messageBody === '/whoami':
                response = `👤 *Your Information:*

Your Number: ${message.from}
Your Message ID: ${message.id._serialized || message.id}
Chat Type: ${chatType}
Chat Name: ${chatName}
Chat ID: ${message.to}`;
                break;

            case messageBody === '/chatinfo':
                response = `📊 *Chat Information:*

Chat Type: ${chatType}
Chat Name: ${chatName}
Chat ID: ${message.to}
Your Number: ${message.from}
Message Timestamp: ${new Date(message.timestamp * 1000).toLocaleString()}`;
                break;

            case messageBody.startsWith('/echo '): {
                const echoText = message.body.slice(6);
                response = `🔄 You said: ${echoText}`;
                break;
            }

            case messageBody === '/restart':
                await client.sendMessage(message.to, '♻️ Restarting the bot...');
                console.log('♻️ Restart command received, shutting down...');
                setTimeout(() => process.exit(0), 1000);
                return;

            case messageBody === '/shutdown':
                await client.sendMessage(message.to, '🛑 Shutting down the bot...');
                console.log('🛑 Shutdown command received, shutting down...');
                setTimeout(() => process.exit(0), 1000);
                return;

            case messageBody === '/tagall': {
                const chat = await client.getChatById(message.to);
                if (!chat.isGroup) {
                    response = '⚠️ This command only works in groups!';
                    break;
                }

                let mentions = [];
                let mentionText = '📣 *Tagging everyone:*\n\n';

                for (let participant of chat.participants) {
                    const contact = await client.getContactById(participant.id._serialized);
                    mentions.push(contact);
                    mentionText += `@${contact.number} `;
                }

                await chat.sendMessage(mentionText, { mentions });
                console.log('✅ Tagall message sent!');
                return;
            }

            case messageBody.startsWith('/kick '): {
                const chat = await client.getChatById(message.to);
                if (!chat.isGroup) {
                    response = '⚠️ This command only works in groups!';
                    break;
                }

                const botContact = await client.getContactById(botNumber + '@c.us');
                const botIsAdmin = chat.participants.find(p => p.id._serialized === botContact.id._serialized)?.isAdmin;
                if (!botIsAdmin) {
                    response = '❌ I must be an admin to kick users.';
                    break;
                }

                const mentions = message.mentionedIds;
                if (!mentions || mentions.length === 0) {
                    response = '❗ Please mention a user to kick. Example: /kick @1234567890';
                    break;
                }

                try {
                    await chat.removeParticipants(mentions);
                    response = `✅ User(s) kicked successfully.`;
                } catch (error) {
                    response = `❌ Could not kick user(s): ${error.message}`;
                }
                break;
            }

            case messageBody.startsWith('/promote '): {
                const chat = await client.getChatById(message.to);
                if (!chat.isGroup) {
                    response = '⚠️ This command only works in groups!';
                    break;
                }

                const botContact = await client.getContactById(botNumber + '@c.us');
                const botIsAdmin = chat.participants.find(p => p.id._serialized === botContact.id._serialized)?.isAdmin;
                if (!botIsAdmin) {
                    response = '❌ I need to be admin to promote users.';
                    break;
                }

                const mentions = message.mentionedIds;
                if (!mentions || mentions.length === 0) {
                    response = '❗ Please mention a user to promote. Example: /promote @1234567890';
                    break;
                }

                try {
                    await chat.promoteParticipants(mentions);
                    response = `✅ User(s) promoted to admin successfully.`;
                } catch (error) {
                    response = `❌ Could not promote user(s): ${error.message}`;
                }
                break;
            }

            case messageBody === '/roll': {
                const roll = Math.floor(Math.random() * 100) + 1;
                response = `🎲 You rolled a ${roll}!`;
                break;
            }

            case messageBody.startsWith('/remindme '): {
                const args = message.body.slice(9).trim().split(' ');
                if (args.length < 2) {
                    response = '❗ Usage: /remindme <time> <message>\nExample: /remindme 10m Take a break';
                    break;
                }

                const timeArg = args[0];
                const reminderMsg = args.slice(1).join(' ');

                const timeMatch = timeArg.match(/^(\d+)([smh])$/);
                if (!timeMatch) {
                    response = '❗ Invalid time format! Use s=seconds, m=minutes, h=hours. Example: 10m';
                    break;
                }

                let delayMs;
                const value = parseInt(timeMatch[1], 10);
                switch (timeMatch[2]) {
                    case 's': delayMs = value * 1000; break;
                    case 'm': delayMs = value * 60000; break;
                    case 'h': delayMs = value * 3600000; break;
                    default:
                        response = '❗ Unknown time unit! Use s, m, or h.';
                        break;
                }

                response = `⏰ Reminder set for ${timeArg} from now: "${reminderMsg}"`;
                await client.sendMessage(message.to, response);

                setTimeout(async () => {
                    try {
                        await client.sendMessage(message.to, `⏰ Reminder: ${reminderMsg}`);
                    } catch (error) {
                        console.error('Failed to send reminder:', error);
                    }
                }, delayMs);

                return;
            }

            case messageBody.startsWith('/spam '): {
                const args = message.body.split(' ');
                if (args.length < 3) {
                    response = '❗ Usage: /spam <count> <message>';
                    break;
                }

                let count = parseInt(args[1], 10);
                if (isNaN(count) || count < 1 || count > 10) {
                    response = '❗ Count must be a number between 1 and 10 to prevent abuse.';
                    break;
                }

                const spamMessage = args.slice(2).join(' ');
                response = `📨 Sending "${spamMessage}" ${count} times...`;
                await client.sendMessage(message.to, response);

                for (let i = 0; i < count; i++) {
                    await client.sendMessage(message.to, spamMessage);
                }

                return;
            }

            default:
                response = `❌ Unknown command: ${messageBody}\nType /help to see available commands.`;
                break;
        }

        if (response) {
            await client.sendMessage(message.to, response);
            console.log('✅ Response sent successfully!');
        }
    } catch (error) {
        console.error('❌ Error processing message:', error);
        try {
            await client.sendMessage(message.to, '❌ Sorry, something went wrong. Please try again.');
            console.log('✅ Error message sent!');
        } catch (replyError) {
            console.error('❌ Failed to send error message:', replyError);
        }
    }
});

client.on('disconnected', (reason) => {
    console.log('❌ Bot disconnected:', reason);
});

client.on('auth_failure', (message) => {
    console.error('❌ Authentication failed:', message);
});

client.initialize();

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down bot...');
    try {
        await client.destroy();
    } catch (error) {
        console.log('Error during shutdown:', error);
    }
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection:', reason);
});

console.log('⏳ Bot is starting up...');
console.log('📱 Scan the QR code when it appears');
console.log('💡 After connecting, send commands in ANY chat!');
console.log('🔍 Bot will respond to EVERYONE\'S commands in:');
console.log('   • Individual chats with friends');
console.log('   • Group chats');
console.log('   • Your own chat');
console.log('⚠️  Only processes messages starting with /');
console.log('💬 Try sending /help in any chat after connecting');
