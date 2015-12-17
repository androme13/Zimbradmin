/* 
 * PagingGrid MAIN
 * (C) Androme 2015
 * 
 */


Ext.define('MyDesktop.modules.common.views.paginggrid.PagingGrid', {
    extend: 'Ext.panel.Panel',
    me: null,
    //autoScroll: true,
    initComponent: function () {
        me = this;
        var grid = Ext.create('MyDesktop.modules.common.views.paginggrid.Grid', this.gridParam);
        var srchPanel = Ext.create('MyDesktop.modules.common.views.paginggrid.AdvSearchPanel', this.searchParam);
        config = {
            //title: 'Border Layout',
            layout: 'border',
            //minHeight: 250,

            items: [{
                    title: 'Recherche avancée',
                    name: 'search',
                    autoScroll: true,
                    layout: 'fit',
                    main: me,
                    flex: 1,
                    region: 'west',
                    xtype: 'panel',
                    minWidth: 300,
                    //minHeight: 250,
                    //width: 200,
                    //margins: '0 0 0 0',
                    hideCollapseTool: true,
                    collapsible: true, // make collapsible
                    collapseMode: 'mini',
                    split: true,
                    items: [srchPanel],
                    listeners: {
                        beforecollapse: function () {
                            me.setSrchMode(0);
                        },
                        beforeexpand: function () {
                            me.setSrchMode(1);
                        }
                    }
                }, {
                    region: 'center', // center region is required, no width/height specified
                    //autoScroll: true,
                    layout: 'fit',
                    flex: 4,
                    minWidth: 300,
                    main: me,
                    xtype: 'panel',
                    //margins: '0 0 0 5',
                    items: [grid]
                }],
            listeners: {
                afterrender: function () {
                    console.log('afterrender', this);
                }
            }
        };
        Ext.applyIf(me, config);
        me.callParent(arguments);
    },
    addExtraParams: function (params) {

    },
    setExtraParams: function (params) {

    },
    setSrchMode: function (mode) {
        // 0: recherche normale
        // 1: recherche avancée
        var srch = me.down('trigger[name=simpleSrch]').show();
        console.log(srch);
        if (mode === 0)
            srch.show();
        else if (mode === 1)
            srch.hide();//srch.setVisible(false);
    }
});