import TelegramBot from 'node-telegram-bot-api';
import { gameOprions, againOptions } from './options.js';
import 'dotenv/config'

const token = process.env.DB_TOKEN;
const bot = new TelegramBot(token, { polling: true })

const chats = {}

const startGame = async (chatid) => {
    await bot.sendMessage(chatid, `Я загадаю цифру от 0 до 9, угадай`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatid] = randomNumber;
    await bot.sendMessage(chatid, `Отгадай какую`, gameOprions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Старт проекта' },
        { command: '/info', description: 'Информация о проекте' },
        { command: '/game', description: 'Поиграем немного' }
    ])
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatid = msg.chat.id
        if (text === '/start') {
            await bot.sendMessage(chatid, `Добро пожаловать`)
            return bot.sendSticker(chatid, 'https://tlgrm.ru/_/stickers/e65/38d/e6538d88-ed55-39d9-a67f-ad97feea9c01/1.webp')
        }
        if (text === '/info') {
            return bot.sendMessage(chatid, `Тебя зовут ${msg.chat.username}`)
        }
        if (text === '/game') {
            return startGame(chatid)
        }

        return bot.sendMessage(chatid, 'Не понял')
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatid = msg.message.chat.id;

        if (msg.data === '/again') {
            return startGame(chatid)
        };

        await bot.sendMessage(chatid, `Ты выбрал цифру ${data}`)
        if (data === JSON.stringify(chats[chatid])) {
            bot.sendMessage(chatid, 'Ты отгадал', againOptions)
        } else {
            bot.sendMessage(chatid, 'Ты не отгадал, пробуй еще', againOptions)
        }
    })
}

start()