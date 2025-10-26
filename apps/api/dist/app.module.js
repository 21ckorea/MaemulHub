"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const property_module_1 = require("./property/property.module");
const customer_module_1 = require("./customer/customer.module");
const inquiry_module_1 = require("./inquiry/inquiry.module");
const share_link_module_1 = require("./share-link/share-link.module");
const contract_module_1 = require("./contract/contract.module");
const uploads_module_1 = require("./uploads/uploads.module");
const blob_module_1 = require("./blob/blob.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, property_module_1.PropertyModule, customer_module_1.CustomerModule, inquiry_module_1.InquiryModule, share_link_module_1.ShareLinkModule, contract_module_1.ContractModule, uploads_module_1.UploadsModule, blob_module_1.BlobModule],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map