/* 
 * RelayDomains STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.router.stores.RelayDomains', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.router.models.RelayDomainModel',
    storeId: "relaydomains",
    proxy: {
        type: 'direct',
        api: {
            create: 'ExtRemote.DXRouter.addRelayDomains',
            read: 'ExtRemote.DXRouter.getRelayDomains',
            update: 'ExtRemote.DXRouter.updateRelayDomains',
            destroy: 'ExtRemote.DXRouter.destroyRelayDomains'
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