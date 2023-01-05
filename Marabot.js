const Discord = require("discord.js");
const {Intents} =require("discord.js");
const client = new Discord.Client({ intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]  }); 

const { token } = require('./config.json');
const uuid = require('uuid');


// Reemplaza el ID de proyecto y la clave privada por los de tu proyecto Dialogflow
const projectId = "nzbot-qeei";
const sessionId = uuid.v4();
const languageCode = "es-ES";
const dialogflow = require("dialogflow");
const sessionClient = new dialogflow.SessionsClient({keyFilename: "nzbot-qeei-5be854ffceb8.json"});


client.once("ready",(bot)=>{
    console.log(`${bot.user.username} esta preparado :)`);
    client.user.setActivity(`a Messi campeon desde el cielo`,{
        type:"WATCHING"
    });
  }
  );


client.on("messageCreate", message => {
  // Ignorar mensajes enviados por el bot
  if (message.author.bot) return;

  if(message.channel.type === "dm") return;
    if(message.author.bot) return;

    let prefix = ".";

    if(!message.content.startsWith(prefix)) return;


  // Crear una sesión de Dialogflow
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // Crear un request de entrada para Dialogflow
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message.content,
        languageCode: languageCode
      }
    }
  };

  // Enviar el request a Dialogflow y obtener la respuesta
  sessionClient
    .detectIntent(request)
    .then(responses => {
      const result = responses[0].queryResult;

      // Enviar la respuesta de Dialogflow al canal de Discord
      message.channel.send(result.fulfillmentText);
    })
    .catch(err => {
      console.error("Error al enviar el request a Dialogflow:", err);
    });
});

// Iniciar el bot de Discord
client.login(token);
