/* 
 *  PaginGrid AdvSearchPanel
 *  (C) Androme 2015
 */



Ext.define('MyDesktop.modules.common.views.paginggrid.AdvSearchPanel', {
    extend: 'Ext.panel.Panel',
    //currentSearch : {},
    //autoScroll: true,
    initComponent: function () {
        var me = this;
        //this.currentSearch = {};
        var store = Ext.create('Ext.data.Store', {
            storeId: 'simpsonsStore',
            fields: ['state', 'type', 'value'],
            //autosync: true,
            //data: {'items': []},
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
                    },
                }
            },
            listeners: {
                cellcontextmenu: function (view, cell, cellIndex, record, row, rowIndex, event) {
                    event.stopEvent();
                },
                itemcontextmenu: function (grid, item, index, e, eOpts) {
                    var xy = eOpts.getXY();
                    var menu = Ext.create('Ext.menu.Menu');
                    var item, btn;
                    //////bouton supprimer critère
                    //btn = this.down('toolbar').down('button[action="remove"]');
                    item = new Ext.menu.Item({
                        text: "supprimer le critère",
                        iconCls: 'remove16',
                        handler: function (item) {
                            me.removeExtraParam(grid.selModel.selected.items);
                        }
                    });
                    menu.add(item);
                    menu.showAt(xy);
                },
            },
            store: store,
            autoScroll: true,
            columns: [
                {
                    text: 'etat',
                    dataIndex: 'state',
                    flex: 0.5,
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
            ]
                    // renderTo: Ext.getBody()
        });
        config = {
            dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                            xtype: 'splitbutton',
                            name: 'type',
                            text: 'Type',
                            menu: [
                                // these will render as dropdown menu items when the arrow is clicked:
                                {text: 'To', value: 'to=', handler: function () {
                                        this.up('splitbutton').setText(this.text);
                                        me.setCurrentType(this.text);
                                    }},
                                {text: 'From', value: 'from=', handler: function () {
                                        this.up('splitbutton').setText(this.text);
                                        me.setCurrentType(this.text);
                                    }}
                            ]
                        },
                        {
                            xtype: 'trigger',
                            name: 'search',
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
                        },
                        '-',
                        {
                            iconCls: 'add16',
                            width: 24,
                            height: 24,
                            tooltip: '<b>Aide</b><br/>Ajouter un critère<br>',
                            clickEvent: 'mousedown',
                            action: 'add',
                            handler: function () {

                                me.addExtraParam();
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
        me.currentSearch = {};
        me.callParent(arguments);
    },
    addExtraParam: function () {
        var grid = this.down('grid');
        var type = grid.up('panel').down('toolbar').query('splitbutton[name=type]')[0].getText();
        var srch = grid.up('panel').down('toolbar').query('trigger[name=search]')[0].getValue();
        if (srch !== '' && type !== 'Type') {
            var exists = false;
            var i;
            for (i = 0; i < grid.store.getCount(); i++) {
                if (grid.store.getAt(i).data.type === type)
                    exists = true;
            }
            if (exists === false) {
                grid.store.add({
                    'state': true,
                    'type': type,
                    'value': srch});
            }
        }
    },
    removeExtraParam: function (records) {
        var grid = this.down('grid');
        grid.store.remove(records);
    },
    setCurrentType: function (type) {
        //me.currentSearch={};
        console.log('setcurrenttype', type, this, me);
    }

});
