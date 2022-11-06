import clear from "clear";
import chalk from "chalk";
import boxen from "boxen";
import figlet from "figlet";
import logSymbols from "log-symbols";
import config from "../config/index.js";
import { readFileSync } from "../utils/index.js";

// 创建文字框
const createTextBox = (value, title = "tips") => {
  return boxen(value, {
    title,
    padding: 1,
    titleAlignment: "center",
    borderStyle: "double",
  });
};

// 打印文字
const logText = (value, color, isBox = false, logSymbols) => {
  if (isBox) {
    console.log(color(createTextBox(value)));
  } else if (logSymbols) {
    console.log(logSymbols, color(value));
  } else {
    console.log(color(value));
  }
};

export default {
  // 成功
  success(value, isBox = false) {
    logText(value, chalk.green, isBox, logSymbols.success);
  },
  // 警告
  warning(value, isBox = false) {
    logText(value, chalk.yellow, isBox, logSymbols.warning);
  },
  // 失败
  error(value, isBox = false) {
    logText(value, chalk.red, isBox, logSymbols.error);
  },
  // 信息
  info(value, isBox = false) {
    logText(value, chalk.white, isBox, logSymbols.info);
  },
  // 颜色文字
  color(value, color, isBox = false) {
    logText(value, chalk.hex(color), isBox);
  },
  // 醒目文字
  figlet(text) {
    const value = figlet.textSync(text);
    logText(value, chalk.blue);
  },
  // 文件内容
  file(path, noText = config.fileLogTips) {
    const content = readFileSync(path);
    content ? console.log(content) : this.warning(noText);
  },
  // 清除打印
  clear() {
    clear();
  },
};
