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
var url_notification_subscription_service_exports = {};
__export(url_notification_subscription_service_exports, {
  AddURLNotification_DTO: () => AddURLNotification_DTO,
  DeleteURLNotifications_DTO: () => DeleteURLNotifications_DTO,
  URLNotificationSubscriptionService: () => URLNotificationSubscriptionService,
  UrlNotificationSubscriptionServiceListener: () => UrlNotificationSubscriptionServiceListener,
  listen: () => listen
});
module.exports = __toCommonJS(url_notification_subscription_service_exports);
var import_axios = require("@nestjs/axios");
var import_common = require("@nestjs/common");
var import_class_validator = require("class-validator");
var import_main = require("../../main");
const _URL_SUBSCRIPTION = {};
const httpService = new import_axios.HttpService();
class AddURLNotification_DTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], AddURLNotification_DTO.prototype, "stateID", 2);
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsArray)()
], AddURLNotification_DTO.prototype, "urls", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], AddURLNotification_DTO.prototype, "timeout", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsBoolean)()
], AddURLNotification_DTO.prototype, "forceOverwritte", 2);
class DeleteURLNotifications_DTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsArray)()
], DeleteURLNotifications_DTO.prototype, "stateIDs", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], DeleteURLNotifications_DTO.prototype, "timeout", 2);
const listen = async (id, state, operation) => {
  var _a;
  if (operation === "deletion") {
  } else {
    if (_URL_SUBSCRIPTION.hasOwnProperty(id)) {
      for (const url of _URL_SUBSCRIPTION[id]) {
        try {
          await httpService.axiosRef.post(url, { id, state });
        } catch (error) {
          (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.error(`${error} - url: ${url}`);
        }
      }
    }
  }
};
const UrlNotificationSubscriptionServiceListener = {
  listen
};
let URLNotificationSubscriptionService = class {
  constructor() {
    this.addURLNotificationSubscription = async ({
      stateID,
      urls,
      timeout = import_main.DEFAULT_TIMEOUT,
      forceOverwritte = false
    }) => {
      var _a;
      (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.silly("URLNotificationSubscriptionService");
      const adapter = import_main.AdapterStr.adapter;
      if (!adapter)
        throw new import_common.InternalServerErrorException("ioBroker adapter not set ??");
      const a = await adapter.getForeignStateAsync(stateID);
      if (!a)
        throw new import_common.BadRequestException(`the stateID: ${stateID} was not found on ioBroker`);
      if (!_URL_SUBSCRIPTION.hasOwnProperty(stateID)) {
        _URL_SUBSCRIPTION[stateID] = [];
        const resultPromise = adapter.subscribeForeignStatesAsync(stateID);
        const timeoutPromise = new Promise((resolve) => {
          setTimeout(resolve, timeout, { errorTM: "" });
        });
        const result1 = await Promise.race([resultPromise, timeoutPromise]);
        if (result1.hasOwnProperty("error")) {
          throw new import_common.InternalServerErrorException(`Error while subscribe to ${stateID}`);
        }
        if (result1.hasOwnProperty("errorTM")) {
          throw new import_common.GatewayTimeoutException(`TimeoutError after ${timeout}ms`);
        }
      }
      if (forceOverwritte) {
        _URL_SUBSCRIPTION[stateID] = [];
      }
      for (const url of urls) {
        if (!_URL_SUBSCRIPTION[stateID].includes(url)) {
          _URL_SUBSCRIPTION[stateID].push(url);
        }
      }
      return { result: _URL_SUBSCRIPTION };
    };
    this.getURLNotificationSubscriptionList = () => {
      var _a;
      (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.silly("getURLNotificationSubscriptionList");
      return { result: _URL_SUBSCRIPTION };
    };
    this.deleteAllURLNotificationSubscriptions = async () => {
      var _a;
      (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.silly("deleteAllURLNotificationSubscriptions");
      const adapter = import_main.AdapterStr.adapter;
      if (!adapter)
        throw new import_common.InternalServerErrorException("ioBroker adapter not set ??");
      for (const id of Object.keys(_URL_SUBSCRIPTION)) {
        await adapter.unsubscribeForeignStatesAsync(id);
      }
      for (const id of Object.keys(_URL_SUBSCRIPTION)) {
        delete _URL_SUBSCRIPTION[id];
      }
      return { result: _URL_SUBSCRIPTION };
    };
    this.deleteURLNotificationSubscriptions = async ({ stateIDs }) => {
      var _a;
      (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.silly("deleteURLNotificationSubscriptions");
      const adapter = import_main.AdapterStr.adapter;
      if (!adapter)
        throw new import_common.InternalServerErrorException("ioBroker adapter not set ??");
      for (const id of stateIDs) {
        await adapter.unsubscribeForeignStatesAsync(id);
      }
      for (const id of stateIDs) {
        delete _URL_SUBSCRIPTION[id];
      }
      return { result: _URL_SUBSCRIPTION };
    };
  }
};
URLNotificationSubscriptionService = __decorateClass([
  (0, import_common.Injectable)()
], URLNotificationSubscriptionService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddURLNotification_DTO,
  DeleteURLNotifications_DTO,
  URLNotificationSubscriptionService,
  UrlNotificationSubscriptionServiceListener,
  listen
});
//# sourceMappingURL=url-notification-subscription-service.js.map
