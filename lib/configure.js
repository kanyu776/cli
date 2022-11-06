import inquirer from "inquirer";
import log from "../utils/log.js";
import config from "../config/index.js";
import {
  isJson,
  isArrayJson,
  readFileSync,
  writeSync
} from "../utils/index.js";

// 获取项目配置
async function getProjectConfig() {
  const oldConfig = readFileSync(config.projectPath);
  const defaultConfig = oldConfig || config.defaultProject;
  const res = await inquirer.prompt([
    {
      type: "editor",
      name: "config",
      default: defaultConfig,
    },
  ]);
  return {
    new: res.config,
    old: oldConfig
  };
}

// 校验项目配置
function checkProjectConfig(configs) {
  const newConfig = configs.new;
  const { format, isArray, isEmpty } = config.projectVerifyTips;
  if (isJson(newConfig) === false) {
    log.error(format);
    return false;
  }
  if (isArrayJson(newConfig) === false) {
    log.warning(isArray);
    return false;
  }
  if (JSON.parse(newConfig).length === 0) {
    log.warning(isEmpty);
    return false;
  }
  return true;
}

getProjectConfig().then(res => {
  if (checkProjectConfig(res)) {
    const { complete, update } = config.projectConfigState;
    writeSync(config.projectPath, res.new);
    log.success(res.new ? complete : update, true);
  }
})
