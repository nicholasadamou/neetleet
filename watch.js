const chokidar = require("chokidar");
const { exec } = require("child_process");

const copyPublic = () => {
	exec("pnpm copy-public", (err, stdout, stderr) => {
		if (err) {
			console.error(`Error copying public files: ${stderr}`);
			return;
		}
		console.log(stdout);
	});
};

// Watch `public/` for changes
const watcher = chokidar.watch("public/**/*", {
	persistent: true
});

watcher.on("change", (path) => {
	console.log(`File changed: ${path}`);
	copyPublic();
});

// Start TypeScript watcher
const tscWatch = exec("tsc --watch");
tscWatch.stdout.on("data", (data) => console.log(data));
tscWatch.stderr.on("data", (data) => console.error(data));
