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
var main_exports = {};
__export(main_exports, {
  AdapterStr: () => AdapterStr,
  DEFAULT_TIMEOUT: () => DEFAULT_TIMEOUT,
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_core = require("@nestjs/core");
var import_app = require("./app.module");
const AdapterStr = {
  adapter: void 0
};
let DEFAULT_TIMEOUT = 2e4;
async function bootstrap(adapter) {
  var _a;
  AdapterStr.adapter = adapter;
  const app = await import_core.NestFactory.create(import_app.AppModule);
  await app.listen(8089);
  console.log(`Application is running on: ${await app.getUrl()}`);
  DEFAULT_TIMEOUT = ((_a = AdapterStr.adapter) == null ? void 0 : _a.config)["GENEREL_default_timout"] || 5e3;
}
var main_default = bootstrap;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AdapterStr,
  DEFAULT_TIMEOUT
});
//# sourceMappingURL=main.js.map
