import axios from 'axios';
import {api_key} from "./api_key";

export const openAIRequest = async (text: string) => {
    const apiKey = api_key.key;
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(url, {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {"role": "system", "content": "You're seeking health suggestions. Let's discuss available options."},
                {"role": "assistant", "content": "  "},
                {"role": "system", "content": "You're seeking health suggestions. Let's discuss available options."},
                {"role": "assistant", "content": "You: \"I'm experiencing " + text + ". What are some effective medicines or home remedies I can try?\""},
                {"role": "user", "content": text},
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        // Handle the response
        console.log(response.data);
        return response;
    } catch (error) {
        // Handle any errors
        console.error(error);
    }
};