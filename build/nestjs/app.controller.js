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
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
var app_controller_exports = {};
__export(app_controller_exports, {
  AppController: () => AppController,
  TestDTO: () => TestDTO
});
module.exports = __toCommonJS(app_controller_exports);
var import_common = require("@nestjs/common");
var import_class_validator = require("class-validator");
var import_validation = require("./validation.pipe");
class TestDTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], TestDTO.prototype, "test", 2);
let AppController = class {
  redirect(res) {
    return res.redirect("/help");
  }
  async test(test) {
    return { hallo: `Velo-_: ${test.test}` };
  }
};
__decorateClass([
  (0, import_common.Get)(),
  __decorateParam(0, (0, import_common.Res)())
], AppController.prototype, "redirect", 1);
__decorateClass([
  (0, import_common.Post)("test"),
  (0, import_common.UsePipes)(new import_validation.ValidationPipe({ meta: TestDTO })),
  __decorateParam(0, (0, import_common.Body)())
], AppController.prototype, "test", 1);
AppController = __decorateClass([
  (0, import_common.Controller)()
], AppController);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppController,
  TestDTO
});
//# sourceMappingURL=app.controller.js.map
