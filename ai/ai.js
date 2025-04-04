import axios from 'axios'
import 'dotenv/config'

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

const sendRequestToMistralAi = async (text) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                model: 'mistral-large-latest',
                messages: [
                    {
                        role: 'system',
                        content: 'Ты искуственный интелект в телеграм канале. Отвечай всегда на русском языке и твои ответы должны выглядить как пост в телеграм канале с правильной версткой'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            }
        )
        return response.data.choices[0].message.content
    } catch (error) {
        console.error('Ошибка при запросе', error.response)
        return 'Упс, произошла ошибка, попробуйте позже'
    }
}

export default sendRequestToMistralAi