const express = require("express");
const router = new express.Router();
require("../Model/Connection");
const userDetail = require("../Model/userSchema");
const alertSh = require("../Model/alertSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const email = require("../Controller/emailController");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));


router.post("/api/register", async (req, res) => {
    try {
      const fetchedPswd = req.body.password[0];
      const hashedPswd = await bcrypt.hash(fetchedPswd, 10);
      const fetchedUserDetail = new userDetail({
        firstName: req.body.firstName[0],
        lastName: req.body.lastName[0],
        email: req.body.email[0],
        password: hashedPswd,
      });
      await fetchedUserDetail.save();
      const jwtToken = await fetchedUserDetail.generateAuthToken();
      res.send({
        jwt: jwtToken,
        id: fetchedUserDetail._id,
      });
      console.log(fetchedUserDetail);
      console.log(jwtToken);
    } catch (e) {
      console.log(e);
    }
  });
  
  router.post("/api/login", async (req, res) => {
    try {
      const fetchedUserDetail = req.body;
      const fetchedFromDb = await userDetail.findOne({
        email: req.body.email[0],
      });
      if (fetchedFromDb != null) {
        const pwMatch = await bcrypt.compare(
          fetchedUserDetail.password[0],
          fetchedFromDb.password
        );
        const jwtToken = await fetchedFromDb.generateAuthToken();
        if (pwMatch) {
          res.send({
            loginMatched: true,
            jwt: jwtToken,
            id: fetchedFromDb._id,
          });
        } else {
          res.send({
            loginMatched: false,
          });
        }
      } else {
        res.send({
          loginMatched: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  router.post("/api/notification",async(req,res)=>{
    try{
      const user = await userDetail.findOne({_id:req.body.id});
      if(user){
        res.send(user.notif);
        // console.log(user.notif);
      } 
    }catch(e){
      console.log(e);
    }
  })

  router.post("/api/authcheck", async (req, res) => {
    try {
      const fetchedUserDetail = req.body;
      if(fetchedUserDetail.jwt==null){
          res.send({
              auth : "failed"
          })
          return;
      }
      const verifyToken = jwt.verify(fetchedUserDetail.jwt,process.env.JWTTOKEN_KEY);
        const user = await userDetail.findOne({ _id: verifyToken._id });
        if(user!=null){
          res.send({
              auth : "success"
          })
        }else {
          res.send({
              auth : "failed"
          })
        }
    } catch (e) {
      console.log(e);
    }
  });

  router.post("/api/alert",async(req,res)=>{
    try{
      const fetchData = req.body;
      const updateres = new alertSh(fetchData);
      
      await updateres.save();
      console.log(req.body);
      res.send("got it");
    }catch(e){
      console.log(e);
    }
  })
  router.post("/api/clearNotification",async(req,res)=>{
    try{
      const fetchData = req.body;
      const user = await userDetail.findOne({_id:fetchData.id});
      user.notif = [];
      await user.save();
    }catch(e){
      console.log(e);
    }
  })

module.exports = router;