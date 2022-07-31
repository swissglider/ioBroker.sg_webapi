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
var miio_service_exports = {};
__export(miio_service_exports, {
  MIIOService: () => MIIOService,
  MIIO_DTO: () => MIIO_DTO,
  getFullSimpleDeviceList: () => getFullSimpleDeviceList
});
module.exports = __toCommonJS(miio_service_exports);
var import_common = require("@nestjs/common");
var import_class_validator = require("class-validator");
var import_main = require("../../main");
const { AuthMiIO, ApiMiIO } = require("miio-token-extractor");
class MIIO_DTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], MIIO_DTO.prototype, "login", 2);
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], MIIO_DTO.prototype, "password", 2);
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], MIIO_DTO.prototype, "country", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], MIIO_DTO.prototype, "timeout", 2);
const CACHE_RESULT = {};
const _getDeviceList = async ({ login, password, country = "" }) => {
  var _a;
  try {
    const authMiIO = new AuthMiIO();
    const apiMiIO = new ApiMiIO();
    const { userId, token, ssecurity } = await authMiIO.login(login, password);
    const devices = await apiMiIO.getDeviceList(userId, ssecurity, token, country);
    const channelResultPromise = await ((_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.getForeignObjectsAsync("mihome.*", "channel"));
    if (channelResultPromise) {
      const filtered = Object.fromEntries(Object.entries(channelResultPromise).filter(([key]) => key.match(/^mihome\.[0-9]\.devices/i)));
      const returnA = await Promise.all(devices.map(async (e) => {
        var _a2;
        const did = e.did.split(".").pop();
        const ioBrokerChannel = Object.values(filtered).find((ee) => ee.native.sid === did);
        let availableStyleButtons = [];
        if (ioBrokerChannel) {
          const buttonPromise = await ((_a2 = import_main.AdapterStr.adapter) == null ? void 0 : _a2.getForeignObjectsAsync(ioBrokerChannel._id + ".*", "state"));
          if (buttonPromise) {
            availableStyleButtons = Object.values(buttonPromise).map((bp) => ({
              name: bp.common.name.toString(),
              id: bp._id,
              role: bp.common.role
            }));
          }
        }
        return {
          ...e,
          ioBrokerChannelPath: ioBrokerChannel ? ioBrokerChannel._id : "",
          availableStyleButtons
        };
      }));
      return returnA;
    }
    return [];
  } catch (error) {
    throw error;
  }
};
const generateFullSimpleDeviceList = async (configS = void 0, timeout = import_main.DEFAULT_TIMEOUT) => {
  var _a;
  const promises = [];
  const config = (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.config;
  const configA = [];
  if (!config)
    return { error: "wrong configuration ??" };
  if (!configS) {
    if (config["MIIO_activatedConfig1"]) {
      configA.push({
        login: config["MIIO_login1"],
        password: config["MIIO_password1"],
        country: config["MIIO_country1"]
      });
    }
    if (config["MIIO_activatedConfig2"]) {
      configA.push({
        login: config["MIIO_login2"],
        password: config["MIIO_password2"],
        country: config["MIIO_country2"]
      });
    }
  } else {
    configA.push(configS);
  }
  configA.forEach((e) => {
    promises.push(_getDeviceList(e));
  });
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(resolve, timeout, { error: `TimeoutError on miio test after ${timeout}ms` });
  });
  try {
    const result1 = await Promise.race([Promise.all(promises), timeoutPromise]);
    if (result1.hasOwnProperty("error")) {
      return result1;
    }
    const result = [];
    result1.forEach((element) => {
      result.push(...element.map((e) => {
        const subs = e.name.split(" ");
        return {
          did: e.did.split(".").pop(),
          name: e.name,
          model: e.model,
          isOnline: e.isOnline,
          localip: e.localip,
          parent_id: e.parent_id,
          token: e.token,
          adapterName: "MiHome",
          channelType: subs[0] ? subs[0] : "",
          room: subs[1] ? subs[1] : "",
          place: subs[2] ? subs[2] : "",
          ioBrokerChannelPath: e.ioBrokerChannelPath,
          availableStyleButtons: e.availableStyleButtons,
          orgMIIOCloudInfo: e
        };
      }));
    });
    return { result };
  } catch (error) {
    return { error: error.toString() };
  }
};
const getFullSimpleDeviceList = async (configS = void 0, timeout = import_main.DEFAULT_TIMEOUT, forceRefresh = false) => {
  var _a, _b, _c;
  const idString = configS ? `__${configS.login}__${configS.password}__${(_a = configS.country) != null ? _a : ""}__` : "auto";
  const refreshTime = ((_b = import_main.AdapterStr.adapter) == null ? void 0 : _b.config.hasOwnProperty("MIIO_autoRefreshTimeout")) && import_main.AdapterStr.adapter.config["MIIO_autoRefreshTimeout"] ? import_main.AdapterStr.adapter.config["MIIO_autoRefreshTimeout"] : 5e4;
  forceRefresh = ((_c = import_main.AdapterStr.adapter) == null ? void 0 : _c.config["MIIO_autoRefresh"]) ? forceRefresh : true;
  const maxAge = Date.now() - refreshTime;
  const cacheResult = CACHE_RESULT.hasOwnProperty(idString) ? CACHE_RESULT[idString] : void 0;
  if (cacheResult && cacheResult.updateTime >= maxAge && !forceRefresh) {
    return cacheResult.result;
  }
  const tmpResult = await generateFullSimpleDeviceList(configS, timeout);
  CACHE_RESULT[idString] = {
    updateTime: Date.now(),
    result: tmpResult
  };
  return tmpResult;
};
let MIIOService = class {
  constructor() {
    this.getSimpleMapping = async ({
      login,
      password,
      country,
      timeout = import_main.DEFAULT_TIMEOUT
    }) => {
      var _a;
      (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.log.info("SendToService");
      return generateFullSimpleDeviceList({ login, password, country }, timeout);
    };
    this.getSimpleMappingAll = async () => {
      return getFullSimpleDeviceList();
    };
  }
};
MIIOService = __decorateClass([
  (0, import_common.Injectable)()
], MIIOService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MIIOService,
  MIIO_DTO,
  getFullSimpleDeviceList
});
//# sourceMappingURL=miio-service.js.map
