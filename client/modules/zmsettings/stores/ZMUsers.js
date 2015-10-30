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
            create: 'ExtRemote.core.DXUser.add',
            read: 'ExtRemote.core.DXUser.get',
            update: 'ExtRemote.core.DXUser.update',
            destroy: 'ExtRemote.core.DXUser.destroy'
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