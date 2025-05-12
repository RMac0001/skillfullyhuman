"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/verify-env.ts
var fs = require("node:fs");
var path = require("node:path");
var node_child_process_1 = require("node:child_process");
function checkCommand(command, name) {
  try {
    var output = (0, node_child_process_1.execSync)(command, {
      encoding: "utf8",
    });
    console.log("\u2705 ".concat(name, " installed: ").concat(output.trim()));
    return true;
  } catch (error) {
    console.error(
      "\u274C ".concat(name, " not installed or not working properly")
    );
    return false;
  }
}
function checkDirectory(dir) {
  var fullPath = path.resolve(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log("\u2705 Directory exists: ".concat(dir));
    return true;
  } else {
    console.error("\u274C Directory missing: ".concat(dir));
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
  (0, node_child_process_1.execSync)("mongod --version", { encoding: "utf8" });
  console.log("✅ MongoDB installed");
} catch (error) {
  console.error("❌ MongoDB not installed or not in PATH");
}
// Check required directories
var requiredDirs = [
  "app",
  "components",
  "lib",
  "types",
  "tests",
  "scripts",
  "public",
];
var allDirsExist = requiredDirs.every(function (dir) {
  return checkDirectory(dir);
});
console.log("\nEnvironment verification complete.");
if (allDirsExist) {
  console.log("✅ Project structure is correctly set up.");
} else {
  console.log("❌ Some directories are missing. Review the project structure.");
}
// === Entry point ===
(function () {
  // Check core tools
  checkCommand("node --version", "Node.js");
  checkCommand("npm --version", "npm");
  checkCommand("git --version", "Git");
  checkCommand("tsc --version", "TypeScript");
  checkCommand("python --version", "Python");
  // Check MongoDB
  try {
    (0, node_child_process_1.execSync)("mongod --version", {
      encoding: "utf8",
    });
    console.log("✅ MongoDB installed");
  } catch (error) {
    console.error("❌ MongoDB not installed or not in PATH");
  }
  // Check required directories
  var requiredDirs = [
    "app",
    "components",
    "lib",
    "types",
    "tests",
    "scripts",
    "public",
  ];
  var allDirsExist = requiredDirs.every(function (dir) {
    return checkDirectory(dir);
  });
  console.log("\nEnvironment verification complete.");
  if (allDirsExist) {
    console.log("✅ Project structure is correctly set up.");
  } else {
    console.log(
      "❌ Some directories are missing. Review the project structure."
    );
  }
})();
