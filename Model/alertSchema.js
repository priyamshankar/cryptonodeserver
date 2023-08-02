const mongoose = require("mongoose");



const alertSchemadet = new mongoose.Schema({
    userId : String,
    min : Number,
    max : Number,
    coinId:String,
    notify:Boolean,
});


const alertDetail = new mongoose.model("alertDetail",alertSchemadet);
module.exports = alertDetail;