/* 
 *  PaginGrid AdvSearchPanel
 *  (C) Androme 2015
 */



Ext.define('MyDesktop.modules.common.views.paginggrid.AdvSearchPanel', {
    extend: 'Ext.panel.Panel',
    //autoScroll: true,
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            storeId: 'simpsonsStore',
            fields: ['state', 'type', 'value'],
            //autosync: true,
            data: {'items': [
                    {'state': true, "type": "lisa@simpsons.com", "value": "555-111-1224"},
                    {'state': false, "type": "bart@simpsons.com", "value": "555-222-1234"},
                    {'state': true, "type": "homer@simpsons.com", "value": "555-222-1244"},
                    {'state': true, "type": "marge@simpsons.com", "value": "555-222-1254"}
                ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'items'
                }
            }
        });
        var grid = Ext.create('Ext.grid.Panel', {
            //title: 'Simpsons',
            multiSelect: true,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: 'AdvSearchPanel',
                    dropGroup: 'AdvSearchPanel'
                },
                listeners: {
                    cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {

                        var clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
                        var clickedColumnName = view.panel.headerCt.getHeaderAtIndex(cellIndex).text;
                        var clickedCellValue = record.get(clickedDataIndex);
                        if (clickedColumnName === 'etat') {
                            if (clickedCellValue === true)
                                record.set('state', false);
                            else
                                record.set('state', true);

                            this.dataSource.sync();

                        }
                    },
                    drop: function (node, data, dropRec, dropPosition) {
                        var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                        //Ext.example.msg("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
                    }
                }
            },
            store: store,
            //store: Ext.data.StoreManager.lookup('simpsonsStore'),
            //width: 200,
            autoScroll: true,
            columns: [
                {
                    text: 'etat',
                    dataIndex: 'state',
                    flex: 1,
                    renderer: function (value, meta) {
                        switch (value) {
                            case false :
                                meta.css = 'smtp-disabled_entry24';
                                meta.tdAttr = 'data-qtip="Inactif"';
                                break;
                            case true :
                                meta.css = 'smtp-enabled_entry24';
                                meta.tdAttr = 'data-qtip="Actif"';
                                break;
                        }
                        return '';
                    }
                },
                {text: 'type', dataIndex: 'type', flex: 1},
                {text: 'valeur', dataIndex: 'value', flex: 2}
            ],
            renderTo: Ext.getBody()
        });
        config = {
            dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                            xtype: 'trigger',
                            //hidden: true,
                            triggerCls: 'x-form-clear-trigger',
                            emptyText: 'Recherche ...',
                            enableKeyEvents: true,
                            action: 'keypress',
                            listeners: {
                                keypress: {
                                    // fn: this.searchKeyPress,
                                    // buffer: 500
                                }
                            },
                            onTriggerClick: function () {
                                //console.log('ontriggerclick',this);
                                this.setValue('');
                                var main = this.up('panel[name=search]');
                                //this.up('grid').customLoadStore();
                            }
                        }
                    ]
                }],
            //layout: 'fit',
            //width: 180,
            items: [{
                    xtype: 'fieldset',
                    checkboxToggle: true,
                    title: 'Case sensitive / Regex',
                    defaultType: 'checkbox', // each item will be a checkbox
                    items: [{
                            padding: '5 0 5 0',
                            xtype: 'checkboxgroup',
                            layout: 'column',
                            cls: 'x-check-group-alt',
                            columns: 2,
                            items: [
                                {boxLabel: 'Case Sens.', name: 'casesens'},
                                {boxLabel: 'Regex', name: 'regex'},
                            ]
                        }]
                },
                grid,
                this.customItems],
            listeners: {
                afterrender: function () {
                    console.log('afterrender', this);
                }
            }
        };
        // on supprime les predéfinitions des menus custom.
        delete this.customItems
        Ext.applyIf(me, config);
        me.callParent(arguments);
    }
});
