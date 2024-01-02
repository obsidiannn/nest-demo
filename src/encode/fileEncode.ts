import { Injectable } from "@nestjs/common";

const crypto = require("crypto");

const key = Buffer.from("1234567890123456", "binary"); // 128位的密钥
const iv = Buffer.from("1234567890123456", "binary"); // 128位的密钥

const fs = require("fs");


const inputPath = "Z:/data/encode/input.pdf";
const outputPath = "Z:/data/encode/output.mp4";
const checkPath = "Z:/data/encode/check.pdf";
const chunkSize = 1024 * 1024 * 2;
// const deSize = chunkSize;
const deSize = 2097168;

@Injectable()
export class FileEncodeUtil {

// 加密函数
  encryptData(data) {
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(true)
    let result = cipher.update(data, "binary", "binary");
    result += cipher.final("binary");
    return result
    // return Buffer.from(result, "binary");
    // return Buffer.concat([cipher.update(data),cipher.final()])
  }

// 解密函数
  decryptData(data) {
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    decipher.setAutoPadding(true)
    let result = decipher.update(data, "binary", "binary");
    result += decipher.final("binary");
    return result;
    // return decipher.update(data)
  }

  fileSplitEncode() {
    fs.unlink(outputPath, () => {
    });
    let chunkIndex = 0;
    const readStream = fs.createReadStream(inputPath, { highWaterMark: chunkSize});
    readStream.on("data", (chunk) => {
      console.log("原始" + chunk.length);
      const encryptedChunk = this.encryptData(chunk); // 加密切片内容
      console.log("完成  " + chunkIndex + "长度" + encryptedChunk.length);
      fs.appendFileSync(outputPath, encryptedChunk, { encoding: "binary" });
      chunkIndex++;
    });

    readStream.on("end", () => {
      console.log("文件分片写入完成");
    });

  }


  fileSplitDecode() {
    fs.unlink(checkPath, () => {
    });
    let chunkIndex = 0;
    const readStream = fs.createReadStream(outputPath, { highWaterMark: deSize });
    readStream.on("data", (chunk) => {
      console.log("原始" + chunk.length);
      const deChunk = this.decryptData(chunk); // 加密切片内容
      console.log("完成  " + chunkIndex + "长度" + deChunk.length);
      fs.appendFileSync(checkPath, deChunk, { encoding: "binary" });
      chunkIndex++;
    });

    readStream.on("end", () => {
      console.log("文件解密完成");
      this.fileCheck();
    });


  }


  // 计算文件的 MD5 散列值
  calculateMD5(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("md5");
      const readStream = fs.createReadStream(filePath, { encoding: "binary" });

      readStream.on("data", (chunk) => {
        hash.update(chunk);
      });

      readStream.on("end", () => {
        const md5Hash = hash.digest("hex");
        resolve(md5Hash);
      });

      readStream.on("error", (err) => {
        reject(err);
      });
    });
  }


  fileCheck() {
    this.calculateMD5(inputPath).then(r => {
      console.log("原始" + r);
    });
    this.calculateMD5(checkPath).then(r => {
      console.log("目标" + r);
    });
  }


// aes-128-cbc加密 pkcs7填充

}
