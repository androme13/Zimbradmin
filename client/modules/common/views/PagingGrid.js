
Ext.define('MyDesktop.modules.common.views.PagingGrid', {
    extend: 'Ext.grid.Panel',
    autoScroll: true,
    loadMask: true,
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

                        /*me.up().fireEvent('entryAdd', {
                         editor: editor,
                         e: e,
                         opt: opt
                         });*/
                    },
                    canceledit: function (editor, e, opt) {
                        // si il n'y a pas de champ id,
                        //  c'est que c'est un ajout annulé
                        if (!e.record.data.id) editor.grid.store.removeAt(0);
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
        // création des colonnes par rapport au store       
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
                /*var colCFG=i;
                 console.log (colCFG);
                 colCFG.header= i.name;
                 colCFG.dataIndex= i.name;
                 colCFG.flex= 1;*/

                columns.push(colCFG);
            }
        });
        // definiton de la config de la grille
        config = {
            // store: this.store,

            defaults: {
                sortable: true
            },
            columns: columns,
            listeners: {
                select: function (rowModel, record, index, eOpts)
                {
                    // on active le bouton supprimer si une ligne est selectionnée
                    removeBtn = this.down('toolbar').down('button[action="remove"]');
                    if (removeBtn.disabled == true) {
                        removeBtn.setDisabled(false);
                    }
                    ;
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

                                            Ext.apply({params: {start: 0, limit: newValue}}, {
                                                //myNewParam: true
                                            });
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
                            //id: 'searchappuser',
                            emptyText: 'Recherche ...',
                            enableKeyEvents: true,
                            action: 'keypress',
                            onTriggerClick: function () {
                                this.fireEvent('ontriggerclick', this);
                            }
                        },
                        '-',
                        {
                            iconCls: 'add',
                            //id: 'addappuser',
                            width: 24,
                            height: 24,
                            tooltip: '<b>Aide</b><br/>Ajouter une entrée<br>',
                            clickEvent: 'mousedown',
                            action: 'add',
                            handler: function () {
                                //console.log('+:',this.up())
                                /*me.up().fireEvent('entryAdd', {
                                 grid: this.up('grid'),
                                 });*/
                                var grid = this.up('grid');
                                var newEntry = Ext.create(grid.store.model.modelName, {
                                });
                                //console.log(newEntry);
                                grid.store.insert(0, newEntry);
                                grid.rowEditing.startEdit(0, 0);
                            }

                        },
                        {
                            iconCls: 'remove',
                            //id: 'removeappuser',
                            disabled: true,
                            width: 24,
                            height: 24,
                            tooltip: "<b>Aide</b><br/>Supprimer l'entrée selectionnée<br>",
                            clickEvent: 'mousedown',
                            action: 'remove',
                            handler: function () {
                                var grid = this.up('grid');
                                var rows = grid.getSelectionModel().getSelection();
                                var itemsList = "";
                                rows.forEach(function (entry) {
                                    var str = entry.data;
                                    Ext.iterate(str, function (key, value) {
                                        itemsList += value + '|';
                                    });
                                    itemsList += "<br>";
                                });
                                //console.log(Object.keys(rows))
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
                                            Ext.infoMsg.msg("supprimées", "ok", "orange");
                                        }
                                    }
                                });
                                Ext.defer(function () {
                                    msg.toFront();
                                }, 50);
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
        me.callParent(arguments);
    }

});