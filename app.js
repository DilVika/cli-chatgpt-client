const axios = require('axios');
const readline = require('readline');
require('dotenv').config();
const { PassThrough } = require('stream');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const API_KEY = process.env.OPENAI_API_KEY;

const GPT_URL = 'https://api.openai.com/v1/chat/completions';


const stream = new PassThrough();

const prompt = () => {
    rl.question('You: ', (message) => {
        if (message === 'exit') {
            rl.close();
            return;
        }
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
                console.log('added');
                printTheAnswer();
                // console.log('\x1b[36m%s\x1b[0m', `ChatGPT: ${response.data.choices[0].message.content}`);
                // prompt();
            })
            .catch(error => {
                // console.log(`Bearer ${temp_key}`)
                // console.error(error);
                console.log(error.data);
                prompt();
            });
    });
};

const printTheAnswer = () => {
    stream.on('end', () => {
        console.log('Stream ended');
        prompt();
    });

    stream.on('data', (data) => {

        if (data.toString().includes("[DONE]")) {
            // prompt();
            console.log('done data');
        } else {
            const prepareStr = data.toString().replace("data: ", '');
            const responseObj = JSON.parse(prepareStr);
            console.log('\x1b[36m%s\x1b[0m', `ChatGPT: ${responseObj.choices[0].delta.content}`);
        }
    });


}




prompt();

