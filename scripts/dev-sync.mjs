#!/usr/bin/env node
// Lance le site en local ET le garde synchronisé avec GitHub.
//
//   npm run dev:sync
//
// Toutes les 20 secondes, le script vérifie si de nouveaux commits ont été
// poussés sur la branche suivie. Si oui, il les récupère (git pull) et le
// navigateur se recharge tout seul grâce au rechargement à chaud de Next.js.
// Si les dépendances ont changé, il lance `npm install` et redémarre le serveur.
//
// Variables facultatives :
//   SYNC_BRANCH=nom-de-branche   branche à suivre (par défaut : la branche actuelle)
//   SYNC_INTERVAL=20             intervalle de vérification en secondes
//   PORT=3000                    port du site local

import { execSync, spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const interval = Number(process.env.SYNC_INTERVAL ?? 20) * 1000;
const port = process.env.PORT ?? "3000";

const c = { gray: "\x1b[90m", red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", magenta: "\x1b[35m", reset: "\x1b[0m" };
const log = (color, msg) => {
  const heure = new Date().toLocaleTimeString("fr-FR");
  console.log(`${c.gray}${heure}${c.reset} ${c.magenta}[sync]${c.reset} ${color}${msg}${c.reset}`);
};

const git = (args) => execSync(`git ${args}`, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const branch = process.env.SYNC_BRANCH ?? git("rev-parse --abbrev-ref HEAD");
let server = null;
let busy = false;

function startServer() {
  server = spawn(isWindows ? "npx.cmd" : "npx", ["next", "dev", "-p", port], { stdio: "inherit", shell: isWindows });
  server.on("exit", (code, signal) => {
    if (signal !== "SIGTERM" && !restarting) {
      log(c.red, `Le serveur s'est arrêté (code ${code}).`);
      process.exit(code ?? 1);
    }
  });
}

let restarting = false;
async function restartServer() {
  restarting = true;
  log(c.yellow, "Redémarrage du serveur…");
  await new Promise((resolve) => {
    server.once("exit", resolve);
    if (isWindows) execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" });
    else server.kill("SIGTERM");
  });
  restarting = false;
  startServer();
}

async function sync() {
  if (busy) return;
  busy = true;
  try {
    git(`fetch --quiet origin ${branch}`);
    const local = git("rev-parse HEAD");
    const remote = git(`rev-parse origin/${branch}`);
    if (local === remote) return;

    const behind = Number(git(`rev-list --count HEAD..origin/${branch}`));
    const ahead = Number(git(`rev-list --count origin/${branch}..HEAD`));
    if (behind === 0) return; // vous avez des commits locaux pas encore poussés : rien à récupérer

    if (ahead > 0) {
      log(c.red, `Votre branche locale et GitHub ont divergé (${ahead} commit(s) local(aux), ${behind} distant(s)).`);
      log(c.red, `Faites « git pull --rebase origin ${branch} » pour les réunir, la synchro reprendra ensuite.`);
      return;
    }

    const changed = git(`diff --name-only HEAD origin/${branch}`).split("\n");
    const messages = git(`log --format=%s HEAD..origin/${branch}`).split("\n");

    // --autostash : vos modifications locales non commitées sont mises de côté puis réappliquées.
    git(`pull --quiet --ff-only --autostash origin ${branch}`);
    log(c.green, `${behind} nouveau(x) commit(s) récupéré(s) :`);
    messages.forEach((m) => log(c.green, `  • ${m}`));

    if (changed.some((f) => f === "package.json" || f === "package-lock.json")) {
      log(c.yellow, "Les dépendances ont changé : npm install…");
      execSync("npm install", { stdio: "inherit" });
      await restartServer();
    } else if (changed.some((f) => /^next\.config\.|^\.env/.test(f))) {
      await restartServer();
    }
  } catch (err) {
    const msg = (err.stderr || err.message || String(err)).toString().split("\n")[0];
    log(c.red, `Synchronisation impossible pour l'instant : ${msg}`);
  } finally {
    busy = false;
  }
}

log(c.green, `Suivi de la branche « ${branch} » toutes les ${interval / 1000} s. Site : http://localhost:${port}`);
await sync();
startServer();
setInterval(sync, interval);

const stop = () => {
  server?.kill("SIGTERM");
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
