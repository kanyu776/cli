import en from './locales/en.js';
import cn from './locales/zh-CN.js';
import { readFileSync, getFilePath, defineLanguageOption } from "../utils/index.js";

// cli标识
const cliTag = 'XFE';

// 语言区域
const locales = { en, cn };

// 定义语言
const language = await defineLanguageOption('./language.json', 'cn', Object.keys(locales));

// package文件配置
const _package = JSON.parse(readFileSync(getFilePath('./package.json')));

// 项目配置文件路径
const projectPath = getFilePath('./project.json');

// 正则集合
const regular = {
  arrayJson: /^\[([^\[\]]*)\]$/,
  remark: /\（.+\）/
};

// 默认项目配置
const defaultProject = `[
  {
    "name": "vue-element-plus-admin",
    "url": "https://gitee.com/kailong110120130/vue-element-plus-admin.git",
    "branch": "master",
    "install": "npm i",
    "run": "npm run dev",
    "remark": "vue"
  },
  {
    "name": "ant-design-pro",
    "url": "https://gitee.com/ant-design/ant-design-pro.git",
    "branch": "master",
    "install": "npm i",
    "run": "npm run dev",
    "remark": "react"
  }
]`;

export default {
  cliTag,
  _package,
  projectPath,
  regular,
  defaultProject,
  ...locales[language]
};
