import fs from "fs";
import path from "path";
import { program } from "commander";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { resolve } from "path";
import Downloader from "nodejs-file-downloader";
import config from "../config/index.js";

// 是否为json
export function isJson(data) {
  try {
    return !!JSON.parse(data);
  } catch (error) {
    return false;
  }
}

// 是否为数组形式的json
export function isArrayJson(data) {
  return config.regular.arrayJson.test(data);
}

// 是否为window
export function isWindow() {
  return process.platform === 'win32';
}

// 文件/夹是否存在
export function isExist(...pathArg) {
  return fs.existsSync(resolve(...pathArg));
}

// 文件夹是否为空
export function isFolderEmpty(folder = process.cwd()) {
  return fs.readdirSync(folder).length === 0;
}

// 读取文件内容
export function readFileSync(path) {
  return fs.readFileSync(resolve(path), "utf-8");
}

// 写入文件内容
export function writeSync(path, data) {
  const fd = fs.openSync(resolve(path), "w+");
  return fs.writeSync(fd, data, 0, "utf-8");
}

// 下载文件
export async function download(url, fileName) {
  const params = { url, directory: process.cwd(), fileName };
  const downloader = new Downloader(params);
  return downloader.download();
}

// 执行命令
export async function command(...args) {
  return new Promise((resolve, reject) => {
    const pro = spawn(...args);
    pro.stdout.pipe(process.stdout);
    pro.stderr.pipe(process.stderr);
    pro.on("close", (code) => (code === 0 ? resolve() : reject()));
  });
}

// git克隆
export async function gitClone(url, branch = 'master', outPath = '.') {
  return command('git', ['clone', '-b', branch, url, outPath]);
}

// 获取__filename和__dirname
export function geCommonjsPath(moduleUrl) {
  const __filename = fileURLToPath(moduleUrl);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname };
}

// 获取文件路径
export function getFilePath(relativePath) {
  const { __dirname } = geCommonjsPath(import.meta.url);
  const filePath = path.resolve(__dirname, '../', relativePath);
  return filePath;
}

/**
 * 定义语言选项
 * @param configPath 语言配置文件路径
 * @param defaultLanguage 默认语言
 * @param locales 语言地区（cn/en）
 */
export async function defineLanguageOption(configPath, defaultLanguage, locales) {
  program.option('-l, --language <value>', 'Set your cli language', defaultLanguage);
  return new Promise(function (resolve) {
    const filePath = getFilePath(configPath);
    const languageConfig = readFileSync(filePath);
    const getLanguageValue = (config) => JSON.parse(config).value;
    const defineActiion = (path, value, isWrite = true) => {
      isWrite && writeSync(path, JSON.stringify({ value }));
      resolve(value);
    }
    if (process.argv.length === 2 && languageConfig) {
      const language = getLanguageValue(languageConfig);
      defineActiion(filePath, language, false);
    } else {
      const tagTypes = ['-l', '--language'];
      const cwdParams = process.argv.slice(2);
      const isTypeScope = tagTypes.includes(cwdParams[0]);
      const isValueScope = locales.includes(cwdParams[1]);
      if (cwdParams.length === 2 && isTypeScope && isValueScope) {
        program.action((option) => defineActiion(filePath, option.language)).parse();
      } else {
        const language = languageConfig ? getLanguageValue(languageConfig) : defaultLanguage;
        defineActiion(filePath, language, false);
      }
    }
  });
}

/**
 * 删除整个目录
 * @param {*} path
 */
export function removeDirectory(path) {
  if (fs.existsSync(path)) {
    const dirs = [];
    const files = fs.readdirSync(path);
    files.forEach(async (file) => {
      const childPath = path + "/" + file;
      if (fs.statSync(childPath).isDirectory()) {
        await removeDirectory(childPath);
        dirs.push(childPath);
      } else {
        await fs.unlinkSync(childPath);
      }
    });
    dirs.forEach((fir) => fs.rmdirSync(fir));
  }
}

/**
 * 将指定src目录下的所有文件剪切到指定目标dest目录下
 * @param src 源目录
 * @param dest 目标目录
 */
export function cutDirectory(src, dest) {
  const files = fs.readdirSync(src);
  files.forEach((item) => {
    const itemPath = path.join(src, item);
    const itemStat = fs.statSync(itemPath);
    const savedPath = path.join(dest, itemPath.replace(src, ''));
    const savedDir = savedPath.substring(0, savedPath.lastIndexOf('\\'));
    if (itemStat.isFile()) {
      // 如果目录不存在则进行创建
      if (!fs.existsSync(savedDir)) {
        fs.mkdirSync(savedDir, { recursive: true });
      }
      // 写入到新目录下
      const data = fs.readFileSync(itemPath);
      fs.writeFileSync(savedPath, data);
      // 并且删除原文件
      fs.unlinkSync(itemPath);
    } else if (itemStat.isDirectory()) {
      cutDirectory(itemPath, path.join(savedDir, item));
    }
  });
  // 并且删除原目录
  fs.rmdirSync(src);
}
