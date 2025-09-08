import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: true, // Разрешаем запросы с любых доменов (для разработки)
    // Для продакшена лучше указать конкретные домены:
    // origin: ['http://localhost:3000', 'http://localhost:3001', 'https://yourdomain.com'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Если нужны cookies/authentication
  });

  await app.listen(3000);
}
bootstrap();
