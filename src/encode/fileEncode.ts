import { Injectable } from "@nestjs/common";

const splitFile = require("split-file");
const CryptoJS = require("crypto-js");
const key = CryptoJS.enc.Utf8.parse("0123456789abcdef");  // 允许16,24,32字节长度
const iv = CryptoJS.enc.Utf8.parse("abcdef9876543210");   // 只允许16字节长度
const fs = require("fs");

const option = {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  keySize: 128 / 8
};

const inputPath = "Z:/data/encode/input.pdf";
const outputPath = "Z:/data/encode/output.tmp";
const checkPath = "Z:/data/encode/check.pdf";
const chunkSize = 1024 * 1024 * 2;
@Injectable()
export class FileEncodeUtil {

// 加密函数
  encryptData(data) {
    const encrypted = CryptoJS.AES.encrypt(data, key, option);
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

// 解密函数
  decryptData(data) {
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: data }, key, option);
    return decrypted.toString(CryptoJS.enc.Latin1); // 输出二进制格式的解密数据
  }

  fileSplitEncode() {
    let base = "abdjefijisefjsf";

    let encode = this.encryptData(base)
    let decode = this.decryptData(encode)

    console.log(base === decode);
    //
    // splitFile.splitFileBySize(inputPath, chunkSize)
    //   .then((chunks) => {
    //     for (let i = 0; i < chunks.length; i++) {
    //       const chunkData = fs.readFileSync(chunks[i],'binary'); // 读取切片文件内容
    //       const encryptedChunk = this.encryptData(chunkData); // 加密切片内容
    //       console.log("完成  " + i + '长度' + encryptedChunk.length);
    //       // const outputFileName = `${outputDir}/chunk_${i}.enc`; // 生成输出文件名
    //       fs.appendFile(outputPath, encryptedChunk,'base64',(e)=>{
    //         fs.unlink(chunks[i], (err) => {
    //           if (err) throw err;
    //           // console.log(`Chunk ${idx + 1} deleted`);
    //         });
    //       }); // 写入加密后的切片文件
    //     }
    //     console.log('文件加密完成');
    //   });
  }


  fileSplitDecode() {
    splitFile.splitFileBySize(outputPath, chunkSize)
      .then(chunks=>{
        console.log(chunks.length);
        for (let i = 0; i < chunks.length; i++) {
          const encryptedChunk = fs.readFileSync(chunks[i], 'base64'); // 读取切片文件内容
          // const encryptedChunk = chunks[i]; // 读取切片文件内容
          const decryptedChunk = this.decryptData(encryptedChunk); // 解密切片内容
          console.log('完成' + i);
          fs.appendFile(checkPath, decryptedChunk,'binary',(e)=>{
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
