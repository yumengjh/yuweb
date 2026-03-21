/**
 * CSpell 以代码和配置文件为主，中文内容通过正则放宽，避免误报过多影响提交流程。
 * 项目专有词汇统一沉淀到本地词典文件，方便后续长期维护。
 */
const cspellConfig = {
  version: "0.2",
  language: "en",
  useGitignore: true,
  dictionaryDefinitions: [
    {
      name: "project-words",
      path: "./.cspell/project-words.txt",
      addWords: true,
    },
  ],
  dictionaries: ["project-words"],
  files: ["src/**/*.{js,jsx,ts,tsx,mjs,cjs,cts,mts,md}", "*.{js,mjs,cjs,ts,json,yml,yaml,md}"],
  ignorePaths: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "coverage/**",
    ".pnpm-store/**",
    ".husky/_/**",
    "pnpm-lock.yaml",
    "__utf8_test*.txt",
  ],
  ignoreRegExpList: ["/[\\u3400-\\u9FFF\\uF900-\\uFAFF]+/gu", "/[\\u3040-\\u30FF]+/gu"],
};

export default cspellConfig;
