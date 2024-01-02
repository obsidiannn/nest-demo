import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient(
  {log: [{ level: 'query', emit: 'event' }],}
)
export default prisma
