/* 
 * UserWizardModule Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.models.UserWizardModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            hidden: true
        },
        {
            name: 'userid',
            type: 'int',
            binded: false,
        },
        {
            name: 'moduleid',
            type: 'int',
            
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                console.log('renderer',record);
                var modulesGridStore=this.up().down('grid[name=src]').getStore();
                var moduleRecord=modulesGridStore.findRecord('id',record.get('moduleid'));
                return moduleRecord.get('module') + '<br><small><i>' + moduleRecord.get('comment') + '</i></small></br>';
            }
        }
    ]
});


// id,level,username,firstname,lastname