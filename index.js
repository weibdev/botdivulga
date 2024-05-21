const { Telegraf } = require('telegraf')
const Database = require("./db")

const bot = new Telegraf("7044550410:AAHdcbnia7Xme5fz5Rvn2KQ6UbPkfrdNYSw")

const CheckAdm = (id) => {
    if(id == '6141024093' || id == '5406567086' || id == '6929169125') return true
    else return false
}

console.log(CheckAdm('5406567086'))

//===========================================
//          CANAIS
//===========================================

//#region  Canais

bot.command("canais", async (ctx) => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")

    const Channels = await Database.GetChannels()
    var text = ""

    Channels.forEach(c => text += c + "\n")

    ctx.reply(`<b>Canais cadastrados(${Channels.length}): </b>
    
${text}`, { parse_mode: 'HTML' })
})

bot.command("addCanal", (ctx) => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        ctx.args.map(async c => {
        const add = await Database.AddChannel(c)
        if (add.error) ctx.reply("Erro ao adicionar: " + c)
        if (!add.error) ctx.reply(c + " Adicionado com sucesso!")
    })
})

bot.command("rmCanal", (ctx) => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        ctx.args.map(async c => {
        const add = await Database.RemoveChannel(c)
        if (add.error) ctx.reply("Erro ao remover: " + c)
        if (!add.error) ctx.reply(c + " Removido com sucesso!")
    })
})

//#endregion



//===========================================
//          MENSAGENS
//===========================================

//#region Mensagem 

bot.command("newMsg", async ctx => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")

    if(ctx.chat.id == '6141024093' || ctx.chat.id == '5406567086' || ctx.chat.id == '6929169125') {}

    const message = ctx.text.replace("/newMsg ", "")

    const newMessage = await Database.NewMessage(message)

    if (newMessage.error) return ctx.reply("Houve um erro!")
    else {
        const msg = `**Mensagem Adicionada com sucesso!**
        
id: ${"`"}${newMessage.id}${"`"}`

        ctx.reply(msg, { parse_mode: "Markdown" })
    }

})

bot.command("rmMsg", async ctx => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        const id = ctx.args[0]

    const rm = await Database.RmMessage(id)

    if (rm.error) ctx.reply("Houve um erro!")
    else ctx.reply("Mensagem deletada com sucesso!")
})

bot.command("msgs", async ctx => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        const msgs = await Database.GetMessages()
    var txt = ""

    msgs.map(m => {
        txt += `*MENSAGEM: * ${"`"}${m.id}${"`"}
*ATIVO:* ${m.active ? "*SIM*" : "*NÃO*"}

==================================
    
`
    })

    const msg = `*Mensagens (${msgs.length}):*
    
${txt}`

    ctx.reply(msg, { parse_mode: "Markdown" })
})

bot.command("msg", async ctx => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        const id = ctx.args[0]

    const message = await Database.GetMessage(id)

    if (message.img) return ctx.sendPhoto(message.img, { caption: message.msg, parse_mode: "HTML" })
    else ctx.reply(message.msg, { parse_mode: "HTML" })
})

bot.command("setImgMsg", async ctx => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        const id = ctx.args[0]
    const img = ctx.args[1]

    const set = await Database.SetImgMsg(id, img)

    if (set.error) return ctx.reply("Houve um erro!")
    else return ctx.reply("Imagem adicionado com sucesso!")
})

bot.command("startMsg", async (ctx) => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        const id = ctx.args[0]
    const time = ctx.args[1]

    await Database.SetMsgOn(id)

    const Interval = setInterval(async () => {
        const message = await Database.GetMessage(id)

        if(message.active) {
            const channels = await Database.GetChannels()

            channels.forEach(c => {
                try {
                    
                    if (message.img)  bot.telegram.sendPhoto(c, message.img, { caption: message.msg, parse_mode: "HTML"})
                    else bot.telegram.sendMessage(c, message.msg, { parse_mode: "HTML"})
                    
            } catch {
                console.log(`Não consegui enviar msg no canal: ${c}` );
            }
        })
    }
    else {
        clearInterval(Interval)
    }      
}, time * 60 * 1000)
ctx.reply("A mensagem esta rodando!")
})

bot.command("stopMsg", async ctx => {
    if(!CheckAdm(ctx.chat.id)) return ctx.reply("Você não pode usar esse bot!")
        const id = ctx.args[0]
    
    const set = await Database.SetMsgOff(id)

    if (set.error) ctx.reply("Houve um erro!")
    else ctx.reply("A Mensagem parou de ser enviada!")
})
//#endregion

bot.launch(() => {
    console.log("bot DIVULGAÇÃO ON!")
})