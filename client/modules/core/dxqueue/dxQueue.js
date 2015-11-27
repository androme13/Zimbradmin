/* 
 * dxQueue
 * (C) Androme 2015
 * V0.1
 */

Ext.define('MyDesktop.modules.core.dxqueue.dxQueue', {
    pool: [],
    maxCalls: 10,
    constructor: function(){
      console.log('init dxqueue');  
    },
    add: function (name, func, dx) {

    },
    engine: function(){
        
    },
    get: function (name) {
        return this.pool;
    },
    pause: function (name) {
        if (name) {
            for (var i = 0; i < this.pool.length; i++) {
                if (this.pool[i].name === name) {
                    clearInterval(interval.id);
                    this.pool[i].id = false;
                    return true;
                }
            }

        }
        return false
    },
    pauseAll: function () {
        if (this.pool.length > 0)
            for (var i = 0; i < this.pool.length; i++) {
                clearInterval(this.pool[i].id);
                this.pool[i].id = false;
                this.pool[i].state = false;
            }
    },
    remove: function (name) {
        if (name) {
            for (var i = 0; i < this.pool.length; i++) {
                if (this.pool[i].name === name)
                {
                    clearInterval(this.pool[i].id);
                    this.pool.splice(i, 1);
                    return true;
                    break;
                }
            }
            return false;
        }
        return false;
    },
    resume: function (name) {
        if (this.pool.length > 0)
            for (var i = 0; i < this.pool.length; i++) {
                if (this.pool[i].name === name) {
                    this.pool[i].id = setInterval(this.pool[i].func, this.pool[i].timer);
                    this.pool[i].state = true;
                    return true
                }
            }
        return false;
    },
    resumeAll: function () {
        if (this.pool.length > 0)
            for (var i = 0; i < this.pool.length; i++) {
                if (this.pool[i].state === false) {
                    this.pool[i].id = setInterval(this.pool[i].func, this.pool[i].timer);
                    this.pool[i].state = true;
                }
            }
    }
});

