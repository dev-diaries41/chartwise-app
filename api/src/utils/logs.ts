import fs from 'fs';
import { Time } from '@src/constants/server';
import { readFile, saveFile } from '@src/utils/file';
import { LoggerConfig } from '@src/types';


async function removeOldLogs(logFilePaths: string[], durationInMillis: number) {
  const now = Date.now();

  for (const logFilePath of logFilePaths) {
      try {
          const data = await readFile(logFilePath, 'utf8');
          if (!data) continue;
          
          const logLines = data.split('\n').filter(line => line.trim() !== '');
          const filteredLogs = logLines.filter(log => {
              try {
                  const parsedLog = JSON.parse(log);
                  const logTimestamp = new Date(parsedLog.metadata?.timestamp || parsedLog.timestamp).getTime();
                  return logTimestamp >= (now - durationInMillis);
              } catch (error: any) {
                  console.error(`Error parsing log line in removeOldLogs: ${error.message}`);
                  console.error(`Malformed log line: ${log}`);
                  return false;
              }
          });

          const remainingLogs = filteredLogs.join('\n');
          saveFile(remainingLogs, logFilePath);
      } catch (error: any) {
          console.error(`Error in removeOldLogs: ${error.message}`);
      }
  }
}

async function removeLogsSizeThreshold(logFilePaths: string[], maxSizeMB: number) {
  for (const logFilePath of logFilePaths) {
      try {
          const stats = await fs.promises.stat(logFilePath);
          const fileSizeInBytes = stats.size;
          const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

          if (fileSizeInMB <= maxSizeMB) continue;

          console.log(`Log file size (${fileSizeInMB.toFixed(2)} MB) exceeds threshold. Removing old logs...`);
          const data = await readFile(logFilePath, 'utf8');
          const logLines = data.split('\n').filter(line => line.trim() !== '');
          const remainingLogs = logLines.slice(-Math.ceil(logLines.length * (maxSizeMB / fileSizeInMB))).join('\n');
          saveFile(remainingLogs, logFilePath);
          console.log(`Old logs removed successfully for: ${logFilePath} due to reaching max size threshold`);
      } catch (error: any) {
          console.error(`Error in removeLogsSizeThreshold: ${error.message}`);
      }
  }
}

 export async function manageLogs (manageOpts: LoggerConfig){
    const {rentionTime, maxSizeinMB, logFilePaths } = manageOpts
    const durationInMillis = rentionTime * Time.day;
    await removeOldLogs(logFilePaths, durationInMillis);
    await removeLogsSizeThreshold(logFilePaths, maxSizeinMB);
}

