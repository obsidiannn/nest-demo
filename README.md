npx prisma generate
npm install @prisma/client 


npx prisma migrate save --name init-mongo --preview-feature
npx prisma migrate up --preview-feature
