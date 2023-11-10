const amqp = require("amqplib");

const username = "user";
const password = "password";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enviarTemperatura() {
  try {
    const connection = await amqp.connect(
      `amqp://${username}:${password}@localhost`
    );
    const channel = await connection.createChannel();
    const queue = "temperatura_logs";

    await channel.assertQueue(queue, { durable: false });

    setInterval(async () => {
      const temperatura =
        Math.random() < 0.7
          ? getRandomTemperatureBelow100()
          : getRandomTemperatureAbove100();
      channel.sendToQueue(queue, Buffer.from(temperatura.toString()));
      console.log(`Temperatura enviada com sucesso: ${temperatura} graus.`);
    }, 2000);
  } catch (error) {
    console.error("Erro ao enviar temperatura:", error.message);
  }
}

function getRandomTemperatureBelow100() {
  return Math.floor(Math.random() * 100);
}

function getRandomTemperatureAbove100() {
  return Math.floor(Math.random() * (100 - 101) + 101);
}

// Exemplo de uso
enviarTemperatura();
