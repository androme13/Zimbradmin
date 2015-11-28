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
                        editor.grid.store.sync({
                            success: function () {
                                editor.grid.store.reload();
                            }
                        });
                    },
                    canceledit: function (editor, e, opt) {
                        // si il n'y a pas de champ id,
                        //  c'est que c'est un ajout annulé
                        if (!e.record.data.id)
                            editor.grid.store.removeAt(0);
                    }
                }
            });
        }
        else
        {
            if (this.customEditRow)
            {
                //grid.customAddRow(grid);
                this.addListener('itemdblclick', function (grid, record) {
                    //console.log(grid,record);
                    this.customEditRow(grid, record);
                })
            }
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
            if (i.binded !== false) {
                var colCFG = {header: i.name, dataIndex: i.name};
                if (i.flex){
                    colCFG.flex = i.flex;
                }
                if (i.hidden) {
                    colCFG.hidden = i.hidden;
                }
                if (i.text) {
                    colCFG.header = i.text;
                }
                if (i.editor) {
                    colCFG.editor = i.editor;
                }
                if (i.renderer) {
                    colCFG.renderer = i.renderer;
                }
                if (i.searchable) {
                    colCFG.searchable = i.searchable;
                }
                if (i.exportable) {
                    colCFG.exportable = i.exportable;
                }
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
                afterrender: function (grid) {
                    // on affiche le marqueur de colonne de recherche sur la
                    // première colonne disposant de l'attribut 'searchable'
                    // et on genere le params.col

                    // on cherche en premier l'attribut dans le modele
                    this.getStore().model.getFields().every(function (entry) {
                        if (entry.searchable === true) {
                            // on cherche ensuite la colonne qui dispose du même nom
                            grid.columns.every(function (col) {
                                if (col.dataIndex === entry.name) {
                                    col.setText(col.text + " (*)");
                                    grid.store.proxy.setExtraParam("col", col.dataIndex);
                                    return false;
                                }
                                return true;
                            });
                            return false;
                        }
                        return true;
                    });

                    var menu = this.headerCt.getMenu();
                    // on traite les spécificités du menu à l'affichage
                    menu.on({
                        beforeshow: function (menu) {
                            for (var i = 0; i < menu.items.items.length; i++) {
                                if (menu.items.items[i].itemId === 'cntxSearchMenu') {
                                    var menuItem = i;
                                }
                            }
                            if (menu.activeHeader.searchable === true) {
                                menu.items.items[menuItem].show();
                            }
                            else
                            {
                                menu.items.items[menuItem].hide();
                            }
                        }
                    });
                    // definition menu contextuel entête de colonne
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
                                if (extraParams.search && extraParams.search !== '')
                                    grid.store.reload();
                            }
                        }]);

                    // on verifie si la grid est en readonly
                    // dans ce cas on cache les boutons
                    if (this.readOnly === true) {
                        var toolbar = this.down('toolbar[xtype=toolbar]');
                        toolbar.query('button').every(function (entry) {
                            entry.hide();
                            return true;
                        });
                    }

                },
                cellcontextmenu: function (cell, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    e.stopEvent();
                },
                itemcontextmenu: function (record, item, index, e, eOpts) {
                    var xy = eOpts.getXY();
                    var menu = Ext.create('Ext.menu.Menu');
                    var item, btn;
                    // ajout des menus liés à la toolbar
                    // 
                    //////bouton ajouter
                    btn = this.down('toolbar').down('button[action="add"]');
                    item = new Ext.menu.Item({
                        text: "Ajouter une entrée",
                        //value: rec.data.VALUE_FIELD,
                        iconCls: btn.iconCls,
                        handler: function (item) {
                            me.addRow();
                        }
                    });
                    menu.add(item);
                    //////bouton supprimer
                    btn = this.down('toolbar').down('button[action="remove"]');
                    if (btn.disabled === false) {
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
                    if (btn.disabled === true) {
                        btn.setDisabled(false);
                    }
                }
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
                        store: elementsNumber,
                        valueField: 'nbr',
                        displayField: 'nbr',
                        typeAhead: true,
                        queryMode: 'local',
                        allowBlank: false,
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
                                                if (buttonId === 'ok')
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
                        }
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
                                //console.log(this.up('grid'));
                                me.removeRow();
                            }
                        },
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: 'splitbutton',
                            text: 'Exporter',
                            menu: [{
                                    text: 'Importer'
                                }],
                            handler: function () {
                                //console.log(this.up('grid'));
                                me.export(this.up('grid'));
                            },
                            action: 'csvExport'
                        }
                    ]
                }],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                loadingText: 'Veuillez patienter...'
            }
        };
        if (this.rowEditing !== null) {
            config.plugins = this.rowEditing;
        }
        Ext.applyIf(me, config);
        me.callParent(arguments);
    },
    removeRow: function () {
        var grid = this;
        if (grid.customRemoveRow)
        {
            grid.customRemoveRow(grid);
        }
        else
        {
            var rows = grid.getSelectionModel().getSelection();
            var store = Ext.create(grid.store.$className);
            store.add(rows);
            var columns = [];
            grid.columns.forEach(function (entry) {
                columns.push(Ext.create('Ext.grid.column.Column', entry));
            });
            var gridDel = Ext.create('Ext.grid.Panel', {
                store: store,
                columns: columns,
                viewConfig: {
                    stripeRows: true
                }
            });
            var formPanel = Ext.create('Ext.form.Panel', {
                title: 'Veuillez confirmer la suppression des éléments suivants (' + store.getCount() + ')',
                autoScroll: true,
                fieldDefaults: {
                    labelAlign: 'top',
                    msgTarget: 'side'
                },
                defaults: {
                    border: false,
                    xtype: 'panel',
                    flex: 1,
                    layout: 'anchor'
                },
                layout: 'hbox',
                items: [{
                        items: [gridDel]
                    }],
                buttons: ['->', {
                        text: 'Confirmer',
                        iconCls: 'accept16',
                        handler: function () {
                            grid.store.remove(rows);
                            grid.store.sync({                                
                                success: function () {
                                    if (grid.customAfterRemoveRow)
                                        grid.customAfterRemoveRow(true,rows);
                                },
                                failure: function (batch, Opts) {
                                    if (grid.customAfterRemoveRow)
                                        grid.customAfterRemoveRow(false,rows);
                                },
                                callback: function () {
                                    //grid.customAfterRemoveRow(rows);
                                }
                            }
                            );
                            this.up('window').close();
                        }
                    }, {
                        text: 'Annuler',
                        iconCls: 'cancel16',
                        handler: function () {
                            this.up('window').close();
                        }
                    }]
            });

            var winDel = Ext.create("Ext.window.Window", {
                title: "Confirmation de suppression d'éléments",
                layout: 'fit',
                maximizable: true,
                width: 512,
                height: 400,
                modal: true,
                items: formPanel
            });
            winDel.show();
            Ext.Function.defer(function () {
                winDel.toFront();
            }, 50);
        }
    },
    // fonctions ////////////////////////////////
    addRow: function () {
        var grid = this;
        if (grid.customAddRow)
        {
            grid.customAddRow(grid);
        }
        else
        {
            //var grid = this.up('window').down('grid');
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
    },
    export: function (grid) {
        var cols = grid.columns;
        var store = grid.store;
        var data = '';
        var totalExportable = 0;
        var that = this;
        Ext.Array.each(cols, function (col, index) {
            if (col.hidden !== true && col.exportable === true) {
                totalExportable++;
                data += that._getFieldTextAndEscape(col.dataIndex) + ',';
            }
        });
        if (totalExportable > 0) {
            data += "\n";
            store.each(function (record) {
                var entry = record.getData();
                Ext.Array.each(cols, function (col, index) {
                    if (col.hidden !== true && col.exportable === true) {
                        var fieldName = col.dataIndex;
                        var text = entry[fieldName];
                        data += that._getFieldTextAndEscape(text) + ',';
                    }
                });
                data += "\n";
            });
            // on lance l'envoi du fichier
            var a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([data], {type: 'application/octet-stream'}));
            a.download = 'ZimbrAdmin_' + grid.store.storeId + "_export.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        else
        {
            Ext.MessageBox.show({
                title: 'Export Impossible',
                msg: "Aucune colonne n'est configurée pour l'export",
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    },
    hideToolbar: function (value)
    {
        if (value === true)
            this.down('toolbar[dock=top]').hide();
        else
            this.down('toolbar[dock=top]').show();
    },
    hidePagingbar: function (value)
    {
        if (value === true)
            this.down('toolbar[dock=bottom]').hide();
        else
            this.down('toolbar[dock=bottom]').show();
    },
    _getFieldTextAndEscape: function (fieldData) {
        var string = this._getFieldText(fieldData);
        return this._escapeForCSV(string);
    },
    _getFieldText: function (fieldData) {
        var text;

        if (fieldData === null || fieldData === undefined) {
            text = '';

        } else if (fieldData._refObjectName && !fieldData.getMonth) {
            text = fieldData._refObjectName;

        } else if (fieldData instanceof Date) {
            text = Ext.Date.format(fieldData, this.dateFormat);

        } else if (!fieldData.match) { // not a string or object we recognize...bank it out
            text = '';

        } else {
            text = fieldData;
        }

        return text;
    },
    _escapeForCSV: function (string) {
        if (string.match(/,/)) {
            if (!string.match(/"/)) {
                string = '"' + string + '"';
            } else {
                string = string.replace(/,/g, ''); // comma's and quotes-- sorry, just loose the commas
            }
        }
        return string;
    }
});