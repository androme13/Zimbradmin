/* 
 * PagingGrid MAIN
 * (C) Androme 2015
 * 
 */


Ext.define('MyDesktop.modules.common.views.paginggrid.PagingGrid', {
    extend: 'Ext.panel.Panel',
    //autoScroll: true,
    initComponent: function () {
        var me = this;
        var grid = Ext.create('MyDesktop.modules.common.views.paginggrid.Grid', this.gridParam);
        var srchPanel = Ext.create('MyDesktop.modules.common.views.paginggrid.AdvSearchPanel', this.searchParam);
        config = {
            title: 'Border Layout',
            layout: 'border',
            items: [{
                    title: 'Recherche avancée',
                    region: 'west',
                    xtype: 'panel',
                    margins: '0 0 0 0',
                    collapsible: true, // make collapsible
                    items: [srchPanel]
                    // tools: [{ type: 'refresh' }]
                }, {
                    region: 'center', // center region is required, no width/height specified
                    xtype: 'panel',
                    margins: '0 0 0 5',
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
    }
});