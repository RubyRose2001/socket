const http=require("http");
const fs=require("fs");
const path=require("path");
const iosocket=require("socket.io");
let arr=[];
//1创建服务器
//2设置请求头
//3结束响应
//4监听端口号
// console.log(process.getgid())
// var Readable=require("stream").Readable;
// var rs=new Readable()
// rs.push("beep\n")
// rs.push("boon\n")
// rs.push(null)
// rs.pipe(process.stdout)
var https=http.createServer((req,res)=>{
    let url=req.url;
    if(url=="/"){
         url="./index.html"
    }
    var dians=path.extname(url);
    var obj=get(url,dians);
    res.writeHead(200,{
        "Content-Type":obj.type,
    })
    let pathName=""
    console.log(obj.url)
    fs.readFile(obj.url,function(err,data){
        res.end(data)
    })
}).listen(1990,"169.254.30.190",()=> console.log("loding..."))
var ran=""
iosocket.listen(https).on("connection",function(socket){
    socket.on("user",msg=>{
        if(arr.indexOf(msg)==-1){
            socket.ran=msg
            arr.push(socket.ran)
            socket.send(arr)
            socket.emit("heads",socket.ran)
            socket.broadcast.emit("all",socket.ran);
            this.emit("people",arr.length)
        }else{
            socket.emit("errMsg","用户已存在")
        }
    })
    socket.on("sends",msg=>{
        socket.broadcast.emit("sends",msg)
        //socket.broadcast.emit 发送给排除自己的客户端
        socket.emit("myself",msg)
    })
    socket.on("disconnect",function(){
        socket.broadcast.emit("close",socket.ran)
        arr.splice(arr.indexOf(socket.ran),1);
        socket.broadcast.emit("people",arr.length)

    })
    //下线
})
function get(url,dian){
    var o={}
    o.url=__dirname+url;
    switch(dian){
        case ".css":
            o.type="text/css;charset=utf-8";
            break;
        case ".png":
            o.type="image/png;charset=utf-8";
            break;
        case ".jpg":
            o.type="image/jpeg;charset=utf-8";
            break;
        case ".js":
            o.type="application/javascript;charset=utf-8";
            break;
        case ".json":
            o.type="application/json;charset=utf-8";
            break;
        default:
            o.type="text/html;charset=utf-8";
            o.url="./index.html";
    }
    return o;
}

