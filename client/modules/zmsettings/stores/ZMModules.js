Ext.define('MyDesktop.modules.zmsettings.stores.ZMModules', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMModuleModel',
    storeId: 'zmmodules',
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXModules.addmodules',
            read: 'ExtRemote.DXModules.getmodules',
            //update: 'ExtRemote.DXModules.updatemodules',
            //destroy: 'ExtRemote.DXModules.destroymodules'
        },
        reader: {
            root: 'data'
        }
    }
});

/*Ext.define('MyDesktop.modules.zmsettings.stores.ZMModules', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMModuleModel',
    storeId:'zmmodules',
    proxy:{
        type:'direct',
        directFn:'ExtRemote.DXModules.getmodules',
        reader:{
            root:'data'
        }
                                               
    }

});*/