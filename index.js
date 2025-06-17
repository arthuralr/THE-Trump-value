require('dotenv').config(); 
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch'); // Certifique-se de que está usando node-fetch v2 ou v3 conforme sua versão do Node.js

const client = new Client({  
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {  
  console.log(`✅ Bot está online como ${client.user.tag}`);
}); 

function obterHoraAtual() {
  const data = new Date(); 
  const horas = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  const segundos = String(data.getSeconds()).padStart(2, '0');
  return `${horas}:${minutos}:${segundos}`;
}

async function obterCotacoes() {
  const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
  const data = await response.json();
  return {
    dolar: parseFloat(data.USDBRL.bid).toFixed(2),
    euro: parseFloat(data.EURBRL.bid).toFixed(2),
    btc: parseFloat(data.BTCBRL.bid).toFixed(2),
  };
}

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const comando = message.content.toLowerCase(); // trata tudo em minúsculas para evitar erros

  try {
    if (comando === '!dolar') {
      const { dolar } = await obterCotacoes();
      const hora = obterHoraAtual();
      message.reply(`💱 **Cotação Atualizada: ${hora}**\n- 💵 Dólar: R$ ${dolar}`);
    }

    else if (comando === '!euro') {
      const { euro } = await obterCotacoes();
      const hora = obterHoraAtual();
      message.reply(`💱 **Cotação Atualizada: ${hora}**\n- 💶 Euro: R$ ${euro}`);
    }

    else if (comando === '!btc' || comando === '!bitcoin') {
      const { btc } = await obterCotacoes();
      const hora = obterHoraAtual();
      message.reply(`💱 **Cotação Atualizada: ${hora}**\n- ₿ Bitcoin: R$ ${btc}`);
    }

    else if (comando === '!cotacao') {
      const { dolar, euro, btc } = await obterCotacoes();
      const hora = obterHoraAtual();
      message.reply(`💱 **Cotações Atualizadas: ${hora}**\n- 💵 Dólar: R$ ${dolar}\n- 💶 Euro: R$ ${euro}\n- ₿ Bitcoin: R$ ${btc}`);
    }

    else if (comando === '!help') {
      message.reply('Para usar a o bot digite os seguintes comandos:');
      message.reply('!-help | para OBTER ajuda (RETIRE O TRAÇO DO COMANDO)');
      message.reply('!-dolar | para obter o ACESSO a cotação do dolar(RETIRE O TRAÇO DO COMANDO!)');
      message.reply('!-euro | para obter o ACESSO a cotação do euro/brl(RETIRE O TRAÇO DO COMANDO!)');
      message.reply('!-btc |para obter ACESSO a cotação do BTC/BRL (RETIRE O TRAÇO DO COMANDO!')
      message.reply('!cotacao | para ver todas as cotações disponiveis (RETIRE O TRAÇO DO COMANDO!)')
    }              

  } catch (error) {
    console.error('Erro ao buscar cotações:', error);
    message.reply('❌ Ocorreu um erro ao buscar as cotações.');
  }
});

client.login(process.env.TOKEN);
