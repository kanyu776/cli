import ora from 'ora';
import path from "path";
import inquirer from "inquirer";
import log from "../utils/log.js";
import config from "../config/index.js";
import {
  isWindow,
  isFolderEmpty,
  geCommonjsPath,
  cutDirectory,
  removeDirectory,
  readFileSync,
  gitClone,
  command
} from "../utils/index.js";

// 选择项目
async function selectProject(projectConfig) {
  if (projectConfig) {
    const projectList = JSON.parse(projectConfig);
    const { operation } = await inquirer.prompt([
      {
        type: "rawlist",
        name: "operation",
        message: config.inquirerTips,
        choices: projectList.map(item => {
          return item.name + `（${item.remark}）`;
        }),
      },
    ])
    const currentProject = projectList.find(item => {
      const reg = config.regular.remark;
      const name = operation.replace(reg, '');
      return item.name === name;
    });
    operateProject(currentProject);
  } else {
    log.warning(config.projectWarnTips);
  }
}

// 操作项目
async function operateProject(project) {
  const selectConfig = config.operateSelect;
  const { operation } = await inquirer.prompt([
    {
      type: "rawlist",
      name: "operation",
      message: config.inquirerTips,
      choices: Object.values(selectConfig),
    },
  ])
  const {
    auto,
    download,
    install,
    run,
    quit,
  } = selectConfig;
  switch (operation) {
    case auto:
      await downloadProject(project, false);
      await runCommand(project, 'install');
      await runCommand(project, 'run');
      break;
    case download:
      await downloadProject(project);
      break;
    case install:
      runCommand(project, 'install');
      break;
    case run:
      runCommand(project, 'run');
      break;
    case quit:
      return;
    default:
      return;
  }
}

// 下载项目
function downloadProject(project, isTips = true) {
  return new Promise(function (resolve, reject) {
    const spinner = ora().start();
    const download = (project, clonePath, callback) => {
      gitClone(project.url, project.branch, clonePath).then(() => {
        callback && callback();
        isTips ? spinner.succeed(config.downloadTips) : spinner.stop();
        resolve();
      }).catch((err) => {
        spinner.fail(err);
        reject(err);
      });
    }
    if (isFolderEmpty()) {
      download(project);
    } else {
      const { __dirname } = geCommonjsPath(import.meta.url);
      const clonePath = path.resolve(__dirname, '../clone');
      const gitFilePath = path.resolve(clonePath, './.git');
      download(project, clonePath, () => {
        removeDirectory(gitFilePath);
        cutDirectory(clonePath, process.cwd());
      });
    }
  })
}

// 执行项目
function runCommand(project, type) {
  const values = project[type].split(/\s/);
  const cwd = isWindow() ? values[0] + '.cmd' : values[0];
  const params = values.slice(1);
  return command(cwd, params);
}

// 执行逻辑
selectProject(readFileSync(config.projectPath));