import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — как в образце
  app.enableCors({
    origin: true, // для dev
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(PORT, "0.0.0.0");
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
}
bootstrap();
