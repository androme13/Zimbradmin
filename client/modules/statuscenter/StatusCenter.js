
/* 
 * LogCenter
 * (C) Androme 2015
 * 
 */
Ext.define('MyDesktop.modules.statuscenter.StatusCenter', {
    extend: 'Ext.ux.desktop.Module',
    requires: [
        'MyDesktop.modules.logcenter.stores.RelayDomains',
        'Ext.toolbar.Spacer',
        'MyDesktop.modules.common.gridStoreOn',
        'MyDesktop.modules.common.proxyOn'
    ],
    id: 'statuscenter-win',
    init: function () {
        var me = this;
        // on charge le fichier css du module
        var idCSS = '' + Math.floor(Math.random() * 100);
        Ext.util.CSS.createStyleSheet('', idCSS);
        Ext.util.CSS.swapStyleSheet(idCSS, 'modules/statuscenter/rsc/style.css');
        /* this.ACL = {
         r : 2, // read minimum level
         w : 4, // write minimum level
         },*/
        this.launcher = {
            menu: 'Logs',
            text: 'Status du système',
            title: 'Centre de status du systeme',
            iconCls: this.id + '-icon',
            shortcutCls: this.id + '-shortcut',
        };
    },
    createWindow: function (refer) {
        var storeMaxValues=30;
        var me = this;
        var cfg = {};
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        var floor = (!floor && floor !== 0) ? 20 : floor;
        var polling;
        var store1 = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'idle', 'sys', 'user', 'irq', 'nice'],
            data: []
        });
        // on peuple le store de 50 valeurs à 0
        for (var i=0;i<=storeMaxValues;i++){
            store1.add({
                name: Math.floor(Math.random() * 100000).toString(),
                idle: 0,
                sys: 0,
                user: 0,
                irq: 0,
                nice: 0
            });
        }
        var chart = Ext.create('Ext.chart.Chart', {
            style: 'background:#fff',
            //animate: true,
            store: store1,
            legend: {
                position: 'bottom'
            },
            axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['idle', 'sys', 'user'],
                    title: 'CPU',
                    grid: {
                        odd: {
                            opacity: 1,
                            fill: '#ddd',
                            stroke: '#bbb',
                            'stroke-width': 1
                        }
                    },
                    minimum: 0,
                    //maximum: 100,
                    adjustMinimumByMajorUnit: 0,
                }, {
                    type: 'Category',
                    //minimum: 0,
                    // maximum: 60,
                    //majorTickSteps: 2,
                    position: 'bottom',
                    fields: ['name'],
                    hidden: true,
                    //title: 'Month of the Year',
                    //grid: true,
                    label: {
                        rotate: {
                            degrees: 90
                        }
                    }
                }],
            series: [
                {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'idle',
                    markerConfig: {
                        type: 'circle',
                        size: 2,
                        radius: 2,
                        'stroke-width': 0
                    },
                    style: {
                      //  stroke: '#003300',
                        //'stroke-width': 20,
                        fill: '#96CA2D',
                        opacity: 0.8
                    }
                }, {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'sys',
                    markerConfig: {
                        type: 'circle',
                        size: 2,
                        radius: 2,
                        'stroke-width': 0
                    },
                    style: {
                        fill: '#FF358B',
                        opacity: 0.8
                    }
                }, {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'user',
                    markerConfig: {
                        type: 'circle',
                        size: 2,
                        radius: 2,
                        'stroke-width': 0
                    },
                    style: {
                        fill: '#01B0F0',
                        opacity: 0.8
                    }
                }
            ]
        });
        if (!win) {
            func = function () {
                ExtRemote.core.DXMonitor.getCPUUsage({},
                        function (result, event) {
                            if (result !== null) {
                                if (store1.getCount() >= storeMaxValues)
                                    store1.removeAt(0);
                                store1.add([{
                                        //name: '',
                                        name: Math.floor(Math.random() * 100000).toString(),
                                        idle: result.data.idle,
                                        sys: result.data.sys,
                                        user: result.data.user,
                                        irq: result.data.irq,
                                        nice: result.data.nice
                                    }]);
                            }
                        }
                );
            };
            desktop.app.timers.add('statusCenterPollCPU', func, 2000);
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
                            //xtype: relayDomainsgrid
                            xtype: chart
                        },
                        {
                            //xtype: myNetworksgrid
                        }
                    ]},
                listeners: {
                    beforeclose: function () {
                        desktop.app.timers.remove('statusCenterPollCPU');
                        //clearInterval(polling);
                    }
                },
                //fonctions
                entryAdd: function (params) {
                    console.log('entryadd:', params);
                },
                entryRemove: function (grid) {
                    console.log(grid.getSelectionModel().getSelection());
                }
                ////////////////////////////////
            });
        }

        win.down('tabpanel').setActiveTab(0);
        return win;
    }
});
