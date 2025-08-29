import { exec } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";

const name = "bettertabz.zip"

let files = readdirSync('dist');

if (existsSync(name))
  rmSync(name)

if (process.platform === 'linux') {
  exec(`zip -r ../${name} ${files.join(" ")}`, {cwd: 'dist'});
} else if (process.platform === 'win32') {
  exec(`tar acvf ../${name} ${files.join(" ")}`, { cwd: 'dist' });
}