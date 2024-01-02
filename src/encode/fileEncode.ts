import { Injectable } from "@nestjs/common";

const splitFile = require("split-file");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");


const key = Buffer.from('0123456789abcdef', 'utf8'); // 128位的密钥
const iv = Buffer.from('abcdef9876543210', 'utf8'); // 128位的初始向量

const fs = require("fs");

const option = {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  keySize: 128 / 8
};

const inputPath = "Z:/data/encode/input.mp4";
const outputPath = "Z:/data/encode/output.tmp";
const checkPath = "Z:/data/encode/check.mp4";
const chunkSize = 1024 * 1024 * 2;
const deSize = 2097168;
@Injectable()
export class FileEncodeUtil {

// 加密函数
  encryptData(data) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return Buffer.concat([cipher.update(data), cipher.final()]);
  }

// 解密函数
  decryptData(data) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  fileSplitEncode() {
    console.log(key.length);
    splitFile.splitFileBySize(inputPath, chunkSize)
      .then((chunks) => {
        for (let i = 0; i < chunks.length; i++) {
          const chunkData = fs.readFileSync(chunks[i],null); // 读取切片文件内容
          const encryptedChunk = this.encryptData(chunkData); // 加密切片内容
          console.log("完成  " + i + '长度' + encryptedChunk.length);
          // const outputFileName = `${outputDir}/chunk_${i}.enc`; // 生成输出文件名
          fs.appendFile(outputPath, encryptedChunk,null,(e)=>{
            fs.unlink(chunks[i], (err) => {
              if (err) throw err;
              // console.log(`Chunk ${idx + 1} deleted`);
            });
          }); // 写入加密后的切片文件
        }
        console.log('文件加密完成');
      });
  }


  fileSplitDecode() {
    splitFile.splitFileBySize(outputPath, deSize)
      .then(chunks=>{
        console.log(chunks.length);
        for (let i = 0; i < chunks.length; i++) {
          const encryptedChunk = fs.readFileSync(chunks[i], null); // 读取切片文件内容
          // const encryptedChunk = chunks[i]; // 读取切片文件内容
          const decryptedChunk = this.decryptData(encryptedChunk); // 解密切片内容
          console.log('完成' + i);
          fs.appendFile(checkPath, decryptedChunk,null,(e)=>{
            fs.unlink(chunks[i], (err) => {
              if (err) throw err;
              // console.log(`Chunk ${idx + 1} deleted`);
            });
          });
        }
        console.log('文件解密完成');
      })


  }


// aes-128-cbc加密 pkcs7填充

}
