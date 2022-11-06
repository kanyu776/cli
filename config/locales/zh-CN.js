// 初始选择
const initSelect = {
  choose: "项目选择",
  configure: "项目配置",
  config: "当前配置",
  version: "当前版本",
  quit: "退出",
};

// 操作选择
const operateSelect = {
  auto: "自动化",
  download: "下载",
  install: "安装",
  run: "运行",
  quit: "退出",
};

// 项目配置状态
const projectConfigState = {
  complete: '配置已完成',
  update: '配置已更新'
}

// 项目配置校验提示
const projectVerifyTips = {
  format: "json格式不正确",
  isArray: "应该为数组形式的json",
  isEmpty: "至少配置一个项目"
}

// 项目配置警告提示
const projectWarnTips = '请先进行项目配置';

// inquirer提示
const inquirerTips = '请选择要执行的操作';

// 文件内容打印提示
const fileLogTips = '未读取到文件内容';

// 下载提示
const downloadTips = '下载完成';

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
