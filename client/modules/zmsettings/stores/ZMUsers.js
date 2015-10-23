/* 
 * ZMUsers STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.stores.ZMUsers', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMUserModel',
    storeId: "zmusers",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXUser.addusers',
            read: 'ExtRemote.DXUser.get',
            update: 'ExtRemote.DXUser.updateusers',
            destroy: 'ExtRemote.DXUser.destroyusers'
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