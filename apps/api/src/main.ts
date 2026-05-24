import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim());
    app.enableCors({ origin: allowedOrigins });
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
}

bootstrap();
