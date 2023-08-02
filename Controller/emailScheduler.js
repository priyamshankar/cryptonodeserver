
const email = require("../Controller/emailController");

const axios = require("axios");
const cron = require('node-cron');

const userDetail = require("../Model/userSchema");
const alertSh = require("../Model/alertSchema");

var allData;

async function fetchAllData(){
    try{
        allData = await alertSh.find({});
        alertLogic();
        // console.log(allData[0]);
    }catch(e){
        console.log(e);
    }
}

async function alertLogic(){
    allData.forEach(async(alertData)=>{
        
        const coinPriceData = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${alertData.coinId}&vs_currencies=INR&include_24hr_change=true`);
        const coinPrice = coinPriceData.data;
        const coinPriceInr = coinPrice[alertData.coinId].inr;
        const change24Hr = coinPrice[alertData.coinId].inr_24h_change;
        // const coinPriceInr = 100; //temproarily bypassing the coingecko api since limit reached
        if(coinPriceInr<alertData.min || coinPriceInr>alertData.max){
            const user = await userDetail.findOneAndUpdate(
                { _id: alertData.userId },
                { $push: { notif: { coin: alertData.coinId, price: coinPriceInr } } },
                { new: true }
              );
              
            if(user && alertData.notify){
                email(user.email,`CryptoNodes ${alertData.coinId} Price Alert`,`
                <html lang="en">

                <head>
                 
                
                <body>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs6Tg2yZgWnX6btxk-ozglemLwC8uEXmxxspJvH6HljxW-KDStTRxdwjK8n9Ztd4I1yas&usqp=CAU" >
                  <h1>
                    CryptoNodes
                  </h1>
                  <p>
                    Your ${alertData.coinId} has now reached ${coinPriceInr}. Check out the Progress on CyptoNodes.
                  </p>
                  <p>The change in last 24 hour in ${alertData.coinId} is &{change24Hr}. 
                  <script src="script.js"></script>
                </body>
                
                </html>
                `);
            }
            await alertSh.deleteOne(alertData._id);
            }
        // console.log(alertData._id);
    }) 
}


cron.schedule('1 * * * * *',()=>{
    fetchAllData(); // important! dont forget to uncomment this
    console.log("inside cron");
})