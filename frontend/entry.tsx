/// <reference path="../typings/index.d.ts" />
/**
 * 这是Web应用程序主要部分的入口点.
 *
 * Try to keep this file light. */
import { detectLanguage } from "./i18n";
import { shortRevision } from "./util";
import { stopIE } from "./util/stop_ie";
import { attachAppToDom } from "./routes";
import I from "i18next";

stopIE();

console.log(shortRevision());

detectLanguage().then(config => I.init(config, attachAppToDom));
