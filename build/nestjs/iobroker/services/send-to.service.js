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
var send_to_service_exports = {};
__export(send_to_service_exports, {
  SendToService: () => SendToService,
  SendTo_DTO: () => SendTo_DTO
});
module.exports = __toCommonJS(send_to_service_exports);
var import_common = require("@nestjs/common");
var import_class_validator = require("class-validator");
var import_main = require("../../main");
class SendTo_DTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], SendTo_DTO.prototype, "instance", 2);
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], SendTo_DTO.prototype, "command", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsObject)()
], SendTo_DTO.prototype, "message", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], SendTo_DTO.prototype, "timeout", 2);
let SendToService = class {
  async sendTo({ instance, command, message, timeout = import_main.DEFAULT_TIMEOUT }) {
    var _a;
    const sendToResultPromise = (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.sendToAsync(instance, command, message);
    const timoutPromise = new Promise((resolve) => {
      setTimeout(resolve, timeout, { error: `TimeoutError on ${instance} : ${command} after ${timeout}ms` });
    });
    const result = await Promise.race([sendToResultPromise, timoutPromise]);
    return { result };
  }
};
SendToService = __decorateClass([
  (0, import_common.Injectable)()
], SendToService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SendToService,
  SendTo_DTO
});
//# sourceMappingURL=send-to.service.js.map
