const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = process.cwd();
const isWindows = process.platform === 'win32';

const getShell = () => {
  if (!isWindows) {
    return { file: '/bin/sh', argsPrefix: ['-lc'] };
  }

  const systemRoot = process.env.SystemRoot || process.env.WINDIR || 'C:\\Windows';
  const defaultPowerShell = path.join(systemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');

  if (fs.existsSync(defaultPowerShell)) {
    return { file: defaultPowerShell, argsPrefix: ['-NoProfile', '-Command'] };
  }

  return { file: 'powershell.exe', argsPrefix: ['-NoProfile', '-Command'] };
};

const shell = getShell();
const cmsPrefix = path.join(rootDir, 'apps', 'cms').replace(/\\/g, '/');
const webPrefix = path.join(rootDir, 'apps', 'web').replace(/\\/g, '/');

const commands = [
  {
    name: 'cms',
    cwd: rootDir,
    command: `npm --prefix=${cmsPrefix} run develop`,
  },
  {
    name: 'web',
    cwd: rootDir,
    command: `npm --prefix=${webPrefix} run dev`,
  },
];

const children = [];
let shuttingDown = false;

console.log(`[dev] Shell: ${shell.file}`);

const stopAll = (signal = 'SIGTERM') => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
};

for (const command of commands) {
  console.log(`[dev] Iniciando ${command.name}: ${command.command}`);

  const child = spawn(shell.file, [...shell.argsPrefix, command.command], {
    cwd: command.cwd,
    env: process.env,
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      console.error(`[${command.name}] terminó (${signal ?? code ?? 0}). Cerrando el resto de procesos...`);
      stopAll('SIGTERM');
      process.exit(code ?? 0);
    }
  });

  child.on('error', (error) => {
    console.error(`[${command.name}] error al iniciar:`, error);
    stopAll('SIGTERM');
    process.exit(1);
  });

  children.push(child);
}

process.on('SIGINT', () => {
  stopAll('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll('SIGTERM');
  process.exit(0);
});
