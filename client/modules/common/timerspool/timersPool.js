/* 
 * timersPool
 * (C) Androme 2015
 * 
 */
// state : 0 pause, 1 run
Ext.define('MyDesktop.modules.common.timerspool.timersPool', {
    pool: [],
    add: function (func, timer) {
        if (func && timer > 0)
        {
            var interval = {};
            interval.func = func;
            interval.timer = timer;
            interval.id = setInterval(interval.func, interval.timer);
            interval.state = true;
            this.pool.push(interval);
            console.log(this.pool);
            return interval.id;
        }
        return false;
    },
    remove: function (id) {
        if (id) {
            clearInterval(id);
            this.pool.every(function (interval, index, pool) {
                if (interval.id === id)
                {
                    pool.splice(index, 1);
                    return false;
                }
                return true;
            });
            return true;
        }
        return false;
    },
    pauseAll: function(){
        this.pool.every(function (interval, index, pool) {
            pool[index].state=false;
            
        });
    }
});

