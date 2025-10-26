"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const uploads_controller_1 = require("./uploads.controller");
const multer_1 = require("multer");
const path_1 = require("path");
let UploadsModule = class UploadsModule {
};
exports.UploadsModule = UploadsModule;
exports.UploadsModule = UploadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (req, file, cb) => cb(null, 'uploads'),
                    filename: (req, file, cb) => {
                        const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        cb(null, name + (0, path_1.extname)(file.originalname));
                    },
                }),
                limits: { fileSize: 5 * 1024 * 1024 },
                fileFilter: (req, file, cb) => {
                    if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype))
                        cb(null, true);
                    else
                        cb(null, false);
                },
            }),
        ],
        controllers: [uploads_controller_1.UploadsController],
    })
], UploadsModule);
//# sourceMappingURL=uploads.module.js.map