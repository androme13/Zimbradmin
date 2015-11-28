/* 
 * ZMUser Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.router.models.RelayDomainModel', {
    extend: 'Ext.data.Model',
    fields: [
        // IMPORTANT : le champ id ne doit pas avoir de valeur par défaut
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createIdCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createStateCol(),
        {
            name: 'domain',
            exportable: true,
            editor: {
                editable: true,
                allowBlank: false,
                regex: /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
                regexText: 'Veuillez saisir une adresse de domaine valide'
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