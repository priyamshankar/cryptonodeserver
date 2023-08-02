const express =require("express");
const app=express();
const port=process.env.PORT || 5000;
const router=require("./routes/routes");
require("./Controller/emailScheduler");

// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.use(express.json());

app.listen(port,()=>{
    
})

app.use(router);