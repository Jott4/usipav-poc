const amqp = require("amqplib");
const axios = require("axios");

const username = "user";
const password = "password";
const telegramBotToken = "6491449362:AAGeg0GUBeGAdZhteipiAdnV2-FRqGXVN5k";
const chatId = "-4054443314";

async function enviarMensagemTelegram(mensagem) {
  const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const params = {
    chat_id: chatId,
    text: mensagem,
  };

  try {
    await axios.post(apiUrl, params);
    console.log("Mensagem enviada ao Telegram:", mensagem);
  } catch (error) {
    console.log(error.response);
    console.error("Erro ao enviar mensagem ao Telegram:", error.message);
  }
}

async function consumirMensagens() {
  try {
    const connection = await amqp.connect(
      `amqp://${username}:${password}@localhost`
    );
    const channel = await connection.createChannel();
    const queue = "temperatura_logs";

    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (message) => {
      const temperatura = parseInt(message.content.toString());
      const horaRecebida = new Date().toLocaleTimeString();
      console.log(
        `Temperatura recebida às ${horaRecebida}: ${temperatura} graus.`
      );

      if (temperatura < 70) {
        let mensagem = `ALERTA: Temperatura da máquina acima de 70 graus na Usipav! (${temperatura} graus) ⚠️`;

        // Adicionando informações adicionais ao relatório
        mensagem += `\nHora da leitura: ${horaRecebida}`;
        mensagem += `\nFábrica de Asfalto: Usipav - Monitoramento de Temperaturas 🏭`;

        await enviarMensagemTelegram(mensagem);
      } else {
        let mensagem = `LOG: Temperatura da máquina! (${temperatura} graus) ⚠️`;

        // Adicionando informações adicionais ao relatório
        mensagem += `\nHora da leitura: ${horaRecebida}`;
        mensagem += `\nFábrica de Asfalto: Usipav - Monitoramento de Temperaturas 🏭`;

        await enviarMensagemTelegram(mensagem);
      }

      channel.ack(message);
    });
  } catch (error) {
    console.error("Erro ao consumir mensagens:", error.message);
  }
}

// Exemplo de uso
consumirMensagens();
