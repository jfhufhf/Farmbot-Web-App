import { detectLanguage } from "../i18n";
import I from "i18next";
import { stopIE } from "../util/stop_ie";
import { attachFrontPage } from "./front_page";  //登录页

stopIE();
detectLanguage().then((config) => I.init(config, attachFrontPage));
