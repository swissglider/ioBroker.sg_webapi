"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_miio_service = require("./nestjs/iobroker/services/miio-service");
var import_url_notification_subscription_service = require("./nestjs/iobroker/services/url-notification-subscription-service");
var import_main = __toESM(require("./nestjs/main"));
let MIOO_intervall;
class SgWebapi extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "sg_webapi"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    var _a;
    this.log.warn("onReady1");
    (0, import_main.default)(this);
    if (this.config.MIIO_autoRefresh) {
      (0, import_miio_service.getFullSimpleDeviceList)();
      MIOO_intervall = this.setInterval(() => {
        (0, import_miio_service.getFullSimpleDeviceList)();
      }, (_a = this.config["MIIO_autoRefreshTimeout"]) != null ? _a : 5e4);
    }
  }
  async onUnload(callback) {
    try {
      this.clearInterval(MIOO_intervall);
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    const operation = state ? "change" : "deletion";
    import_url_notification_subscription_service.UrlNotificationSubscriptionServiceListener.listen(id, state, operation);
  }
}
if (require.main !== module) {
  module.exports = (options) => new SgWebapi(options);
} else {
  (() => new SgWebapi())();
}
//# sourceMappingURL=main.js.map
