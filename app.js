const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}

const articleSchema = {
    title:String,
    content:String
}

const Article = mongoose.model('Article',articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

//chaining of all the rest apis
app.route("/articles")
.get(function(req,res){
  let findDoc  = async () =>{
    let x = await Article.find({});
    res.json(x);
  }
  findDoc();
})
.post(function(req,res){

  const newArticle = new Article({
    title :req.body.title,
    content:req.body.content
  })
  let newArticleSave = async () =>{
  try{
    await newArticle.save();
    res.send("Successfully updated database");
  }
  catch(err){
    res.send(err);
  }
  }
  newArticleSave();
})
.delete(function(req,res){
  const deleteArticle = async () =>{
    try{
      await Article.deleteMany({});
      res.send("Successfully deleted all articles.")
    }
    catch(err){
      res.send(err);
    }
  }
  deleteArticle();
  
});

app.route("/articles/:articleTitle").get(async function(req, res) {
  try {
    const x = await Article.findOne({ title: req.params.articleTitle });
    res.send(x);
  } catch(err) {
    res.send(err);
  }
})
.put(async function(req,res){
  try{
    await Article.updateOne(
      {title:req.params.articleTitle},
      {$set:{title:req.body.title,content:req.body.content}},
      {overwrite:true}
    );
    res.send("Successfully updated!!")
  }
  catch(err){
    res.send(err)
  }
})
.patch(async function(req,res){
  try{
    await Article.updateOne(
      {title:req.params.articleTitle},
      {$set:req.body},
    );
    res.send("Successfully updated!!")
  }
  catch(err){
    res.send(err)
  }
})
.delete(async function(req,res){
  try{
    await Article.deleteOne(
      {title:req.params.articleTitle},
    );
    res.send("Deleted Succesfully!!")
  }
  catch(err){
    res.send(err)
  }
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});