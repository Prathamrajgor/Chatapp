const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({path:"./config.env"});
const cors=require("cors");
const app =express();
const http=require("http");
const {Server} =require("socket.io");
const path = require("path");



const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["POST","GET","PUT","DELETE"]
    }
});

mongoose.connect(process.env.DATABASE,()=>{
    console.log("Connected to Database Succesfully");
},(err)=>{
    console.log("Error: ",err);
});
const schema= new mongoose.Schema({
    username:String,
    message:String,
    roomid:String,
    date: {
        type: String,
        default: String((new Date()).getDate())+"."+String((new Date()).getMonth())+"."+String((new Date()).getFullYear()) +"  "+String((new Date()).getHours())+":"+String((new Date()).getMinutes())
    },
    admin:{
        type:Boolean,
        default:false
    }
});

const userSchema=new mongoose.Schema({
    username:String,
    password:String
});


let user=mongoose.model("users",userSchema);

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
};

app.use(express.static(path.join("./build")));

app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"build","index.html"))
});

io.on("connection",(socket)=>{
    console.log(socket.id);
    console.log("\n");
    
    socket.on("create-room",(data)=>{
        mongoose.pluralize(null);
        let id=makeid(6);
        let room=mongoose.model(id,schema);
        user.create({
            username:data.username,
            password:data.password
        });
        room.create({
            username:data.username,
            message: `Hey everyone, I am ${data.username}`,
            roomid:id,
            admin:true
        })
        io.to(socket.id).emit("created",{
            roomid:id,
            message:"Room Created Successfully"
        });
        socket.join(id);
        console.log("asiodu hasiod h");
        // socket.emit("created", {
        //     roomid:id,
        //     message: "Room Created Successfully"
        // })
    });
    socket.on("send-message",(data)=>{
        mongoose.pluralize(null);
        socket.to(data.roomid).emit("live-chat",data);
        let room=mongoose.model(data.roomid,schema);
        room.create({
            username:data.username,
            message:data.message,
            roomid:data.roomid
        })
        console.log(data);
    });
    socket.on("join-room",(data)=>{
        mongoose.pluralize(null);
        console.log("Join room");

      let room =mongoose.model(data.roomid,schema);
      room.find({},async (err,response)=>{
          if(response.length==0){
              console.log("if 1");
              console.log("Room Not found");
              io.to(socket.id).emit("receive",{message:"room not found"});
              try{
                  console.log("Before deleting");
                  console.log("While");
                  let a=await mongoose.connection.db.dropCollection(data.roomid).then((res)=>{
                      console.log(res);
                  }).catch((err)=>{
                      console.log(err);
                  })
                  console.log("After deleting",a);
              }catch(err){
                  console.log("Error Occured", err);
              }
          }     
          else{
              console.log("else1");
              user.find({username:data.username, password:data.password},(err,response2)=>{
                  console.log(response2);
                if(response2.length==0 ){
                    console.log("if 2");
                    user.find({username:data.username},(err,response3)=>{
                        if(response3.length===0){
                            console.log("if 3", response3);
                            socket.join(data.roomid);
                            io.to(socket.id).emit("receive",response)
                            user.create({   
                                username:data.username,
                                password:data.password
                            })
                        }
                        else{
                            console.log("else 3");
                            io.to(socket.id).emit('receive',{message:"Wrong username or password"});
                            // mongoose.connection.db.dropCollection(data.roomid);
                        }
                    })
                }
                else{
                    console.log("else 2");
                    socket.join(data.roomid);
                    io.to(socket.id).emit("receive",response);
                }
              })
          }
      })

    });
    socket.on("disconnect",(socket)=>{
    console.log("Disconnected",socket);
});
        
});
    


server.listen(process.env.PORT || 5000,()=>{
    console.log("Server Started Successfully");
});

