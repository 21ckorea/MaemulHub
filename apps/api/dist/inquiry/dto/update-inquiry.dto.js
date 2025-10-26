"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInquiryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_inquiry_dto_1 = require("./create-inquiry.dto");
class UpdateInquiryDto extends (0, mapped_types_1.PartialType)(create_inquiry_dto_1.CreateInquiryDto) {
}
exports.UpdateInquiryDto = UpdateInquiryDto;
//# sourceMappingURL=update-inquiry.dto.js.map