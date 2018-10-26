// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler: null,
    },

    onLoad () {

    },

    clear: function() {
        this.dataEventHandler = null;
    },

    dispatchEvent: function(event, data) {
        if(this.dataEventHandler) {
            cc.log("======in dataEventHandler====" + event);
            this.dataEventHandler.emit(event, data);
        }
    },

    initGameScene: function(name) {
        this.nextScene = name;
    },

    S_C_PlayerLogin: function(data) {
        this.dispatchEvent(cc.vv.protodata.S_C_PlayerLogin, data);
    },

    S_C_StartGame: function(data) {
        this.dispatchEvent(cc.vv.protodata.S_C_StartGame, data);
    },

    S_C_OtherLogin: function(data) {
        this.dispatchEvent(cc.vv.protodata.S_C_OtherLogin, data);
    },

    S_C_OtherQuit: function(data) {
        this.dispatchEvent(cc.vv.protodata.S_C_OtherQuit, data);
    },

    S_C_OtherMove: function(data) {
        this.dispatchEvent(cc.vv.protodata.S_C_OtherMove, data);
    },

    S_C_OtherMessage: function(data) {
        this.dispatchEvent(cc.vv.protodata.S_C_OtherMessage, data);
    },

    C_S_PlayerLogin: function(data) {
        var data = data;
        cc.vv.net.send(cc.vv.protodata.C_S_PlayerLogin, data);
    },

    C_S_PlayerQuit: function(data) {
        var data = data;
        cc.vv.net.send(cc.vv.protodata.C_S_PlayerQuit, data);
    },

    C_S_StartGame: function(data) {
        var data = data;
        cc.vv.net.send(cc.vv.protodata.C_S_StartGame, data);
    },

    C_S_PlayerMove: function(data) {
        var data = data;
        cc.vv.net.send(cc.vv.protodata.C_S_PlayerMove, data);
    },

    C_S_PlayerMessage: function(data) {
        var data = data;
        cc.vv.net.send(cc.vv.protodata.C_S_PlayerMessage, data);
    },

    C_S_PlayerTile: function(data) {
        var data = data;
        cc.vv.net.send(cc.vv.protodata.C_S_PlayerTile, data);
    },

    disConnect: function() {
        cc.log("=====disconnect=====");
    },

    initHandlers: function() {
        var self = this;

        cc.vv.net.addHandler(cc.vv.protodata.S_C_PlayerLogin, this.S_C_PlayerLogin.bind(this));
        cc.vv.net.addHandler(cc.vv.protodata.S_C_StartGame, this.S_C_StartGame.bind(this));
        
        cc.vv.net.addHandler(cc.vv.protodata.S_C_OtherLogin, this.S_C_OtherLogin.bind(this));
        cc.vv.net.addHandler(cc.vv.protodata.S_C_OtherQuit, this.S_C_OtherQuit.bind(this));
        cc.vv.net.addHandler(cc.vv.protodata.S_C_OtherMove, this.S_C_OtherMove.bind(this));
        cc.vv.net.addHandler(cc.vv.protodata.S_C_OtherMessage, this.S_C_OtherMessage.bind(this));

        cc.vv.net.addHandler(cc.vv.protodata.disConnect, this.disConnect.bind(this));

    },

    connectGameServer: function(url) {

        this.initHandlers();

        var onConnectOk = function() {
            cc.vv.connectSocket = true;
            cc.log("===connected Ok===");
        };

        var onConnectFailed = function() {
            cc.log("===connected Fail===");
        }

        cc.vv.net.connect(url, onConnectOk, onConnectFailed);
    }


    // update (dt) {},
});
