// 坐标转换工具
var CoordinateUtil = require('coordinateUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Node,
        },
        playerPrefab: {
            default: null,
            type: cc.Prefab,
        },

        quitGame: {
            default: null,
            type: cc.Node,
        },

        messageInput: {
            default: null,
            type: cc.EditBox,
        },

        // 初始瓦片位置 默认 12, 42
        enterTile: cc.v2(12, 42),

        // 初始坐标位置 默认 688, -552
        enterPosition: cc.v2(688, -552),

        // 瓦片尺寸
        tileSize: cc.v2(64, 48),

    },

    onLoad () {
        cc.log("===playerHandler====");

        // 获取坐标转换工具
        this.coordinateutil = new CoordinateUtil(this.enterTile, this.enterPosition, this.tileSize, this.background);

        this.initEventHandlers();

    },

    initEventHandlers: function() {

        var self = this;

        if(cc.vv) {
            cc.vv.gameNetMgr.dataEventHandler = this.node;

            this.node.on(cc.vv.protodata.S_C_StartGame, this.S_C_StartGame, this);
            this.node.on(cc.vv.protodata.S_C_OtherLogin, this.S_C_OtherLogin, this);
            this.node.on(cc.vv.protodata.S_C_OtherQuit, this.S_C_OtherQuit, this);
            this.node.on(cc.vv.protodata.S_C_OtherMove, this.S_C_OtherMove, this);
            this.node.on(cc.vv.protodata.S_C_OtherMessage, this.S_C_OtherMessage, this);

            var data = {
                playerName: cc.vv.userName,
                curTile: this.enterTile,
                location: this.enterPosition
            };
            cc.vv.gameNetMgr.C_S_StartGame(data);
        }

    },

    S_C_StartGame: function(data) {
        cc.log("=====S_C_StartGame=====", data);
    },

    S_C_OtherLogin: function(data) {
        var data = data.detail;
        cc.log("=====S_C_OtherLogin=====", data);

        for(var index in data.userInfos) {

            var item = data.userInfos[index];

            // 玩家名字
            var playerName = item.playerName;
            // 玩家当前瓦片
            var curTile = item.curTile;
            // 玩家最近一次点击
            var location = item.location;
            // 生成玩家实例
            let player = cc.instantiate(this.playerPrefab);
            // 添加到背景中
            this.background.addChild(player);
            // 修改玩家逻辑节点名字
            player.name = playerName;
            // 修改玩家坐标
            player.position = this.coordinateutil.playerPosition(curTile);

            console.log('player.name: ', player.name);
            console.log('player.position: ', player.position);

            // 获取玩家的渲染组件
            let playerComponent = player.getComponent('player');
            // 渲染玩家的名字标签
            playerComponent.setPlayerName(playerName);
            // 设置当前瓦片位置
            playerComponent.setCurTile(curTile);

            //如果是当前玩家 
            if(cc.vv.userName == playerName) {
                // 则让摄像头跟踪这个玩家
                playerComponent.followed();
            }

            // 根据最近一次点击移动玩家
            playerComponent.move(location);

        }

    },

    S_C_OtherQuit: function(data) {
        var data = data.detail;
        cc.log("=====S_C_OtherQuit=====", data);

    },

    S_C_OtherMove: function(data) {
        var data = data.detail;
        cc.log("=====S_C_OtherMove=====", data);

        //移动玩家的名字
        var playerName = data.playerName;
        //移动玩家的最新点击
        var location = data.location;
        //获取玩家的渲染组件
        var playerComponent = this.background.getChildByName(playerName).getComponent('player');
        //根据最新点击移动玩家
        playerComponent.move(location);

    },

    S_C_OtherMessage: function(data) {
        var data = data.detail;
        cc.log("=====S_C_OtherMessage=====", data);

        //发消息的玩家名字
        var playerName = data.playerName;
        //所发送的消息
        var message = data.message;
        //获取玩家的渲染组件
        var playerComponent = this.background.getChildByName(playerName).getComponent('player');
        //绘制消息
        playerComponent.say(message);
    },

    quitGameCB: function() {
        var data = {
            userName: cc.vv.userName
        };
        cc.vv.gameNetMgr.C_S_PlayerQuit(data);
        cc.director.loadScene('start');
    },

    bgClick: function(event) {
        cc.log("===playerMoveClick===", event.getLocation());
        var data = {
            location: this.coordinateutil.convertToBackground(event.getLocation())
        };
        cc.vv.gameNetMgr.C_S_PlayerMove(data);
    },

    sendMessage: function() {
        cc.log("===sendMessage===");

        var data = {message: this.messageInput.string};
        cc.vv.gameNetMgr.C_S_PlayerMessage(data);
        this.messageInput.string = '';
    },
    

});
