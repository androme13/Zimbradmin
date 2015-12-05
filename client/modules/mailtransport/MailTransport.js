/* 
 * MailTransport module
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.mailtransport.MailTransport', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.mailtransport.stores.MailTransport',
        'Ext.toolbar.Spacer',
        'MyDesktop.modules.common.gridStoreOn',
        'MyDesktop.modules.common.proxyOn'
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
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        if (!win) {
            // création et configuration du store       
            var gridStore = Ext.create('MyDesktop.modules.mailtransport.stores.MailTransport');           
            // utilisation des routines génériques pour les listeners
            var gridStoreOn = Ext.create('MyDesktop.modules.common.gridStoreOn');
            var proxyOn = Ext.create('MyDesktop.modules.common.proxyOn');
            gridStore.on(gridStoreOn.create());
            gridStore.proxy.on(proxyOn.create(gridStore));
            // création et configuration du grid
            var grid = Ext.create('MyDesktop.modules.common.views.paginggrid.PagingGrid', {
                store: gridStore,
                rowEditing: true,
                title: 'transport de mails',
                multiSelect: true
            });

            win = desktop.createWindow({
                id: this.id,
                title: this.launcher.title,
                width: 500,
                height: 400,
                iconCls: this.launcher.iconCls,
                bodyBorder: Ext.themeName !== 'neptune',
                layout: 'fit',
                items: {
                    xtype: 'tabpanel',
                    listeners: {
                        afterrender: function () {
                            gridStore.load();
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
                    items: [{
                            xtype: grid,
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
