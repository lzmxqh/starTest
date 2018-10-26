var express = require('express');           // 获取web框架express框架方法
var app = express();                        // 调用构造方法，那么app就是一个服务器
var http = require('http').Server(app);     // 一个包装
var io = require('socket.io')(http);        // 又是一层包装

// 这句话就是说 如果你访问 "http://localhost:3000/A.html"
// 其实就是访问 starServer.js同级目录下 public 文件夹下的 A.html
app.use(express.static(__dirname + '/public')); 

// 保存用户连接 
var userConnects = {};

// 保存用户信息 目前只有当前所在瓦片信息 curTile 和最近一次点击的位置location
var userInfos = {};

var DBConn = require('./dbconn');

/**
 * connection 是 socket.io内置的事件
 * 当有人访问 "http://localhost:3000/A.html 时会调用function函数"
 */
io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('C_S_PlayerLogin', function(data) {
        bindListener(socket, 'C_S_PlayerLogin', data);
    });

    socket.on('C_S_StartGame', function(data) {
        bindListener(socket, 'C_S_StartGame', data);
    });

    socket.on('C_S_PlayerQuit', function(data) {
        bindListener(socket, 'C_S_PlayerQuit', data);
    });

    socket.on('C_S_PlayerMove', function(data) {
        bindListener(socket, 'C_S_PlayerMove', data);
    });

    socket.on('C_S_PlayerMessage', function(data) {
        bindListener(socket, 'C_S_PlayerMessage', data);
    });

    socket.on('C_S_PlayerTile', function(data) {
        bindListener(socket, 'C_S_PlayerTile', data);
    });

});

var bindListener = function(socket, event, data) {
    switch(event) {
        case 'C_S_PlayerLogin': {   
            // 保存用户名
            socket.name = data.userName;
            console.log("登录-用户名为: " + socket.name);

            // 保存连接
            userConnects[socket.name] = socket;

            // 连接数据库，搜索用户
            DBConn.login(data, socket);
        }
            break;
        case 'C_S_StartGame': {
            //保存新玩家的当前所在瓦片和最近一次点击位置
            userInfos[socket.name] = data;
            
            var userInfo = {};
            userInfo[socket.name] = userInfos[socket.name];
            var data_1 = {
                userInfos: userInfo
            };
            // 广播其他用户绘制这个新玩家
            socket.broadcast.emit('S_C_OtherLogin', data_1);

            var data_2 = {
                userInfos: userInfos
            };
            // 发送给当前新玩家目前所有在线玩家的信息(信息包括自己)
            socket.emit('S_C_OtherLogin', data_2);

        }
            break;
        case 'C_S_PlayerQuit': {
            
        }
            break;
        case 'C_S_PlayerMove': {
            console.log("====C_S_PlayerMove====");

            //更新该玩家最近的一次点击
            userInfos[socket.name].location = data.location;
            //全局广播该点击 所有客户端集体绘制该玩家的移动
            var data_1 = {
                playerName: socket.name,
                location: data.location
            };
            io.sockets.emit('S_C_OtherMove', data_1);
        }
            break;
        case 'C_S_PlayerMessage': {
            var data_1 = {
                playerName: socket.name,
                message: data.message
            };
            io.sockets.emit('S_C_OtherMessage', data_1);
        }
            break;
        case 'C_S_PlayerTile': {
            // 更新瓦片
            userInfos[socket.name].curTile = data.curTile;
        }
            break;
    }
};

/**
 * 监听3000端口
 */
http.listen(3000, function() {
    console.log('listening on : 3000');
});

