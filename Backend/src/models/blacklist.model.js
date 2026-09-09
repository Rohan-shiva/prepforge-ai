const mongoose=require('mongoose');

const blacklistTokensSchema=new mongoose.Schema({
  token:{
    type:String,
    required:[true,"Token is required to be added in blacklist"]
  }
},{
  timestamps:true
});

const tokenBlacklistModel=mongoose.model("blacklistTokens",blacklistTokensSchema);
module.exports=tokenBlacklistModel;