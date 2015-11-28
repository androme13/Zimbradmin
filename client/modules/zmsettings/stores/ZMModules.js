Ext.define('MyDesktop.modules.zmsettings.stores.ZMModules', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMModuleModel',
    storeId: 'zmmodules',
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.core.DXModules.add',
            read: 'ExtRemote.core.DXModules.get',
            update: 'ExtRemote.core.DXModules.update',
            destroy: 'ExtRemote.core.DXModules.destroy'
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
