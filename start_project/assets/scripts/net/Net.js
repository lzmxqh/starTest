// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Global = cc.Class({
    extends: cc.Component,

    statics: {
        sio: null,
        handlers: {},

        connect: function(url, callbackOk, callbackFail) {
            if(cc.sys.isNative) {
                window.io = SocketIO;
            } else {
                window.io = require('socket.io');
            }

            var self = this;
            cc.log("==connect data==", url);
    
            this.sio = window.io.connect(url);

            this.sio.on('reconnect', function() {
                cc.log('reconnection');
            });

            this.sio.on('connect', function(data) {
                self.sio.connected = true;
                callbackOk(data);
            });

            this.sio.on('disconnect', function(data) {
                cc.log('disconnect');
                self.sio.connected = false;
                self.close();
            });
    
            for(var key in this.handlers) {
                var value = this.handlers[key];
                if(typeof(value) == "function") {
                    if(key == 'disconnect') {
                        this.fnDisconnect = value;
                    } else {
                        this.sio.on(key, value);
                    }
                }
            }
        },  
    
        send: function(event, data) {
            if(this.sio) {
                this.sio.emit(event, data);
            }
        },
    
        addHandler: function(event, callback) {
            if(this.handlers[event]) {
                return;
            }
            cc.log("======registered  event:" + event);
    
            var handler = function(data) {

                if(event != "disconnect" && typeof(data) == "string") {
                    data = JSON.parse(data);
                }

                cc.log("=====getScoket====" + event,data);
    
                callback(data);
            };
    
            this.handlers[event] = handler;
            if(this.sio) {
                this.sio.on(event, handler);
            }
        },

        close: function() {
            
            if(this.sio && this.sio.connected) {
                this.sio.connected = false;
                this.sio.disconnect();
            }

            this.sio = null;

            if(this.fnDisconnect) {
                this.fnDisconnect();
                this.fnDisconnect = null;
            }

        },


    },

});
