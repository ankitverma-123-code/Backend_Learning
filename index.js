const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");


const app = express();

const urlEncodedParser = bodyParser.urlencoded({ extended: true });

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(urlEncodedParser);

// app.get("/", (req, res) => {
//     res.render("todo"); 
// });

const DBURL = "mongodb+srv://ankit:ankit@cluster0.67iwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(DBURL).then(() => { console.log("Connected to database!") }).catch((err) => { 
        console.log(err);
        console.log("Connection failed!"); 
});

const todoSchema = new mongoose.Schema({
        task: String,  
        Description: String 
});

var ToDo = mongoose.model("ToDo", todoSchema);

//for rendering the EJS Module 
app.get("/",(req, res) => {

            ToDo.find({},(err,data)=>{
                if(err){ 
                    res.send("Error 404"); 
                }
                else{
                    res.render("todo.ejs",{tasks:data}); 
                }
            });
});

//after submition of new task
app.post("/",urlEncodedParser, (req, res) => {  
            var todo = new ToDo({
                    task: req.body.task,
                    Description: req.body.Description 
            });

            todo.save((err, todo) => { 
                    if(err){
                        res.redirect('/'); 
                    } 
                    else {
                        res.redirect('/');   
                    } 
            }); 
    //res.redirect("/todo"); 
}); 
 
//if we want to edit the task, so that we are using the put task
app.get("/edit/:id",(req,res)=>{
        var id = req.params.id;
 
        ToDo.find({},(err,data)=>{ 
            if(err){
                console.log(err); 
            }
            else{
                res.render("edit.ejs",{tasks:data,id:id});
            }
        });
});

//edit ka post 

app.post("/edit/:id",(req, res) =>{
    var id = req.params.id;
  
    ToDo.findByIdAndUpdate(
          id,  
          {
            task: req.body.task,
            Description: req.body.Description,
          },
          (err, data) =>{ 
            if (err) {
              console.log(err);
            } 
            else {
              res.redirect("/");
            }
          }
    );
  });

app.listen(3000, () => { 
    console.log("Server is running on port 3000");
});