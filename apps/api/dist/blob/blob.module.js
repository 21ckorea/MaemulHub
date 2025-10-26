"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const blob_controller_1 = require("./blob.controller");
const multer_1 = require("multer");
let BlobModule = class BlobModule {
};
exports.BlobModule = BlobModule;
exports.BlobModule = BlobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.memoryStorage)(),
                limits: { fileSize: 10 * 1024 * 1024 },
            }),
        ],
        controllers: [blob_controller_1.BlobController],
    })
], BlobModule);
//# sourceMappingURL=blob.module.js.map