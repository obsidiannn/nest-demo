import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import prisma from "./prisma";
import { FileEncodeUtil } from "./encode/fileEncode";

@Controller("user")
export class AppController {


  constructor(private readonly encodeUtil: FileEncodeUtil) {
  }

  @Get()
  async getAll(): Promise<any> {
    return await prisma.user.findMany();
  }

  @Post()
  async randomInsert() {
    await prisma.user.create({
      data: {
        id: "123",
        email: "drazen08@163.com",
        name: "drazen"
      }
    });
  }

  @Get("encode")
  encode() {
    this.encodeUtil.fileSplitEncode();
  }

  @Get("decode")
  decode(){
    this.encodeUtil.fileSplitDecode();
  }


}
