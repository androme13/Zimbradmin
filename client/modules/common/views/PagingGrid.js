/* 
 * MailTransport STORE
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.common.views.PagingGrid', {
    extend: 'Ext.grid.Panel',
    autoScroll: true,
    loadMask: true,
    me: this,
    customLoadStore: function (search) {
        if (!search || search === '') {
            delete this.store.proxy.extraParams.search;
        } else
        {
            this.store.proxy.setExtraParam("search", search);
        }
        this.store.loadPage(1);
    },
    searchKeyPress: function (field, e, options) {
        this.up('grid').customLoadStore(field.value);
    },
    initComponent: function () {
        var columns = [];
        var config = {};
        var me = this;
        // configuration du mode edition
        if (this.rowEditing === true) {
            this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToMoveEditor: 1,
                autoCancel: false,
                listeners: {
                    edit: function (editor, e, opt) {
                        editor.grid.store.sync();
                    },
                    canceledit: function (editor, e, opt) {
                        // si il n'y a pas de champ id,
                        //  c'est que c'est un ajout annulé
                        if (!e.record.data.id)
                            editor.grid.store.removeAt(0);
                    },
                }
            });
        }
        // on crée le store pour le choix du nombre d'elements à afficher
        var elementsNumber = Ext.create('Ext.data.Store', {
            fields: ['nbr', 'name'],
            data: [{
                    "nbr": "50",
                    "name": "50"
                }, {
                    "nbr": "100",
                    "name": "100"
                }, {
                    "nbr": "150",
                    "name": "150"
                },
                {
                    "nbr": "200",
                    "name": "200"
                }]
        });
        // création des colonnes par rapport au modele       
        this.store.model.getFields().forEach(function (i)
        {
            if (i.binded != false) {
                var colCFG = {header: i.name, dataIndex: i.name, flex: 1}
                if (i.hidden) {
                    colCFG.hidden = i.hidden;
                }
                ;
                if (i.text) {
                    colCFG.header = i.text;
                }
                ;
                if (i.editor) {
                    colCFG.editor = i.editor;
                }
                ;
                if (i.renderer) {
                    colCFG.renderer = i.renderer;
                }
                ;
                columns.push(colCFG);
            }
        });
        // definiton de la config de la grille
        config = {
            defaults: {
                sortable: true
            },
            columns: columns,
            listeners: {
                afterrender: function (col) {
                    // definition menu contextuel entête de colonne
                    var menu = this.headerCt.getMenu();
                    menu.on({
                        beforeshow: function (menu) {                          
                            var columnDataIndex = menu.activeHeader.dataIndex;
                            this.up('grid').getStore().model.getFields().every(function (entry) {
                                if (entry.name === columnDataIndex) {
                                    // on localise le menu contextuel 'cntxSearchMenu'
                                    for (var i = 0; i < menu.items.items.length; i++) {
                                        if (menu.items.items[i].itemId == 'cntxSearchMenu') {
                                            var menuItem = i;
                                        }
                                    }
                                    // on verifie si la colonne possède bien la propriété 'searchable'
                                    // on affiche ou on cache le menu 'search' le cas écheant
                                    if (entry.searchable === true) {
                                        menu.items.items[menuItem].show();
                                    }
                                    else
                                    {
                                        menu.items.items[menuItem].hide();
                                    }
                                    return false
                                }
                                return true
                            });
                        }
                    });
                    menu.add([{
                            iconCls: 'favorite16',
                            text: 'Chercher dans cette colonne',
                            itemId: 'cntxSearchMenu',
                            handler: function () {
                                var grid = this.up('grid');
                                var columnDataIndex = menu.activeHeader.dataIndex;
                                var extraParams = grid.store.proxy.extraParams;
                                // on supprime l'ancien marqueur
                                if (extraParams.col) {
                                    grid.columns.every(function (entry) {
                                        if (entry.dataIndex === extraParams.col) {
                                            entry.setText(entry.dataIndex);
                                            return false;
                                        }
                                        return true;
                                    });
                                }
                                // on ajoute le marqueur visuel sur le titre de la colonne.
                                menu.activeHeader.setText(columnDataIndex + " (*)");
                                grid.store.proxy.setExtraParam("col", columnDataIndex);
                                if (extraParams.search && extraParams.search != '')
                                    grid.store.reload();
                            }
                        }]);

                },
                cellcontextmenu: function (cell, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    e.stopEvent();
                },
                itemcontextmenu: function (record, item, index, e, eOpts) {
                    var xy = eOpts.getXY();
                    var menu = Ext.create('Ext.menu.Menu');
                    var item, btn;
                    // ajout des menus liés à la toolbar
                    //////ajout
                    btn = this.down('toolbar').down('button[action="add"]');
                    item = new Ext.menu.Item({
                        text: "Ajouter une entrée",
                        //value: rec.data.VALUE_FIELD,
                        iconCls: btn1.iconCls,
                        handler: function (item) {
                            me.addRow();
                        }
                    });
                    menu.add(item);
                    //////suppression
                    btn = this.down('toolbar').down('button[action="remove"]');
                    if (btn.disabled == false) {
                        item = new Ext.menu.Item({
                            text: "supprimer",
                            //value: rec.data.VALUE_FIELD,
                            iconCls: btn.iconCls,
                            handler: function (item) {
                                me.removeRow();
                            }
                        });
                        menu.add(item);
                    }
                    menu.showAt(xy);
                },
                select: function (rowModel, record, index, eOpts)
                {
                    // on active le bouton supprimer si une ligne est selectionnée
                    var btn = this.down('toolbar').down('button[action="remove"]');
                    if (btn.disabled == true) {
                        btn.setDisabled(false);
                    }
                    ;
                },
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.store,
                displayInfo: true,
                pageSize: 50, //App.Constants.gridPageSize,
                items: ['-',
                    {
                        xtype: 'combobox',
                        value: "50", //App.Constants.gridPageSize.toString(),
                        maxWidth: 70,
                        minxWidth: 70,
                        regex: /^\d+$/,
                        forceSelection: true,
                        maxLength: 3,
                        enforceMaxLength: true,
                        listeners: {
                            scope: this,
                            buffer: 500,
                            change: function (obj, newValue, oldValue)
                            {
                                var bbarItem = this.dockedItems.items[2];
                                if (obj.isValid() === true) {
                                    if (((newValue < 0) || (newValue > 200)))
                                    {
                                        Ext.Msg.show({
                                            title: 'Error In Pagesize!',
                                            msg: 'Please Enter Pagesize between 0 and 200',
                                            closable: false,
                                            buttons: Ext.Msg.OK,
                                            fn: function (buttonId, text)
                                            {
                                                if (buttonId == 'ok')
                                                {
                                                    newValue = oldValue;
                                                }
                                            },
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    }
                                    else
                                    {
                                        if (newValue !== oldValue) {
                                            bbarItem.pageSize = parseInt(newValue);
                                            this.pageSize = parseInt(newValue);
                                            //App.Constants.gridPageSize = this.pageSize;
                                            Ext.apply({params: {start: 0, limit: newValue}});
                                            this.store.pageSize = this.pageSize;
                                            this.store.load({params: {start: 0, limit: newValue}});
                                        }
                                    }

                                }

                            }
                        },
                        width: 112,
                        listConfig: {
                            minWidth: null
                        },
                        store: elementsNumber,
                        valueField: 'nbr',
                        displayField: 'nbr',
                        typeAhead: true,
                        queryMode: 'local',
                        allowBlank: false,
                        forceSelection: true
                    }
                ]
            }),
            dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                            xtype: 'trigger',
                            triggerCls: 'x-form-clear-trigger',
                            emptyText: 'Recherche ...',
                            enableKeyEvents: true,
                            action: 'keypress',
                            listeners: {
                                keypress: {
                                    fn: this.searchKeyPress,
                                    buffer: 500
                                }
                            },
                            onTriggerClick: function () {
                                //console.log('ontriggerclick',this);
                                this.setValue('');
                                this.up('grid').customLoadStore();
                            }
                        },
                        '-',
                        {
                            iconCls: 'add16',
                            width: 24,
                            height: 24,
                            tooltip: '<b>Aide</b><br/>Ajouter une entrée<br>',
                            clickEvent: 'mousedown',
                            action: 'add',
                            handler: function () {
                                me.addRow();
                            }
                        },
                        {
                            iconCls: 'remove16',
                            disabled: true,
                            width: 24,
                            height: 24,
                            tooltip: "<b>Aide</b><br/>Supprimer l'entrée selectionnée<br>",
                            clickEvent: 'mousedown',
                            action: 'remove',
                            handler: function () {
                                me.removeRow();
                            }
                        },
                        {
                            xtype: 'tbfill',
                        },
                        {
                            xtype: 'button',
                            text: 'Exporter',
                            action: 'csvExport'
                        }
                    ]
                }],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                loadingText: 'Veuillez patienter...',
            },
        };
        if (this.rowEditing !== null) {
            config.plugins = this.rowEditing;
        }
        Ext.applyIf(me, config);
        console.log('menu', this);
        //var mainMenu = this.headerCt.getMenu();
        /*mainMenu.insert(mainMenu.items.length-2, [{
         itemId: 'toggleSortMenuItem',
         text: 'Toggle Sort',
         handler: function() {
         //mainMenu.activeHeader.sortable = (mainMenu.activeHeader.sortable) ? false : true;
         }
         },{
         itemId: 'severityIndicatorMenuItem',
         text: 'Severity Indicator',
         handler: function() {
         // JB - Start here...
         }
         }]);*/






        me.callParent(arguments);
    },
    removeRow: function () {
        var grid = this.up('window').down('grid');
        var rows = grid.getSelectionModel().getSelection();
        var itemsList = "";
        rows.forEach(function (entry) {
            var str = entry.data;
            Ext.iterate(str, function (key, value) {
                itemsList += value + '|';
            });
            itemsList += "<br>";
        });
        var msg = Ext.Msg.show({
            title: 'Confirmer la suppression',
            msg: 'Veuillez confirmer la suppression des éléments suivants :<br>' + itemsList,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            modal: true,
            fn: function (btn) {
                if (btn === 'yes') {
                    grid.store.remove(rows);
                    grid.store.sync();
                }
            }
        });
        Ext.defer(function () {
            msg.toFront();
        }, 50);
    },
    // fonctions ////////////////////////////////
    addRow: function () {
        var grid = this.up('window').down('grid');
        var newEntry = Ext.create(grid.store.model.modelName, {
        });
        // on cherche le premier champ editable 
        // pour s'y positionner
        var start = 0;
        grid.store.model.getFields().every(function (entry) {
            if (!entry.editor) {
                start++;
                return false;
            }
            return true;
        });
        grid.store.insert(0, newEntry);
        grid.rowEditing.startEdit(0, start);
    }
});