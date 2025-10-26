"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const app_factory_1 = require("./app.factory");
const path_1 = require("path");
const fs = require("fs");
const express = require("express");
async function bootstrap() {
    const app = await (0, app_factory_1.createNestApp)();
    // ensure uploads dir exists and serve statically
    const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    catch { }
    app.use('/uploads', express.static(uploadsDir));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map