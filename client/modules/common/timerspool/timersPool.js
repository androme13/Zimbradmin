/* 
 * timersPool
 * (C) Androme 2015
 * V0.1
 */
// state : 0 pause, 1 run
Ext.define('MyDesktop.modules.common.timerspool.timersPool', {
    pool: [],
    add: function (name, func, timer) {
        if (name && func && timer > 0)
        {
            // on verfie si un interval avec le même
            // nom n'existe pas deja
            if (this.pool.length > 0)
            {
                for (var i = 0; i < this.pool.length; i++) {
                    if (this.pool[i].name === name)
                        return false;
                }
            }
            // on fabrique l'interval
            var interval = {};
            interval.name = name;
            interval.func = func;
            interval.timer = timer;
            interval.id = setInterval(interval.func, interval.timer);
            interval.state = true;
            this.pool.push(interval);
            return interval.id;
        }
        return false;
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
        else return false
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
                    break;
                }
            }
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

