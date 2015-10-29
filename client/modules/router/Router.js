
Ext.define('MyDesktop.modules.router.Router', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.router.stores.RelayDomains',
        'Ext.toolbar.Spacer',
        'MyDesktop.modules.common.gridStoreOn',
        'MyDesktop.modules.common.proxyOn'
    ],
    id: 'router-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/router/rsc/style.css');
        this.ACL = {
          r : 2, // read minimum level
          w : 4, // write minimum level
        },
        this.launcher = {
            menu: 'Smtp',
            text: 'Gestion du routeur',
            title: 'Gestion du routeur SMTP',
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
            var relayDomainsStore = Ext.create('MyDesktop.modules.router.stores.RelayDomains');
            // utilisation des routines génériques pour les listeners
            var gridStoreOn = Ext.create('MyDesktop.modules.common.gridStoreOn');
            var proxyOn = Ext.create('MyDesktop.modules.common.proxyOn');
            relayDomainsStore.on(gridStoreOn.create());
            relayDomainsStore.proxy.on(proxyOn.create(relayDomainsStore));

            var relayDomainsgrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
                store: relayDomainsStore,
                rowEditing: true,
                title: 'relays_domain',
                multiSelect: true,
            });

            var myNetworksStore = Ext.create('MyDesktop.modules.router.stores.MyNetworks');
            // utilisation des routines génériques pour les listeners
            var gridStoreOn = Ext.create('MyDesktop.modules.common.gridStoreOn');
            var proxyOn = Ext.create('MyDesktop.modules.common.proxyOn');
            myNetworksStore.on(gridStoreOn.create());
            myNetworksStore.proxy.on(proxyOn.create(myNetworksStore));

            var myNetworksgrid = Ext.create('MyDesktop.modules.common.views.PagingGrid', {
                store: myNetworksStore,
                rowEditing: true,
                title: 'my_networks',
                multiSelect: true,
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
                            relayDomainsStore.load();
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
                            xtype: relayDomainsgrid
                        },
                        {
                            xtype: myNetworksgrid
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
