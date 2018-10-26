// 寻路工具
var PathUtil = require('pathUtil');

cc.Class({
    extends: cc.Component,

    properties: {
        // 当前瓦片，默认 12 42
        curTile: cc.v2(12, 42),

        // 当前动画是否移动的标识, 这是分离点击逻辑和移动渲染的关键
        stop: true,

        // 移动速度控制参数
        ratio: 1,

        // 瓦片尺寸 默认为 64, 48
        tileSize: cc.v2(64, 48),

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获取地图节点
        this.background = this.node.parent;

        // 获取名字标签
        this.playerNameLabel = this.node.getChildByName('playerNameNode').getComponent(cc.Label);

        // 获取对话框标签
        this.messageLabel = this.node.getChildByName('message').getComponent(cc.Label);

        // 获取寻路工具
        this.pathutil = new PathUtil(this.node, this.ratio, this.tileSize);

    },

    // 绘制聊天信息
    say: function(message) {
        this.messageLabel.string = message;
        console.log(message);

        var self = this;
        // 5秒后聊天消息消失
        setTimeout(() => {
            self.messageLabel.string = '';
        }, 5000);
    },

    //让该玩家成为地图跟随的对象， 保证摄像头对该玩家进行跟踪
    followed: function() {
        // 成为地图跟随的对象
        this.background.getComponent('background').follow(this.node);
    },

    // 设置玩家名字
    setPlayerName: function(playerName) {
        this.playerNameLabel.string = playerName;
    },

    // 设置当前瓦片
    setCurTile(curTile) {
        this.curTile = curTile;
    },

    //移动的点击逻辑部分 参数为点击在地图的坐标
    move: function(location) {
        // 获取A*路径
        this.path = this.pathutil.convertToAStarPath(location, this.curTile);
        //如果已经停止移动， 就提醒继续新的绘制移动
        if(this.stop) {
            this._move();
        }
    },

    // 移动的渲染部分
    _move: function() {

        cc.log("====this.background=====", this.background.x, this.background.y);
        cc.log("====this.node=====", this.node.x, this.node.y);

        //移动标志位开启
        this.stop = false;

        // 如果已经移动到了目标瓦片上
        if(this.path.length == 0) {
            //移动标志位关闭
            this.stop = true;
            // 退出移动的递归
            return;
        }

        // 取出下一个瓦片
        var step = this.path.shift();
        // 本地更新瓦片位置
        this.curTile = cc.v2(step.x, step.y);

        // 远程更新瓦片位置
        var data = {curTile: this.curTile};
        cc.vv.gameNetMgr.C_S_PlayerTile(data);

        // 移向该瓦片
        this.node.runAction(
            cc.sequence(
                cc.moveBy(
                    //移动速度  
                    this.pathutil.playerSpeed(step),
                    //移动位置(瓦片坐标转成直角坐标系坐标)
                    this.pathutil.playerStep(step)
                ),  
                cc.callFunc(this._move, this)   //移动完继续递归所在方法取得下一个瓦片
            )
        );

    },

    // update (dt) {},
});
