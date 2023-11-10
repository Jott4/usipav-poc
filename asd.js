const { faker } = require("@faker-js/faker");
const { Pool } = require("pg");

// Configuração de conexão com o banco de dados
const pool = new Pool({
  user: "metabase",
  host: "localhost",
  database: "usipav",
  password: "metabase_password",
  port: 5432,
});

// Função para gerar valores aleatórios para Machines
async function generateMachinesValues() {
  const machinesValues = [];

  for (let i = 1; i <= 5; i++) {
    const machineName = faker.company.name();
    machinesValues.push(`('${machineName}')`);
  }

  const queryString = `INSERT INTO machines (machine_name) VALUES ${machinesValues.join(
    ", "
  )};`;

  await pool.query(queryString);
}

// Função para gerar valores aleatórios para Sensor
async function generateSensorValues() {
  const sensorValues = [];

  for (let i = 1; i <= 10; i++) {
    const sensorName = faker.hacker.noun();
    const machineId = faker.number.int({ min: 1, max: 5 });
    sensorValues.push(`('${sensorName}', ${machineId})`);
  }

  const queryString = `INSERT INTO sensor (sensor_name, machine_id) VALUES ${sensorValues.join(
    ", "
  )};`;

  await pool.query(queryString);
}

// Função para gerar valores aleatórios para Log
async function generateLogValues() {
  const logValues = [];

  for (let i = 1; i <= 50; i++) {
    const logData = faker.date.recent();
    const sensorId = faker.number.int({ min: 1, max: 10 });
    const logValue = faker.number.float({ min: 0, max: 100 });
    logValues.push(`('${logData.toISOString()}', ${sensorId}, ${logValue})`);
  }

  const queryString = `INSERT INTO log (log_data, sensor_id, log_value) VALUES ${logValues.join(
    ", "
  )};`;

  await pool.query(queryString);
}

// Chamando as funções para gerar valores aleatórios
async function generateRandomData() {
  await generateMachinesValues();
  await generateSensorValues();
  await generateLogValues();

  // Encerrando a conexão com o banco de dados
  await pool.end();
}

// Chamando a função principal
generateRandomData();
