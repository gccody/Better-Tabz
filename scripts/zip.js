import { exec } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";

let files = readdirSync('dist');

if (existsSync("bettertab.zip"))
  rmSync("bettertab.zip")

if (process.platform === 'linux') {
  exec(`zip -r ../bettertab.zip ${files.join(" ")}`, {cwd: 'dist'});
} else if (process.platform === 'win32') {
  exec(`tar acvf ../bettertab.zip ${files.join(" ")}`, { cwd: 'dist' });
}