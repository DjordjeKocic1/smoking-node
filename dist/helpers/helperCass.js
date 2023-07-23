"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$userHelper = void 0;
class UserHelper {
    extractObjectKeys(value) {
        return Object.keys(value);
    }
    extractObjectValues(value) {
        return Object.values(value);
    }
}
exports.$userHelper = new UserHelper();
