const axios = require('axios');
const { API_KEY_OPEN_AI } = require('./config');

const ChatAIHandler = async (text, msg) => {
    if (text.startsWith('/cps')) {
        return msg.reply('Maaf, perintah /cps sudah tidak digunakan lagi. Anda bisa langsung bertanya tanpa menggunakan /cps.');
    }

    msg.reply('Sedang diproses, tunggu sebentar ya.');

    // Periksa apakah pertanyaan berakhir dengan tanda tanya
    const endsWithQuestionMark = text.trim().endsWith("?");
    
    if (!endsWithQuestionMark) {
        // Jika tidak berakhir dengan tanda tanya, Anda dapat memberikan tanggapan khusus
        return msg.reply('Maaf, pertanyaan harus di akhiri dengan tanda tanya ?');
    }

    const response = await ChatGPTRequest(text);

    if (!response.success) {
        return msg.reply(response.message);
    }

    return msg.reply(response.data);
}

const ChatGPTRequest = async (text) => {
    const result = {
        success: false,
        data: "Aku gak tau",
        message: "",
    }

    return await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        data: {
            model: "text-davinci-003",
            prompt: text,
            max_tokens: 2000,
            temperature: 0
        },
        headers: {
            "accept": "application.json",
            "Content-Type": "application/json",
            "Accept-Language": "in-ID",
            "Authorization": `Bearer ${API_KEY_OPEN_AI}`,
        },
    })
    .then((response) => {
        if (response.status == 200) {
            const { choices } = response.data;
            if (choices && choices.length) {
                result.success = true;
                result.data = choices[0].text;
            }
        } else {
            result.message = "Failed response";
        }
        return result;
    })
    .catch((error) => {
        result.message = "Error: " + error.message;
        return result;
    });
}

module.exports = {
    ChatAIHandler
}
