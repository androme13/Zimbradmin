/* 
 *  PaginGrid AdvSearchPanel
 *  (C) Androme 2015
 */



Ext.define('MyDesktop.modules.common.views.paginggrid.AdvSearchPanel', {
    extend: 'Ext.panel.Panel',
    //autoScroll: true,
    initComponent: function () {
        var me = this;
        config = {
            //title: 'Border Layout',
            //layout: 'fit',
            width: 180,
            items: [{
                    xtype: 'fieldset',
                    
                    //flex: 1,
                    title: 'Case sensitive / Regex',
                    defaultType: 'checkbox', // each item will be a checkbox
                    //layout: 'fit',
                    /*defaults: {
                        anchor: '100%',
                        hideEmptyLabel: false
                    },*/
                    items: [{
                            padding: '5 0 5 0',
                            xtype: 'checkboxgroup',
                            layout: 'column',
                            //layout: 'fit',
                            //fieldLabel: 'Multi-Column (horizontal)',
                           cls: 'x-check-group-alt',
                            // Distribute controls across 3 even columns, filling each row
                            // from left to right before starting the next row
                            columns: 2,
                            items: [
                                {boxLabel: 'Case Sens.',name:'casesens'},
                                {boxLabel: 'Regex',name:'regex'},
                            ]
                        }]
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
