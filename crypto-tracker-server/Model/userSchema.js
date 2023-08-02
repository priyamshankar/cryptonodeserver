require ("dotenv").config();
const mongoose = require("mongoose");
const jwt = require ("jsonwebtoken");


const userDetailSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    notif:[
      {
        coin:String,
        price:Number,

      }
    ],
    tokens: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
});


userDetailSchema.methods.generateAuthToken = async function () {
    try{
        const token = await jwt.sign(
            { _id: this._id.toString() },
            process.env.JWTTOKEN_KEY
          );
          this.tokens = this.tokens.concat({ token: token });
          await this.save();
          return token;
    }catch(e){
        console.log(e);
    }
};

const userDetail = new mongoose.model("userDetail",userDetailSchema);
module.exports = userDetail;