const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { ChatAIHandler } = require('./feature/chat_ai');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {

    const text = msg.body.toLowerCase() || '';

    // Check status
    if (text === '!ping') {
        msg.reply('pong');
    }
   
    // You can directly call ChatAIHandler
    await ChatAIHandler(text, msg);
});

client.initialize();
