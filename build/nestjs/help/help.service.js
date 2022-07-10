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
var help_service_exports = {};
__export(help_service_exports, {
  HelpService: () => HelpService
});
module.exports = __toCommonJS(help_service_exports);
var import_common = require("@nestjs/common");
var import_main = require("../main");
let HelpService = class {
  constructor() {
    this.rootCommands = [
      { name: "h", description: "velo" },
      { name: "iobroker/allInstanceNames", description: "returns all Instance name like admin.0" },
      {
        name: "iobroker/searchAllTypesWithNamePatternIncludes",
        description: "return all object from input value type including string from value pattern"
      }
    ];
  }
  getRootCommands() {
    return this.rootCommands;
  }
  async getTest() {
    var _a;
    const testResultPromise = (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.getStateAsync("sg_webapi.0.testVariable");
    const timeout = 1e3;
    const timoutPromise = new Promise((resolve) => {
      setTimeout(resolve, timeout, { error: `TimeoutError on h : error after ${timeout}ms` });
    });
    const result = await Promise.race([testResultPromise, timoutPromise]);
    return result;
  }
};
HelpService = __decorateClass([
  (0, import_common.Injectable)()
], HelpService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HelpService
});
//# sourceMappingURL=help.service.js.map
