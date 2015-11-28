
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
        var storeMaxValues = 30;
        var me = this;
        var cfg = {};
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        var floor = (!floor && floor !== 0) ? 20 : floor;
        var polling;
        var storeCPU = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'idle', 'sys', 'user', 'irq', 'nice'],
            data: []
        });
        var storeMEM = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'MemTotal', 'MemFree', 'MemAvailable', 'Buffers','Cached'],
            data: []
        });
        // on peuple le store de 50 valeurs à 0
        for (var i = 0; i <= storeMaxValues; i++) {
            storeCPU.add({
                name: Math.floor(Math.random() * 100000).toString(),
                idle: 0,
                sys: 0,
                user: 0,
                irq: 0,
                nice: 0
            });
        }
        for (var i = 0; i <= storeMaxValues; i++) {
            storeMEM.add({
                name: Math.floor(Math.random() * 100000).toString(),
                MemTotal: 0,
                MemFree: 0,
                MemAvailable: 0,
                Buffers: 0,
                Cached: 0
                //nice: 0
            });
        }
        var chartCPU = Ext.create('Ext.chart.Chart', {
            style: 'background:#fff',
            //animate: true,
            store: storeCPU,
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
                    //adjustMinimumByMajorUnit: 0,
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
                        size: 5,
                        radius: 5
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
                        size: 5,
                        radius: 5
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
                        fill: '#FF358B',
                        opacity: 0.8
                    }
                }, {
                    type: 'line',
                    highlight: {
                        size: 5,
                        radius: 5
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
                        fill: '#01B0F0',
                        opacity: 0.8
                    }
                }
            ]
        });
        var chartMEM = Ext.create('Ext.chart.Chart', {
            style: 'background:#fff',
            //animate: true,
            store: storeMEM,
            legend: {
                position: 'bottom'
            },
            axes: [{
                    type: 'Numeric',
                    position: 'left',
                    fields: ['MemTotal', 'MemFree', 'MemAvailable', 'Cached'],
                    title: 'MEM',
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
                    //adjustMinimumByMajorUnit: 0,
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
                        size: 5,
                        radius: 5
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'MemTotal',
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
                        size: 5,
                        radius: 5
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'MemFree',
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
                        size: 5,
                        radius: 5
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'MemAvailable',
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
                },{
                    type: 'line',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'Buffers',
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
                },{
                    type: 'line',
                    highlight: {
                        size: 5,
                        radius: 5
                    },
                    axis: 'left',
                    fill: true,
                    xField: 'name',
                    yField: 'Cached',
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
                ExtRemote.core.DXMonitor.getZMUsage({},
                        function (result, event) {
                            if (result !== null) {
                                console.log(result);
                                if (storeCPU.getCount() >= storeMaxValues)
                                    storeCPU.removeAt(0);
                                if (storeMEM.getCount() >= storeMaxValues)
                                    storeMEM.removeAt(0);
                                storeCPU.add([{
                                        //name: '',
                                        name: Math.floor(Math.random() * 100000).toString(),
                                        idle: result.data.cpu.idle,
                                        sys: result.data.cpu.sys,
                                        user: result.data.cpu.user,
                                        irq: result.data.cpu.irq,
                                        nice: result.data.cpu.nice
                                    }]);
                                storeMEM.add([{
                                        //name: '',
                                        name: Math.floor(Math.random() * 100000).toString(),
                                        MemTotal: result.data.mem.MemTotal,
                                        MemFree: result.data.mem.MemFree,
                                        MemAvailable: result.data.mem.MemAvailable,
                                        Buffers: result.data.mem.Buffers,
                                        Cached: result.data.mem.Cached
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
                            xtype: chartCPU,
                            
                        },
                        {
                            xtype: chartMEM,
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
