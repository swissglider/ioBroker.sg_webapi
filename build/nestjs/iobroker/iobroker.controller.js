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
var iobroker_controller_exports = {};
__export(iobroker_controller_exports, {
  IobrokerController: () => IobrokerController
});
module.exports = __toCommonJS(iobroker_controller_exports);
var import_common = require("@nestjs/common");
var import_main = require("../main");
var import_validation = require("../validation.pipe");
var import_all_instances = require("./services/all-instances.service");
var import_miio_service = require("./services/miio-service");
var import_search_object = require("./services/search-object.service");
var import_url_notification_subscription_service = require("./services/url-notification-subscription-service");
let IobrokerController = class {
  constructor(allInstanceServise, searchObjectService, sendToService, mIIOService, urlNotificationSubscriptionService) {
    this.allInstanceServise = allInstanceServise;
    this.searchObjectService = searchObjectService;
    this.sendToService = sendToService;
    this.mIIOService = mIIOService;
    this.urlNotificationSubscriptionService = urlNotificationSubscriptionService;
    this.allInstanceServise = new import_all_instances.AllInstanceService();
    this.searchObjectService = new import_search_object.SearchObjectService();
    this.mIIOService = new import_miio_service.MIIOService();
    this.urlNotificationSubscriptionService = new import_url_notification_subscription_service.URLNotificationSubscriptionService();
  }
  async getAllInstanceNames({ timeout = import_main.DEFAULT_TIMEOUT }) {
    console.log("==== Start getAllInstanceNames 1 ====");
    return this.allInstanceServise.getAllInstanceNames({ timeout });
  }
  async searchAllTypesWithNamePatternIncludes({ type, pattern, timeout = import_main.DEFAULT_TIMEOUT, path = "*" }) {
    return this.searchObjectService.searchAllTypesWithNamePatternIncludes({ type, pattern, timeout, path });
  }
  async searchAllTypesWithNamePatternIncludesBatch({ batch, timeout = import_main.DEFAULT_TIMEOUT }) {
    return this.searchObjectService.searchAllTypesWithNamePatternIncludesBatch({ batch, timeout });
  }
  async sendTo({ instance, command, message = {}, timeout = import_main.DEFAULT_TIMEOUT }) {
    return this.sendToService.sendTo({ instance, command, message, timeout });
  }
  async miioGetSimpleMappingPost({ login, password, country, timeout = import_main.DEFAULT_TIMEOUT }) {
    return this.mIIOService.getSimpleMapping({ login, password, country, timeout });
  }
  async miioGetSimpleMappingGet() {
    return this.mIIOService.getSimpleMappingAll();
  }
  async addURLNotificationSubscription({ stateID, urls, timeout }) {
    if (!stateID)
      throw new import_common.BadRequestException("stateID musst be set");
    if (!(Array.isArray(urls) && urls.length > 0 && urls.every((url) => typeof url == "string")))
      throw new import_common.BadRequestException("urls must be an Array of Strings");
    for (const url of urls) {
      let returnFalse = false;
      try {
        returnFalse = !Boolean(new URL(url));
      } catch (error) {
        returnFalse = true;
      }
      if (returnFalse)
        throw new import_common.BadRequestException(`the URL ${url} are not valid`);
    }
    return this.urlNotificationSubscriptionService.addURLNotificationSubscription({ stateID, urls, timeout });
  }
};
__decorateClass([
  (0, import_common.Get)("allInstanceNames"),
  (0, import_common.UsePipes)(new import_validation.ValidationPipe({ meta: import_all_instances.GetAllInstanceNames_DTO })),
  __decorateParam(0, (0, import_common.Query)())
], IobrokerController.prototype, "getAllInstanceNames", 1);
__decorateClass([
  (0, import_common.Get)("searchAllTypesWithNamePatternIncludes"),
  (0, import_common.UsePipes)(new import_validation.ValidationPipe({ meta: import_search_object.SearchAllTypesWithNamePatternIncludes_DTO })),
  __decorateParam(0, (0, import_common.Query)())
], IobrokerController.prototype, "searchAllTypesWithNamePatternIncludes", 1);
__decorateClass([
  (0, import_common.Post)("searchAllTypesWithNamePatternIncludesBatch"),
  (0, import_common.UsePipes)(new import_validation.ValidationPipe({ meta: import_search_object.SearchAllTypesWithNamePatternIncludesBatch_DTO })),
  __decorateParam(0, (0, import_common.Body)())
], IobrokerController.prototype, "searchAllTypesWithNamePatternIncludesBatch", 1);
__decorateClass([
  (0, import_common.Post)("sendTo"),
  __decorateParam(0, (0, import_common.Body)())
], IobrokerController.prototype, "sendTo", 1);
__decorateClass([
  (0, import_common.Post)("miioGetSimpleMappingPost"),
  __decorateParam(0, (0, import_common.Body)())
], IobrokerController.prototype, "miioGetSimpleMappingPost", 1);
__decorateClass([
  (0, import_common.Get)("miioGetSimpleMappingGet")
], IobrokerController.prototype, "miioGetSimpleMappingGet", 1);
__decorateClass([
  (0, import_common.Post)("addURLNotificationSubscription"),
  __decorateParam(0, (0, import_common.Body)())
], IobrokerController.prototype, "addURLNotificationSubscription", 1);
IobrokerController = __decorateClass([
  (0, import_common.Controller)("iobroker")
], IobrokerController);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IobrokerController
});
//# sourceMappingURL=iobroker.controller.js.map
