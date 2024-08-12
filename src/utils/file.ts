import fs from 'fs';
import path from 'path';
import https from 'http';


export function saveFile(data: string | Buffer | Uint8Array, filename: string, encoding?: BufferEncoding)  {
    // Extract the directory from the filename
    const dir = path.dirname(filename);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create the write stream and save the data
    const writeStream = fs.createWriteStream(filename, {encoding});
    writeStream.write(data,);
    writeStream.end();
    writeStream.on('finish', () => {
        console.log('Data saved to', filename);
    });
    writeStream.on('error', (err) => {
        console.error('Error writing to file:', err);
    });
}


export async function readFile(filename: string, encoding:   BufferEncoding = 'utf8' ): Promise<string> {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filename, { encoding });
        let data = '';
        
        readStream.on('data', (chunk) => {
            data += chunk;
        });

        readStream.on('end', () => {
            resolve(data);
        });

        readStream.on('error', (err) => {
            reject(err);
        });
    });
}

export async function downloadFile(url: string, filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
  
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
  
        res.on('error', (err) => {
          reject(`Error downloading file: ${err}`);
        });
  
        fileStream.on('finish', () => {
          resolve(`File downloaded successfully to ${filePath}`);
        });
      });
    });
  }
