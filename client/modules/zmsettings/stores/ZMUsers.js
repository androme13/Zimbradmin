Ext.define('MyDesktop.modules.zmsettings.stores.ZMUsers', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMUserModel',
    storeId: "zmusers",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXUser.addusers',
            read: 'ExtRemote.DXUser.getusers',
            update: 'ExtRemote.DXUser.updateusers',
            destroy: 'ExtRemote.DXUser.destroyusers'
        },
        reader: {
            root: 'data'
        },
    }
});