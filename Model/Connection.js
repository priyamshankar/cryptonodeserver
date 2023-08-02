const mongoose = require ("mongoose");
require("dotenv").config();

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.mm8t5ka.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery",false);
mongoose.connect(url).then(()=>{
    
}).catch((e)=>{
    console.log(e);
})

