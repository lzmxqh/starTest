var mysql = require('mysql');   // 获取mysql驱动包

/**
 * 创建从 node.js 到 mysql 的连接
 */
var pool = mysql.createPool({
    connectionLimit : 10,   // 最大连接数
    host : 'localhost',     // 主机名 
    user: 'root',           // 账号，密码，创建的数据库
    password: '123456',
    database: 'db_user'
});

// 连接到数据库(可以省略) 直接执行query的话会自动连接
// connection.connect();

var sql = 'select * from t_user where t_user.userName = ? and t_user.password = ?';

var values = [];        // 保存用户名和密码
// var result = {};
var data = {};

var userNameLogins = [];

var DBConn = {};

/**登录 */
DBConn.login = function(data, socket) {

    values = [];
    values.push(data.userName);
    values.push(data.password);

    data = {};

    /**
     * 'select * from t_user'为
     * 在表t_user中查找所有记录 * 是一个通配符 可以理解为 '所有'
     * err:为错误信息
     * rows:为一个记录的集合
     *      rows[0].userName
     * fields:为表中的表头('userName', 'password')
     *      fields[0].name
     */
    pool.query({
        sql: sql,
        values: values
    }, function(err, rows, fields) {

        if(rows.length == 0) {
            data.result = 0;
            console.log("======error=======" ,data);
            socket.emit('S_C_PlayerLogin', data);
        } else {
            // 重名验证
            for(var userName of userNameLogins) {
                if (rows[0]['userName'] == userName) {
                    data.result = 1;
                    console.log("======repeate=======" ,data);
                    socket.emit('S_C_PlayerLogin', data);
                    return;
                }
            }

            data.result = 2;
            userNameLogins.push(rows[0]['userName']);
            console.log("======success=======" ,data);
            socket.emit('S_C_PlayerLogin', data);
        }

        // 一个通用的遍历 for of 语句 可以获得rows的每一行
        // for(var row of rows) {
        //     var result = '';
        //     for(var field of fields) {      // 每一列表头
        //         result += (' ' + row[field.name]);
        //     }
        //     console.log(result);
        // }

    });

};

DBConn.quitGame = function(data, socket) {
    var index = -1;
    for(var i = 0; i < userNameLogins.length; i++) {
        var userName = userNameLogins[i];
        if(userName == data.userName) {
            index = i;
            break;            
        }
    }

    if(index != -1) {
        userNameLogins.splice(index, 1);
    }

};

// connection.end();   // 关闭连接

module.exports = DBConn;