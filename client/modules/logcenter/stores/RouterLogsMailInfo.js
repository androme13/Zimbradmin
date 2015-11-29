/* 
 * RouterLogsMailInfo STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.logcenter.stores.RouterLogsMailInfo', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.logcenter.models.LogMailInfo',
    storeId: "routerlogsmailinfo",
    proxy: {
        type: 'direct',
        api: {
           // create: 'ExtRemote.DXRouter.addMyNetworks',
            read: 'ExtRemote.DXRouter.getRouterLogsMailinfo',
           // update: 'ExtRemote.DXRouter.updateMyNetworks',
           // destroy: 'ExtRemote.DXRouter.destroyMyNetworks'
        },
        reader: {
            root: 'data',
            totalProperty: 'totalCount',
            messageProperty: 'error'
        },
        writer: {
            allowSingle: false
        }
    }
});