/* 
 * UserWizardModule Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.zmsettings.models.UserWizardModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', hidden: true
        },
        {name: 'module',
            type: 'string',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                var comment = record.get('comment');
                return value + '<br><small><i>' + comment + '</i></small></br>';
            }
        },
        {name: 'comment',
            type: 'string',
            binded: false
        },
    ]
});


// id,level,username,firstname,lastname