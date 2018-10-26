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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    init: function() {
        
        this.C_S_PlayerLogin = "C_S_PlayerLogin";
        this.C_S_StartGame = "C_S_StartGame";
        this.C_S_PlayerQuit = "C_S_PlayerQuit";     // 发送退出游戏
        this.C_S_PlayerMove = "C_S_PlayerMove";     // 发送玩家移动
        this.C_S_PlayerMessage = "C_S_PlayerMessage";   // 发送玩家消息
        this.C_S_PlayerTile = "C_S_PlayerTile";     // 发送玩家当前瓦片位置

        this.S_C_PlayerLogin = "S_C_PlayerLogin";     // 玩家登录
        this.S_C_StartGame = "S_C_StartGame";         // 开始游戏
        this.S_C_OtherLogin = "S_C_OtherLogin";       // 在线玩家登录
        this.S_C_OtherQuit = "S_C_OtherQuit";         // 在线玩家离线
        this.S_C_OtherMove = "S_C_OtherMove";         // 在线玩家移动
        this.S_C_OtherMessage = "S_C_OtherMessage";   // 在线玩家消息

        this.disconnect = 'disconnect';

    }

    // update (dt) {},
});
