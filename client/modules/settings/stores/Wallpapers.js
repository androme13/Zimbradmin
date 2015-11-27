Ext.define('MyDesktop.modules.settings.stores.Wallpapers', {
    extend: 'Ext.data.TreeStore',
    model: 'MyDesktop.modules.settings.models.WallpaperModel',
    storeId:"wallpapers",
    proxy:{
        type:'direct',
        directFn:'ExtRemote.core.DXUser.getwallpapers',
        reader:{
            root:'data'
        }                                         
    },
});