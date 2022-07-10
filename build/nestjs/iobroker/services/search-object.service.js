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
var search_object_service_exports = {};
__export(search_object_service_exports, {
  SearchAllTypesWithNamePatternIncludesBatch_DTO: () => SearchAllTypesWithNamePatternIncludesBatch_DTO,
  SearchAllTypesWithNamePatternIncludes_DTO: () => SearchAllTypesWithNamePatternIncludes_DTO,
  SearchObjectService: () => SearchObjectService
});
module.exports = __toCommonJS(search_object_service_exports);
var import_common = require("@nestjs/common");
var import_class_transformer = require("class-transformer");
var import_class_validator = require("class-validator");
var import_main = require("../../main");
class SearchAllTypesWithNamePatternIncludes_DTO {
}
__decorateClass([
  (0, import_class_validator.IsNotEmpty)(),
  (0, import_class_validator.IsString)()
], SearchAllTypesWithNamePatternIncludes_DTO.prototype, "type", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsString)()
], SearchAllTypesWithNamePatternIncludes_DTO.prototype, "pattern", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsString)()
], SearchAllTypesWithNamePatternIncludes_DTO.prototype, "path", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], SearchAllTypesWithNamePatternIncludes_DTO.prototype, "timeout", 2);
class SearchAllTypesWithNamePatternIncludesBatch_DTO {
}
__decorateClass([
  (0, import_class_validator.IsOptional)()
], SearchAllTypesWithNamePatternIncludesBatch_DTO.prototype, "batch", 2);
__decorateClass([
  (0, import_class_validator.IsOptional)(),
  (0, import_class_validator.IsNumber)()
], SearchAllTypesWithNamePatternIncludesBatch_DTO.prototype, "timeout", 2);
const validateBatchDTO = async (batch) => {
  if (!batch && !Array.isArray(batch)) {
    throw new import_common.BadRequestException("Batch Parameter wrong configured");
  }
  for (const value of batch) {
    const object = (0, import_class_transformer.plainToInstance)(SearchAllTypesWithNamePatternIncludes_DTO, value);
    const errors = await (0, import_class_validator.validate)(object, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      console.log(errors);
      throw new import_common.BadRequestException(Object.values(errors[0].constraints));
    }
  }
  return;
};
let SearchObjectService = class {
  async searchAllTypesWithNamePatternIncludes({
    type = void 0,
    pattern = void 0,
    path = "*",
    timeout = import_main.DEFAULT_TIMEOUT
  }) {
    var _a;
    const testResultPromise = (_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.getForeignObjectsAsync(path, type);
    const timoutPromise = new Promise((resolve) => {
      setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
    });
    const result = await Promise.race([testResultPromise, timoutPromise]);
    if (result && typeof result === "object" && !pattern) {
      return { result };
    }
    if (result && typeof result === "object") {
      const newResult = {};
      for (const [key, value] of Object.entries(result)) {
        if (value.common.name && typeof value.common.name === "string" && value.common.name.includes(pattern)) {
          newResult[key] = value;
          continue;
        }
        if (value.common.name && typeof value.common.name === "object") {
          for (const val of Object.values(value.common.name)) {
            if (pattern && val && typeof val === "string" && val.includes(pattern)) {
              newResult[key] = value;
              continue;
            }
          }
        }
      }
      console.log(Object.keys(newResult));
      return { result: newResult };
    }
    return { error: result };
  }
  async searchAllTypesWithNamePatternIncludesBatch({
    batch = [],
    timeout = import_main.DEFAULT_TIMEOUT
  }) {
    var _a;
    await validateBatchDTO(batch);
    const promises = [];
    for (const { type = void 0, path = "*" } of batch) {
      promises.push((_a = import_main.AdapterStr.adapter) == null ? void 0 : _a.getForeignObjectsAsync(path, type));
    }
    const allPromises = Promise.all(promises);
    const timoutPromise = new Promise((resolve) => {
      setTimeout(resolve, timeout, { error: `TimeoutError on AllInstanceService after ${timeout}ms` });
    });
    const rawResult = await Promise.race([allPromises, timoutPromise]);
    if (!rawResult || typeof rawResult !== "object") {
      return { error: "Unknown Error" };
    }
    if (rawResult.hasOwnProperty("error")) {
      return { error: rawResult.error };
    }
    if (Array.isArray(rawResult)) {
      const result = {};
      for (const index in batch) {
        const { pattern = void 0 } = batch[index];
        const obj = rawResult[index];
        if (!pattern) {
          for (const [key, value] of Object.entries(obj)) {
            result[key] = value;
          }
        } else {
          for (const [key, value] of Object.entries(obj)) {
            if (value.common.name && typeof value.common.name === "string" && value.common.name.includes(pattern)) {
              result[key] = value;
              continue;
            }
            if (value.common.name && typeof value.common.name === "object") {
              for (const val of Object.values(value.common.name)) {
                if (pattern && val && typeof val === "string" && val.includes(pattern)) {
                  result[key] = value;
                  continue;
                }
              }
            }
          }
        }
      }
      console.log(Object.keys(result));
      return { result };
    }
    return { error: "Unknown Error" };
  }
};
SearchObjectService = __decorateClass([
  (0, import_common.Injectable)()
], SearchObjectService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SearchAllTypesWithNamePatternIncludesBatch_DTO,
  SearchAllTypesWithNamePatternIncludes_DTO,
  SearchObjectService
});
//# sourceMappingURL=search-object.service.js.map
