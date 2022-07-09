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
var help_controller_exports = {};
__export(help_controller_exports, {
  HelpController: () => HelpController
});
module.exports = __toCommonJS(help_controller_exports);
var import_common = require("@nestjs/common");
var import_help = require("./help.service");
let HelpController = class {
  constructor(helpService) {
    this.helpService = helpService;
    this.helpService = new import_help.HelpService();
  }
  async getRootCommands() {
    console.log("==== Start getRootCommands ====");
    console.log(this.helpService);
    return this.helpService.getRootCommands();
  }
  async getTest() {
    console.log("==== Start getTest ====");
    return this.helpService.getTest();
  }
};
__decorateClass([
  (0, import_common.Get)()
], HelpController.prototype, "getRootCommands", 1);
__decorateClass([
  (0, import_common.Get)("test")
], HelpController.prototype, "getTest", 1);
HelpController = __decorateClass([
  (0, import_common.Controller)("help")
], HelpController);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HelpController
});
//# sourceMappingURL=help.controller.js.map
