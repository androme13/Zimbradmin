/* 
 * gridCols
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.common.gridcols.gridCols', {
    createStateCol: function (options) {
        var col = {name: 'state',
            text: 'Etat',
            defaultValue: 1,
            flex: 1,
            editor: {
                xtype: 'combo',
                valueField: 'value',
                queryMode: 'local',
                store: [[0, 'Inactif'], [1, 'Actif'], [2, 'Bloqué']],
                editable: false,
            },
            renderer: function (value, meta) {
                switch (value) {
                    case 0 :
                        meta.css = 'smtp-disabled_entry24';
                        meta.tdAttr = 'data-qtip="Inactif"';
                        break;
                    case 2 :
                        meta.css = 'smtp-blocked_entry24';
                        meta.tdAttr = 'data-qtip="Bloqué"';
                        break;
                    case 1 :
                        meta.css = 'smtp-enabled_entry24';
                        meta.tdAttr = 'data-qtip="Actif"';
                        break;
                    case 3 :
                        meta.css = 'smtp-deleted_entry24';
                        meta.tdAttr = 'data-qtip="Supprimé"';
                        break;
                }
                return '';
            }
        };
        if (options)
        {
            for (var key in options) {
                col[key] = options[key];
            }
        }
        return col;
    },
    createLevelCol: function (options) {
        var col = {name: 'level',
            text: 'Niveau',
            defaultValue: 1,
            flex: 2,
            editor: {
                xtype: 'combo',
                editable: false,
                //typeAhead: true,
                triggerAction: 'all',
                store: [
                    [0, 'invité'],
                    [1, 'utilisateur'],
                    [2, 'super utilisateur'],
                    [3, 'administrateur'],
                    [4, 'super administrateur']
                ]

            },
            renderer: function (value) {
                var backval = "";
                switch (value)
                {
                    case 0 :
                        backval = "invité";
                        break;
                    case 1 :
                        backval = "utilisateur";
                        break;
                    case 2 :
                        backval = "super utilisateur";
                        break;
                    case 3 :
                        backval = "administrateur";
                        break;
                    case 4 :
                        backval = "super administrateur";
                        break;
                    default:
                        backval = "inconnu";
                        break;
                }
                return backval;
            }
        };
        if (options)
        {
            for (var key in options) {
                col[key] = options[key];
            }
        }
        return col;
    },
    createCommentCol: function (options) {

        var col = {
            name: 'comment',
            flex: 2,
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string'
        };
        if (options)
        {
            for (var key in options) {
                col[key] = options[key];
            }
        }
        return col;
    },
    createCreatedCol: function (options) {
        var col = {name: 'created_date', type: 'date', text: 'Crée le',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                var nameCreator = 'inconnu';
                var idCreator = record.get('created_by');
                var st = this.store;
                var index = st.find('id', idCreator);
                if (index >= 0)
                    nameCreator = st.getAt(index).get('username');
                if (value == null)
                    value = 'Inconnu';
                return 'le : <i>' + value + '</i><br>par: <i>' + nameCreator + '</i></br>';
            }
        };
        if (options)
        {
            for (var key in options) {
                col[key] = options[key];
            }
        }
        return col;
    },
    createIdCol: function (options) {
        var col = {
            name: 'id',
            type: 'int',
            hidden: true,
            flex: 1
        };
        if (options)
        {
            for (var key in options) {
                col[key] = options[key];
            }
        }
        return col;
    },
    createModifiedCol: function (options) {
        var col = {name: 'modified_date', type: 'date', text: 'Modifié le',flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var nameModifier = 'inconnu';
                var idModifier = record.get('modified_by');
                var st = this.store;
                var index = st.find('id', idModifier);
                if (index >= 0)
                    nameModifier = st.getAt(index).get('username');
                if (record.data.modified_date === record.data.created_date)
                {
                    return 'non modifié';
                }
                else
                {
                    return 'le : <i>' + value + '</i><br>par: <i>' + idModifier + '</i></br>';
                }
            }
        };
        if (options)
        {
            for (var key in options) {
                col[key] = options[key];
            }
        }
        return col;
    }
});
