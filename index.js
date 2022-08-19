const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const moment = require('moment')
const delay = require('delay')
const fs = require('fs')
require('colors')

/**
 * WhatsApp Session
 */
const client = new Client({ authStrategy: new LocalAuth({ clientId: 'client' }), puppeteer: { headless: false } })
client.on('qr', (qr) => { qrcode.generate(qr, { small: true }) })
client.initialize()

/**
 * Main Function
 */
;(async () => {
  try {
    client.on('ready', async () => {
      console.log(`(${moment().format('HH:mm:ss')}) WhatsApp client is ready to use !`)
      const numberList = await fs.readFileSync('./data/number.txt', 'utf8').split(/\r?\n/)
      const messageList = await fs.readFileSync('./data/message.txt', 'utf8').split(/\r?\n/)
      if (numberList.length > 0 && messageList.length > 0) {
        console.log(` -> Loaded "${(numberList.length)}" target number...`.yellow)
        console.log(` -> Loaded "${(messageList.length)}" message format...`.yellow)
        console.log(`(${moment().format('HH:mm:ss')}) Prepare sending message...`)
        while (true) {
          const randomNumber = numberList[Math.floor(Math.random() * numberList.length)]
          const randomMessage = messageList[Math.floor(Math.random() * messageList.length)]
          const sendMessage = await client.sendMessage(`${randomNumber}@c.us`, randomMessage)
          const randomMs = Math.floor(Math.random() * (9 - 1 + 1) + 9)
          console.log(` -> Sending "${(randomNumber.blue.bold)}" : ${randomMessage}`)
          console.log(` -> Message sent successfully with signature id "${(sendMessage.id.id).green}"`)
          console.log(` -- [ Delay ${Number(randomMs * 1000)}ms ] --`.yellow)
          await delay(Number(randomMs * 1000))
        }
      } else {
        throw new Error('Number list or message format is empty !')
      }
    })
  } catch (err) {
    console.log(`(${moment().format('HH:mm:ss')}) ERROR: ${err.message}`.red)
  }
})()