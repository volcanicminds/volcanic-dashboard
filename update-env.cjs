const fs = require("fs");
const inquirer = require("inquirer").default;
const path = require("path");
require("dotenv").config({ path: "./.env" });

const themesPath = path.join(__dirname, "src", "configuration", "themes");

// Funzione per aggiornare il tema nel file .env
function updateEnv(key, value) {
  const envFilePath = "./.env";
  const envConfig = fs.readFileSync(envFilePath, "utf-8").split("\n");

  const newEnvConfig = envConfig
    .map((line) => {
      if (line.startsWith(key)) {
        return `${key}=${value}`;
      }
      return line;
    })
    .join("\n");

  fs.writeFileSync(envFilePath, newEnvConfig, "utf-8");
  console.info(`Updated ${key} to ${value} in the .env file`);
}

// Funzione per ottenere le cartelle dei temi
function getThemes() {
  if (!fs.existsSync(themesPath)) {
    throw new Error(`The theme directory does not exist: ${themesPath}`);
  }

  const directories = fs
    .readdirSync(themesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (directories.length === 0) {
    throw new Error(`There are no folders in the folder: ${themesPath}`);
  }

  return directories;
}

// Prompt per scegliere il tema
async function chooseTheme() {
  const themes = getThemes();

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "theme",
      message: "Seleziona il tema:",
      choices: themes,
    },
  ]);

  updateEnv("VITE_DEFAULT_THEME", answers.theme);
}

chooseTheme();
