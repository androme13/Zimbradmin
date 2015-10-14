
Ext.define('MyDesktop.modules.mailtransport.MailTransport', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.mailtransport.stores.MailTransport',
        'Ext.data.TreeStore',
        'Ext.layout.container.Accordion',
        'Ext.toolbar.Spacer',
        'Ext.tree.Panel'
    ],
    id: 'mailtransport-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/mailtransport/rsc/style.css');
        this.launcher = {
            menu: 'Smtp',
            text: 'Transport des emails',
            title: 'Gestion du transport des emails',
            iconCls: this.id + '-icon',
            shortcutCls: this.id + '-shortcut',
        };
    },
    createWindow: function (refer) {
        var me = this;
        var cfg = {};
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            // configuration et création du store
            var MailTransportGridStore = Ext.create('MyDesktop.modules.mailtransport.stores.MailTransport');
            MailTransportGridStore.on({
                update: function (store, record, operation, modifiedFieldNames, eOpts) {
                    if (record.dirty == false)
                        store.reload();
                },
                scope: this
            });
            MailTransportGridStore.proxy.on({
                exception: function (proxy, response, operation) {
                    //var operation = store.getProxy().getReader().rawData.message;
                    var error = operation.error;
                    var title = error.code;
                    title += ' (' + error.errno + ') - ';
                    title += error.sqlState;
                    Ext.infoMsg.msg(title, error.message, 5000, 'red');
                    if (operation.action != 'read')
                    {
                        Ext.data.StoreManager.get('mailtransport').reload();
                    }

                },
                scope: this
            });
            // configuration et création du grid
            cfg = {
                store: MailTransportGridStore,
                rowEditing: true,
                title: 'transport de mails',
                multiSelect: true,
            };
            var MailTransportGrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', cfg);

            win = desktop.createWindow({
                id: this.id,
                title: this.launcher.title,
                width: 500,
                height: 400,
                iconCls: this.launcher.iconCls,
                //animCollapse: false,
                //constrainHeader: true,
                bodyBorder: Ext.themeName !== 'neptune',
                layout: 'fit',
                items: {
                    xtype: 'tabpanel',
                    listeners: {
                        afterrender: function () {
                            MailTransportGridStore.load();
                        },
                        tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                            if (newTab.store)
                            {
                                if (newTab.store.getCount() == 0)
                                    newTab.store.load();
                            }
                            console.log(newTab);
                            //tabPanel.setSize(200, 400);
                        },
                        activate: function (tab, eOpts) {
                            console.log(tab);
                        },
                        entryAdd: function (params) {
                            this.up().entryAdd(params);
                        },
                        entryRemove: function (grid) {
                            // console.log(this.up());
                            this.up().entryRemove(grid);
                        }
                    },
                    //tabPosition:'left',
                    items: [{
                            xtype: MailTransportGrid,
                        }
                    ]},
                //fonctions

                entryAdd: function (params) {
                    console.log('entryadd:', params);
                },
                entryRemove: function (grid) {
                    console.log(grid.getSelectionModel().getSelection());
                },
                ////////////////////////////////
            });
        }

        win.down('tabpanel').setActiveTab(0);
        return win;
    }
});
