"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var validation_pipe_exports = {};
__export(validation_pipe_exports, {
  ValidationPipe: () => ValidationPipe
});
module.exports = __toCommonJS(validation_pipe_exports);
var import_common = require("@nestjs/common");
var import_class_transformer = require("class-transformer");
var import_class_validator = require("class-validator");
let ValidationPipe = class {
  constructor(params) {
    this.params = params;
  }
  async transform(value, metadata) {
    if (!this.params && !this.params.meta && !metadata.metatype) {
      throw new import_common.BadRequestException("unknown error");
    }
    const object = (0, import_class_transformer.plainToInstance)(this.params.meta, value);
    const errors = await (0, import_class_validator.validate)(object, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      console.log(errors);
      throw new import_common.BadRequestException(Object.values(errors[0].constraints));
    }
    return value;
  }
};
ValidationPipe = __decorateClass([
  (0, import_common.Injectable)()
], ValidationPipe);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ValidationPipe
});
//# sourceMappingURL=validation.pipe.js.map
