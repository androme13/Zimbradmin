/* 
 * ZMUser Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.models.ZMUserModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        {
            name: 'id',
            hidden: true,
            flex: 1
        },
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createStateCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createLevelCol(),
        {
            name: 'username',
            flex: 2,
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string',
            searchable: true
        },
        {
            name: 'password',
            type: 'string',
            binded: false
        },
        {
            name: 'firstname',
            flex: 2,
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string',
            searchable: true

        },
        {
            name: 'lastname',
            flex: 2,
            editor: {
                editable: true,
                allowBlank: false
            },
            type: 'string',
            searchable: true

        },
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCreatedCol(),
        {name: 'created_by', binded: false},
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createModifiedCol(),
        {name: 'modified_by', binded: false},
    ]
});


// id,level,username,password,firstname,lastname