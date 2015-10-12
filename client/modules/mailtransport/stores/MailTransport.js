//
Ext.define('MyDesktop.modules.mailtransport.stores.MailTransport', {
    extend: 'Ext.data.Store',
    model: 'MyDesktop.modules.mailtransport.models.MailTransportModel',
    storeId: "mailtransport",
    proxy: {
        type: 'direct',
        api: {
            //create: 'ExtRemote.DXUser.addusers',
            read: 'ExtRemote.DXTransport.get',
            //read: 'ExtRemote.DXUser.getusers',
            //update: 'ExtRemote.DXUser.updateusers',
            //destroy: 'ExtRemote.DXUser.destroyusers'
        },
        reader: {
            root: 'data',
            totalProperty: 'totalCount',
            messageProperty: 'message'
        },
    }
});