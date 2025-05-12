// scripts/verify-env.ts
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

function checkCommand(command: string, name: string) {
  try {
    const output = execSync(command, { encoding: "utf8" });
    console.log(`✅ ${name} installed: ${output.trim()}`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} not installed or not working properly`);
    return false;
  }
}

function checkDirectory(dir: string) {
  const fullPath = path.resolve(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Directory exists: ${dir}`);
    return true;
  } else {
    console.error(`❌ Directory missing: ${dir}`);
    return false;
  }
}

// Check core tools
checkCommand("node --version", "Node.js");
checkCommand("npm --version", "npm");
checkCommand("git --version", "Git");
checkCommand("tsc --version", "TypeScript");
checkCommand("python --version", "Python");

// Check MongoDB
try {
  execSync("mongod --version", { encoding: "utf8" });
  console.log("✅ MongoDB installed");
} catch (error) {
  console.error("❌ MongoDB not installed or not in PATH");
}

// Check required directories
const requiredDirs = [
  "app",
  "components",
  "lib",
  "types",
  "tests",
  "scripts",
  "public",
];
const allDirsExist = requiredDirs.every((dir) => checkDirectory(dir));

console.log("\nEnvironment verification complete.");
if (allDirsExist) {
  console.log("✅ Project structure is correctly set up.");
} else {
  console.log("❌ Some directories are missing. Review the project structure.");
}

// === Entry point ===
(() => {
  // Check core tools
  checkCommand("node --version", "Node.js");
  checkCommand("npm --version", "npm");
  checkCommand("git --version", "Git");
  checkCommand("tsc --version", "TypeScript");
  checkCommand("python --version", "Python");

  // Check MongoDB
  try {
    execSync("mongod --version", { encoding: "utf8" });
    console.log("✅ MongoDB installed");
  } catch (error) {
    console.error("❌ MongoDB not installed or not in PATH");
  }

  // Check required directories
  const requiredDirs = [
    "app",
    "components",
    "lib",
    "types",
    "tests",
    "scripts",
    "public",
  ];
  const allDirsExist = requiredDirs.every((dir) => checkDirectory(dir));

  console.log("\nEnvironment verification complete.");
  if (allDirsExist) {
    console.log("✅ Project structure is correctly set up.");
  } else {
    console.log(
      "❌ Some directories are missing. Review the project structure."
    );
  }
})();
