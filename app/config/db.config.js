module.exports = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: 'tu password',
  DB: 'db_bootcamp',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}