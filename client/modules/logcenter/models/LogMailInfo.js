/* 
 * logMailInfo Model
 * (C) Androme 2015
 * 
 */

Ext.define('MyDesktop.modules.logcenter.models.LogMailInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            exportable: true,
            type: 'int',
            flex: 1,
            hidden: true
                    //searchable: true
        },
        {
            name: 'date',
            exportable: true,
            type: 'string',
            flex: 1
                    //searchable: true
        },
        {
            name: 'host',
            exportable: true,
            type: 'string',
            //searchable: true
            flex: 1
        },
        {
            name: 'process',
            exportable: true,
            type: 'string',
            //searchable: true
            flex: 1
        },
        {
            name: 'key',
            exportable: true,
            type: 'string',
            //searchable: true
            flex: 1,
            renderer: function (value, metaData, record, row, col, store, gridView) {
                text = Ext.util.Format.htmlEncode(value);
                if (text==='NOQUEUE')
                    metaData.tdCls = 'logcenter-red_cell';
               // else
               //     metaData.style = "background-color:green;";

                //metaData.tdAttr = "data-qtip='" + value + "'";
                metaData.tdAttr = 'title="' + Ext.util.Format.ellipsis(value, 800) + '"';
                return text;
            }
        },
        {
            name: 'message',
            exportable: true,
            type: 'string',
            flex: 4,
            //searchable: true
            renderer: function (value, metaData, record, row, col, store, gridView) {
                text = Ext.util.Format.htmlEncode(value);
                if (value.search('status=sent')>-1)
                    metaData.tdCls = 'logcenter-green_cell';
                   // metaData.style = "background-color:#96CA2D;";
                else
                if (value.search('status=deferred')>-1)
                    metaData.tdCls = 'logcenter-orange_cell';
                else
                if (value.search('reject:')>-1)
                    metaData.tdCls = 'logcenter-red_cell';
            
                //metaData.tdAttr = "data-qtip='" + value + "'";
                metaData.tdAttr = 'title="' + Ext.util.Format.ellipsis(value, 800) + '"';
                return text;
            }
        }
    ]
});


// id,level,username,firstname,lastname