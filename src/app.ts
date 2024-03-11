import {
  createBot,
  createFlow,
  MemoryDB,
  createProvider,
  addKeyword,
} from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

const flowBienvenida = addKeyword("Hola").addAnswer("Datos funcionales");
// Función para realizar el reemplazo de variables
function replaceVariables(template, values) {
  return template.replace(/{([^{}]*)}/g, (match, key) => {
    return values[key] || match;
  });
}

const main = async () => {
  const provider = createProvider(BaileysProvider);

  provider.initHttpServer(3002);

  provider.http?.server.post(
    "/send-message",
    handleCtx(async (bot, req, res) => {
      const cleanedNumber = req.body.number.replace(/\+/g, "");

      if (req.body.message_type === "static") {
        await bot.sendMessage(cleanedNumber, req.body.message, {});
      } else if (req.body.message_type === "customized") {
        // Reemplazar variables en el message_template
        const message = replaceVariables(req.body.message_template, req.body);
        await bot.sendMessage(cleanedNumber, message, {});
      } else {
        console.log("Tipo de mensaje no válido");
      }

      res.end("Esto es del server");
    })
  );

  await createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider,
  });
};

main();
