
/* 
 * LogCenter
 * (C) Androme 2015
 * 
 */
Ext.define('MyDesktop.modules.logcenter.LogCenter', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.logcenter.stores.RouterLogsMailInfo',
        'Ext.toolbar.Spacer',
        'MyDesktop.modules.common.gridStoreOn',
        'MyDesktop.modules.common.proxyOn'
    ],
    id: 'logcenter-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/logcenter/rsc/style.css');
        /* this.ACL = {
         r : 2, // read minimum level
         w : 4, // write minimum level
         },*/
        this.launcher = {
            menu: 'Logs',
            text: 'Gestion des Logs',
            title: 'Gestion des log de Zimbradmin',
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
            var routerLogsMailInfoStore = Ext.create('MyDesktop.modules.logcenter.stores.RouterLogsMailInfo');
            var routerLogsMailInfoGrid = Ext.create('MyDesktop.modules.common.views.pagingrid.PagingGrid', {
                store: routerLogsMailInfoStore,
                rowEditing: false,
                title: 'logs',
                multiSelect: true,
                readOnly: true
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
                            routerLogsMailInfoStore.load();
                        },
                        tabchange: function (tabPanel, newTab, oldTab, eOpts) {
                            if (newTab.store)
                            {
                                if (newTab.store.getCount() == 0)
                                    newTab.store.load();
                            }
                            console.log(newTab);
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
                    items: [
                        {
                            xtype: routerLogsMailInfoGrid
                        },
                        {
                            //xtype: myNetworksgrid
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
