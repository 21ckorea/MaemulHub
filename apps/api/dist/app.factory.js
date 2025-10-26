"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestApp = createNestApp;
exports.createExpressApp = createExpressApp;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function createNestApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    return app;
}
async function createExpressApp() {
    const app = await createNestApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp;
}
//# sourceMappingURL=app.factory.js.map