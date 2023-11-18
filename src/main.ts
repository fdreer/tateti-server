import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'

config()
const { PORT } = process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
}
bootstrap()
