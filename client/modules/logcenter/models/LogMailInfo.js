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
        },
        {
            name: 'date',
            exportable: true,
            type: 'string',
            flex: 1
        },
        {
            name: 'host',
            exportable: true,
            type: 'string',
            flex: 1
        },
        {
            name: 'process',
            exportable: true,
            type: 'string',
            flex: 1
        },
        {
            name: 'key',
            exportable: true,
            type: 'string',
            searchable: true,
            flex: 1,
            renderer: function (value, metaData, record, row, col, store, gridView) {
                text = Ext.util.Format.htmlEncode(value);
                if (text === 'NOQUEUE')
                    metaData.tdCls = 'logcenter-red_cell';
                // else
                //     metaData.style = "background-color:green;";

                //metaData.tdAttr = "data-qtip='" + value + "'";
                metaData.tdAttr = 'title="' + Ext.util.Format.ellipsis(value, 800) + '"';
                return text;
            },
            contextMenu: [
                {
                    text: "Chercher cette clé",
                    iconCls: 'search16',
                    handler: function (column,record,item) {
                        console.log(column,record)
                        console.log(record.get(column.dataIndex));
                        var search=record.get(column.dataIndex);                       
                        this.store.load({
                            params:{search: search}
                        });
                    }
                },
            ]
        },
        {
            name: 'message',
            exportable: true,
            type: 'string',
            flex: 4,
            searchable: true,
            renderer: function (value, metaData, record, row, col, store, gridView) {
                text = Ext.util.Format.htmlEncode(value);
                // 550 blocked
                if (value.search(/said: 550/i) > -1)
                    metaData.tdCls = 'logcenter-red_cell';
                else
                // message entrant
                if (value.search(/^from=.*\)$/) > -1)
                    metaData.tdCls = 'logcenter-greenclear_cell';
                else
                // message entrant dans la queue
                if (value.search(/^message-id=.*>$/) > -1)
                    metaData.tdCls = 'logcenter-greenclear_cell';
                else
                // message reject
                if (value.search('reject:') > -1)
                    metaData.tdCls = 'logcenter-red_cell';
                else
                // message removed
                if (value.search('removed') > -1)
                    metaData.tdCls = 'logcenter-greenclear_cell';
                else
                // message send
                if (value.search('status=sent') > -1)
                    metaData.tdCls = 'logcenter-green_cell';
                else
                // message deferred 
                if (value.search('status=deferred') > -1)
                    metaData.tdCls = 'logcenter-orange_cell';


                //metaData.tdAttr = "data-qtip='" + value + "'";
                metaData.tdAttr = 'title="' + Ext.util.Format.ellipsis(value, 800) + '"';
                return text;
            }
        }
    ]
});


// id,level,username,firstname,lastname