// 初始选择
const initSelect = {
  choose: "Project Selection",
  configure: "Project configuration",
  config: "The current configuration",
  version: "The current version",
  quit: "quit",
};

// 操作选择
const operateSelect = {
  auto: "automation",
  download: "download",
  install: "install",
  run: "run",
  quit: "quit",
};

// 项目配置状态
const projectConfigState = {
  complete: 'The configuration is complete',
  update: 'The configuration has been updated'
}

// 项目配置校验提示
const projectVerifyTips = {
  format: "The json format is incorrect",
  isArray: "It should be json as an array",
  isEmpty: "Configure at least one project"
}

// 项目配置警告提示
const projectWarnTips = 'Please configure the project first';

// inquirer提示
const inquirerTips = 'Select the action to be performed';

// 文件内容打印提示
const fileLogTips = 'The file content was not read. Procedure';

// 下载提示
const downloadTips = 'The download is complete';

export default {
  initSelect,
  operateSelect,
  projectConfigState,
  projectVerifyTips,
  projectWarnTips,
  inquirerTips,
  fileLogTips,
  downloadTips,
};
