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
var iobroker_module_exports = {};
__export(iobroker_module_exports, {
  IobrokerModule: () => IobrokerModule
});
module.exports = __toCommonJS(iobroker_module_exports);
var import_common = require("@nestjs/common");
var import_iobroker = require("./iobroker.controller");
var import_all_instances = require("./services/all-instances.service");
var import_search_object = require("./services/search-object.service");
var import_send_to = require("./services/send-to.service");
let IobrokerModule = class {
};
IobrokerModule = __decorateClass([
  (0, import_common.Module)({
    controllers: [import_iobroker.IobrokerController],
    providers: [import_all_instances.AllInstanceService, import_search_object.SearchObjectService, import_send_to.SendToService]
  })
], IobrokerModule);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IobrokerModule
});
//# sourceMappingURL=iobroker.module.js.map
