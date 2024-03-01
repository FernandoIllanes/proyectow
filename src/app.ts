import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from '@bot-whatsapp/bot'
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('Hola').addAnswer('Datos filtrados subidos a Google Sheets')

const main = async () => {
    
    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)
    
    provider.http?.server.post('/send-message', handleCtx(async (bot, req, res) => {
        await bot.sendMessage('59199999999', 'Datos filtrados subidos a Google Sheets', {})
        res.end('esto es del server')
    }))

    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    })
}

main()