import {defineConfig} from "prisma/config";
import { config } from "dotenv";

config()

export default defineConfig({
  schema : "prisma/schema.prisma" ,
   datasource :{
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
   } ,  
   experimental:{
    externalTables : true
   },
   tables: {
    external :[
    "auth.session",
    "auth.user",
    "auth.verification",
    "auth.account"
    ]
   }
})
