// Regenerates the projects table in profile/README.md from the website's projects.toml.
import { readFile, writeFile } from "node:fs/promises";
import { parse } from "smol-toml";

const SOURCE =
	"https://raw.githubusercontent.com/rurrobotics/rurrobotics.github.io/stable/src/content/projects.toml";
const README = new URL("../profile/README.md", import.meta.url);

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`Fetching projects.toml failed: ${res.status}`);
const projects = Object.values(parse(await res.text())).sort(
	(a, b) => (a.order ?? 0) - (b.order ?? 0),
);

const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const known = { opencv: "OpenCV", pcb: "PCB" };
const tag = (t) => known[t] ?? cap(t);
const cell = (t) => String(t).replaceAll("|", "\\|").trim();

const table = [
	"| Project | What it is | Stack |",
	"| --- | --- | --- |",
	...projects.map(
		(p) =>
			`| [**${p.name}**](${p.url}) | ${cell(p.description.en)} | ${(p.tags ?? []).map(tag).join(" · ")} |`,
	),
].join("\n");

const readme = await readFile(README, "utf8");
const updated = readme.replace(
	/(<!-- projects:start -->\n)[\s\S]*?(\n<!-- projects:end -->)/,
	`$1${table}$2`,
);
if (updated === readme) console.log("No changes.");
else {
	await writeFile(README, updated);
	console.log("README updated.");
}
