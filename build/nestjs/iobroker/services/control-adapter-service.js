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
var control_adapter_service_exports = {};
__export(control_adapter_service_exports, {
  ControlAdapterService: () => ControlAdapterService,
  ControlAdapter_DTO: () => ControlAdapter_DTO
});
module.exports = __toCommonJS(control_adapter_service_exports);
var import_common = require("@nestjs/common");
var import_class_validator = require("class-validator");
var import_main = require("../../main");
class ControlAdapter_DTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], ControlAdapter_DTO.prototype, "command", 2);
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], ControlAdapter_DTO.prototype, "adapterName", 2);
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsNumber)()
], ControlAdapter_DTO.prototype, "instance", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], ControlAdapter_DTO.prototype, "timeout", 2);
let ControlAdapterService = class {
  constructor() {
    this.controlAdapter = async ({
      command,
      adapterName,
      instance
    }) => {
      var _a;
      (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.silly("controlAdapter");
      const adapter = import_main.AdapterStr.adapter;
      if (!adapter)
        throw new import_common.InternalServerErrorException("ioBroker adapter not set ??");
      const obName = `system.adapter.${adapterName}.${instance}`;
      const obj = await adapter.getForeignObjectAsync(obName);
      if (!obj) {
        throw new import_common.InternalServerErrorException(`Adapter '${obName}' not available`);
      }
      if (command === "start") {
        obj.common.enabled = true;
        await adapter.setForeignObjectAsync(obName, obj);
      }
      if (command === "stop") {
        obj.common.enabled = false;
        await adapter.setForeignObjectAsync(obName, obj);
      }
      if (command === "restart") {
        obj.common.enabled = false;
        await adapter.setForeignObjectAsync(obName, obj);
        await new Promise((resolve) => setTimeout(resolve, 50));
        obj.common.enabled = true;
        await adapter.setForeignObjectAsync(obName, obj);
      }
      return { result: "proceeded" };
    };
  }
};
ControlAdapterService = __decorateClass([
  (0, import_common.Injectable)()
], ControlAdapterService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ControlAdapterService,
  ControlAdapter_DTO
});
//# sourceMappingURL=control-adapter-service.js.map
