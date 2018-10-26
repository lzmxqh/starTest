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
        tipLabel: cc.Label,
        userNameInput: {
            default: null,
            type: cc.EditBox,
        },
        passwordInput: {
            default: null,
            type: cc.EditBox,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        if(!cc.vv) {
            cc.vv = {};
        }

        this.nextScene = "main";
        cc.director.preloadScene(this.nextScene);

        this.initConnectServer();

    },

    start () {

    },

    initConnectServer: function() {
        if(cc.vv.connectSocket) {
            this.initEventHandlers();
            return;
        }

        cc.vv.net = require('Net');

        var ProtoData = require("ProtoData");
        cc.vv.protodata = new ProtoData();
        cc.vv.protodata.init();

        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        this.initEventHandlers();

        var url = 'http://localhost:3000';

        cc.vv.gameNetMgr.connectGameServer(url);

        cc.vv.gameNetMgr.initGameScene(this.nextScene);

    },

    onDestroy: function() {
        console.log("===destroy====");
        this.node.off(cc.vv.protodata.S_C_PlayerLogin, this.S_C_PlayerLogin, this);
    },

    initEventHandlers: function() {
        var self = this;

        if(cc.vv) {
            cc.vv.gameNetMgr.dataEventHandler = this.node;

            this.node.on(cc.vv.protodata.S_C_PlayerLogin, this.S_C_PlayerLogin, this);
        }


    },

    S_C_PlayerLogin: function(data) {
        var data = data.detail;
        console.log("=====S_C_PlayerLogin=====", data);
        switch(data.result) {
            case 0:
                this.popTipFrame("error");
                break;
            case 1:
                this.popTipFrame("repeat");
                break;
            case 2:
                cc.director.loadScene(this.nextScene);
                break;
            default:
                break;
        }
    },

    cbLogin: function() {

        var userName = this.userNameInput.string;
        var password = this.passwordInput.string;

        cc.vv.userName = userName;

        console.log("===userName===", userName);
        console.log("===password===", password);

        // userName = "admin";
        // password = "123";

        // 如果用户名和密码不为空
        if(userName && password) {
            var data = {
                userName: userName, 
                password: password
            };
            cc.vv.gameNetMgr.C_S_PlayerLogin(data);
        } else {
            this.popTipFrame("userName or password is null");
        }
    },

    popTipFrame: function(str) {
        this.tipLabel.node.active = true;
        this.tipLabel.node.opacity = 255;
        this.tipLabel.string = str;
        this.tipLabel.node.runAction(cc.fadeOut(2));
    },

    // update (dt) {},
});
