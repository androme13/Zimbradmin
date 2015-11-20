/* 
 * MyNetworks STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.router.stores.MyNetworks', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.router.models.MyNetworkModel',
    storeId: "mynetworks",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXRouter.addMyNetworks',
            read: 'ExtRemote.DXRouter.getMyNetworks',
            update: 'ExtRemote.DXRouter.updateMyNetworks',
            destroy: 'ExtRemote.DXRouter.destroyMyNetworks'
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