Ext.define('MyDesktop.modules.zmsettings.stores.ZMModules', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMModuleModel',
    storeId: 'zmmodules',
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXModules.add',
            read: 'ExtRemote.DXModules.get',
            update: 'ExtRemote.DXModules.update',
            destroy: 'ExtRemote.DXModules.destroy'
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
