Ext.define('MyDesktop.modules.zmsettings.stores.ZMModules', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.ZMModule',
    storeId:'zmmodules',
    proxy:{
        type:'direct',
        directFn:'ExtRemote.DXModules.getmodules',
        reader:{
            root:'data'
        }
                                               
    }

});