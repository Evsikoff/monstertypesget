import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS - важно для работы в Replit environment
  app.enableCors({
    origin: true, // Разрешаем запросы с любых доменов (для разработки)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Если нужны cookies/authentication
  });

  const port = process.env.PORT || 5000;
  await app.listen(port, "0.0.0.0");
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}
bootstrap();
