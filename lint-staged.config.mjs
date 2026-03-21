const PRETTIER_FILE_RE = /\.(js|jsx|ts|tsx|mjs|cjs|cts|mts|css|scss|less|html|json|md|yml|yaml)$/i;
const ESLINT_FILE_RE = /\.(js|jsx|ts|tsx|mjs|cjs|cts|mts)$/i;
const CSPELL_FILE_RE = /\.(js|jsx|ts|tsx|mjs|cjs|cts|mts|md)$/i;

const normalizePath = (file) => file.replaceAll("\\", "/");
const quoteFile = (file) => `"${file}"`;

const chunkFiles = (files, size) => {
  const chunks = [];
  for (let index = 0; index < files.length; index += size) {
    chunks.push(files.slice(index, index + size));
  }
  return chunks;
};

const buildChunkCommands = (baseCommand, files, chunkSize) => {
  if (files.length === 0) {
    return [];
  }

  return chunkFiles(files, chunkSize).map(
    (chunk) => `${baseCommand} ${chunk.map(quoteFile).join(" ")}`,
  );
};

const lintStagedConfig = {
  "*": (stagedFiles) => {
    const files = stagedFiles.map(normalizePath);

    const prettierFiles = files.filter((file) => PRETTIER_FILE_RE.test(file));
    const eslintFiles = files.filter((file) => ESLINT_FILE_RE.test(file));
    const cspellFiles = files.filter((file) => CSPELL_FILE_RE.test(file));

    return [
      ...buildChunkCommands("prettier --write", prettierFiles, 40),
      ...buildChunkCommands("eslint --fix --cache --cache-strategy content", eslintFiles, 15),
      ...buildChunkCommands(
        "cspell lint --config ./cspell.config.mjs --no-progress --gitignore --no-must-find-files",
        cspellFiles,
        20,
      ),
    ];
  },
};

export default lintStagedConfig;
