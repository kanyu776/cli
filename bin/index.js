#!/usr/bin/env node
import { program } from "commander";
import inquirer from "inquirer";
import log from "../utils/log.js";
import config from "../config/index.js";

// 定义版本号
program.version(config._package.version, '-v, --version', 'output the current version');

// 解析参数
program.parse();

// 执行交互逻辑（没有参数时）
if (process.argv.length === 2) {
  // 打印cli标识
  log.figlet(config.cliTag);

  // 进入初始命令
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "operation",
        message: config.inquirerTips,
        choices: Object.values(config.initSelect),
      },
    ])
    .then(async ({ operation }) => {
      const {
        choose,
        configure,
        config: _config,
        version,
        quit,
      } = config.initSelect;
      switch (operation) {
        case choose:
          await import("../lib/choose.js");
          break;
        case configure:
          await import("../lib/configure.js");
          break;
        case _config:
          log.file(config.projectPath, config.projectWarnTips);
          break;
        case version:
          log.info(config._package.version);
          break;
        case quit:
          return;
        default:
          return;
      }
    });
}
