/* 
 * ZMUser Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.router.models.MyNetworkModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createIdCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createStateCol(),
        {
            name: 'network',
            exportable: true,
            editor: {
                editable: true,
                allowBlank: false,
                regex: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/,
                regexText: 'Veuillez saisir une adresse CIDR du style 10.1.1.128/32'
            },
            type: 'string',
            searchable: true
        },
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCommentCol({exportable: true}),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCreatedCol(),
        {name: 'created_by', binded: false},
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createModifiedCol(),
        {name: 'modified_by', binded: false},
    ]
});


// id,level,username,firstname,lastname