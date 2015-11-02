/* 
 * UserWizardModules Store
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.stores.UserWizardModules', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.zmsettings.models.UserWizardModuleModel',
    storeId: 'zmmodules',
    proxy: {
        type: 'direct',
        api: {
            //create: 'ExtRemote.core.DXModules.add',
            read: 'ExtRemote.core.DXUser.getmodules',
            //update: 'ExtRemote.core.DXModules.update',
            //destroy: 'ExtRemote.core.DXModules.destroy'
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
