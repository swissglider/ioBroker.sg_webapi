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
var app_module_exports = {};
__export(app_module_exports, {
  AppModule: () => AppModule
});
module.exports = __toCommonJS(app_module_exports);
var import_common = require("@nestjs/common");
var import_app = require("./app.controller");
var import_help = require("./help/help.module");
var import_iobroker = require("./iobroker/iobroker.module");
let AppModule = class {
};
AppModule = __decorateClass([
  (0, import_common.Module)({
    imports: [import_help.HelpModule, import_iobroker.IobrokerModule],
    controllers: [import_app.AppController]
  })
], AppModule);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppModule
});
//# sourceMappingURL=app.module.js.map
