/* 
 * proxyOn
 * (C) Androme 2015
 * 
 */
// fonction générique communes aux modules pour le store.proxy

Ext.define('MyDesktop.modules.common.proxyOn', {
    create: function (storeName) {
        var listener = {
            exception: function (proxy, response, operation) {
                var error = operation.error;
                var title = error.code;
                title += ' (' + error.errno + ') - ';
                title += error.sqlState;
                var message = error.ZMErrorMsg;
                Ext.infoMsg.msg(title, message, 5000, 'red');
                if (operation.action !== 'read')
                {
                    storeName.reload();
                }
            },
            scope: this
        };
        return listener;
    }
});

