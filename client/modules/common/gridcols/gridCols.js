/* 
 * gridCols
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.common.gridcols.gridCols', {
    createStateCol: function () {
        var col = {name: 'state',
            text: 'Etat',
            defaultValue: 2,
            flex: 1,
            editor: {
                xtype: 'combo',
                valueField: 'value',
                queryMode: 'local',
                store: [[0, 'Inactif'], [1, 'Bloqué'], [2, 'Actif']],
                editable: false,
            },
            renderer: function (value, meta) {
                switch (value) {
                    case 0 :
                        meta.css = 'smtp-disabled_entry24';
                        meta.tdAttr = 'data-qtip="Inactif"';
                        break;
                    case 1 :
                        meta.css = 'smtp-blocked_entry24';
                        meta.tdAttr = 'data-qtip="Bloqué"';
                        break;
                    case 2 :
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
        }
        return col;
    },
    createLevelCol: function () {
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
        }
        return col;
    }
});
