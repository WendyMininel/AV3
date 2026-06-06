import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logStream = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

export const logger = {
  info: (message: string) => {
    const log = `[INFO] ${new Date().toISOString()} - ${message}`;
    console.log(log);
    logStream.write(log + '\n');
  },
  error: (message: string) => {
    const log = `[ERROR] ${new Date().toISOString()} - ${message}`;
    console.error(log);
    logStream.write(log + '\n');
  },
  warn: (message: string) => {
    const log = `[WARN] ${new Date().toISOString()} - ${message}`;
    console.warn(log);
    logStream.write(log + '\n');
  }
};