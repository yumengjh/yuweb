import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import {
  formatChangelogItem,
  getTodayString,
  parseCommitMessage,
  upsertChangelog,
} from "./lib/changelog.mjs";

const cwd = process.cwd();
const changelogPath = path.join(cwd, "CHANGELOG.md");

function getCommitCommand() {
  const binName = process.platform === "win32" ? "cz.cmd" : "cz";
  return path.join(cwd, "node_modules", ".bin", binName);
}

async function askShouldWriteChangelog() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return false;
  }

  const rl = readline.createInterface({ input, output });

  try {
    const answer = await rl.question("是否写入 CHANGELOG.md？(y/N) ");
    return ["y", "yes"].includes(answer.trim().toLowerCase());
  } finally {
    rl.close();
  }
}

function runCommitFlow() {
  return new Promise((resolve, reject) => {
    const child = spawn(getCommitCommand(), [], {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      resolve({ code: code ?? 1, signal });
    });
  });
}

function readLatestCommitMessage() {
  return new Promise((resolve, reject) => {
    const child = spawn("git", ["log", "-1", "--pretty=%B"], {
      cwd,
      stdio: ["ignore", "pipe", "inherit"],
      shell: process.platform === "win32",
    });

    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error("读取最新提交信息失败。"));
    });
  });
}

function writeChangelog(content) {
  fs.writeFileSync(changelogPath, content, { encoding: "utf8" });
}

async function main() {
  const shouldWriteChangelog = await askShouldWriteChangelog();
  const result = await runCommitFlow();

  if (result.code !== 0) {
    process.exit(result.code ?? 1);
  }

  if (!shouldWriteChangelog) {
    process.exit(0);
  }

  const latestCommitMessage = await readLatestCommitMessage();
  const parsedCommit = parseCommitMessage(latestCommitMessage);
  const changelogItem = formatChangelogItem(parsedCommit);
  const currentContent = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, "utf8") : "";
  const nextContent = `${upsertChangelog(currentContent, getTodayString(), changelogItem)}\n`;

  writeChangelog(nextContent);
  output.write("已写入 CHANGELOG.md\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "提交流程执行失败。");
  process.exit(1);
});
