const axios = require('axios');
const readline = require('readline');
require('dotenv').config();
const { PassThrough } = require('stream');

const { CONSOLE_COLORS } = require('./helpers');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const API_KEY = process.env.OPENAI_API_KEY;

const GPT_URL = 'https://api.openai.com/v1/chat/completions';



const prompt = () => {
    const stream = new PassThrough();
    console.log(CONSOLE_COLORS.fgWhite, '');
    rl.question('You: ', (message) => {
        if (message === 'exit') {
            stream.end(true);
            rl.close();
            return;
        }
        CONSOLE_COLORS.setColor(CONSOLE_COLORS.fgCyan);
        process.stdout.write('ChatGPT: ');
        axios.post(GPT_URL, {
            model: "gpt-3.5-turbo",
            temperature: 0.7,
            stream: true,
            messages: [{
                role: "user",
                content: message ?? 'empty'
            }],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            responseType: 'stream',
        })
            .then(response => {
                response.data.pipe(stream);
                // console.log('added');
                printTheAnswer(stream);
            })
            .catch(error => {
                console.error(error.response.status);
                console.error(error.response.statusText);
                prompt();
            });
    });
};

const printTheAnswer = (stream) => {
    stream.on('end', (isTerminated) => {
        console.warn(CONSOLE_COLORS.fgYellow, '<Stream ended>');
        if (!isTerminated) {
            prompt();
        }
    });
    // process.stdout.write('ChatGPT: ');
    stream.on('data', (data) => {

        if (data.toString().includes("[DONE]")) {
            console.info(CONSOLE_COLORS.fgGreen, '\n<Answer is ready>');
        } else {
            const prepareStr = data.toString().replace("data: ", '');
            const responseObj = JSON.parse(prepareStr);
            // console.log('\x1b[36m%s\x1b[0m', `ChatGPT: ${responseObj.choices[0].delta.content}`);
            // Cheeck if the answer is ready, valid data, not undefined or null or an object
            if (responseObj.choices[0].delta.content) {
                process.stdout.write(responseObj.choices[0].delta.content);
            }
        }
    });


};


prompt();

