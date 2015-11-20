/* 
 * ZMModule Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.models.ZMModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createIdCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createStateCol(),
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createLevelCol(),
        {
            name: 'module',
            flex: 2,
            editor: {
                allowBlank: false,
            },
            type: 'string'
        },
        Ext.create('MyDesktop.modules.common.gridcols.gridCols').createCommentCol(),
    ]
});


// id,level,username,firstname,lastname