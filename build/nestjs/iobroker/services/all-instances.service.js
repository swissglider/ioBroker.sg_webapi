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
var all_instances_service_exports = {};
__export(all_instances_service_exports, {
  AllInstanceService: () => AllInstanceService,
  GetAllInstanceNames_DTO: () => GetAllInstanceNames_DTO
});
module.exports = __toCommonJS(all_instances_service_exports);
var import_common = require("@nestjs/common");
var import_class_validator = require("class-validator");
var import_main = require("../../main");
class GetAllInstanceNames_DTO {
}
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], GetAllInstanceNames_DTO.prototype, "timeout", 2);
const getAllInstances = async (timeout) => {
  var _a;
  const testResultPromise = (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.getForeignObjectsAsync("*", "instance");
  const timoutPromise = new Promise((resolve) => {
    setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
  });
  const result = await Promise.race([testResultPromise, timoutPromise]);
  return result;
};
let AllInstanceService = class {
  async getAllInstanceNames({ timeout = import_main.DEFAULT_TIMEOUT }) {
    var _a;
    (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.info("AllInstanceService");
    const result = await getAllInstances(timeout);
    if (result && typeof result === "object" && result.hasOwnProperty("system.adapter.admin.0")) {
      return { result: Object.keys(result).map((e) => e.substring(15)) };
    }
    return { error: result };
  }
};
AllInstanceService = __decorateClass([
  (0, import_common.Injectable)()
], AllInstanceService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AllInstanceService,
  GetAllInstanceNames_DTO
});
//# sourceMappingURL=all-instances.service.js.map
