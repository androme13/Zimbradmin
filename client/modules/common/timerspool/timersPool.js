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
            console.log('add', this.get());
            return interval.id;
        }
        return false;
    },
    get: function (name) {
        return this.pool;
    },
    pause: function (name) {
        for (var i = 0; i < this.pool.length; i++) {
            if (this.pool[i].name === name) {
                clearInterval(interval.id);
                this.pool[i].id = false;
                break;
            }
        }
        console.log('pause', this.get());
    },
    pauseAll: function () {
        if (this.pool.length > 0)
            this.pool.every(function (interval, index, pool) {
                clearInterval(interval.id);
                interval.id = false;
                interval.state = false;
                return true;
            });
        console.log('pauseall', this.get());
    },
    remove: function (name) {
        if (name) {
            for (var i = 0; i < this.pool.length; i++) {
                if (this.pool[i].name === name)
                {
                    clearInterval(this.pool[i].id);
                    this.pool.splice(i, 1);
                    console.log('remove', this.get());
                    return true;
                    break;
                }
            }
            ;
            console.log('remove', this.get());
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
        console.log('resume', this.get());
    },
    resumeAll: function () {
        console.log('resumeall', this.pool.length);
        if (this.pool.length > 0)
            for (var i = 0; i < this.pool.length; i++) {
                if (this.pool[i].state === false) {
                    this.pool[i].id = setInterval(this.pool[i].func, this.pool[i].timer);
                    this.pool[i].state = true;
                }
            }
        ;
        console.log('resumeall', this.get());
    }
});

