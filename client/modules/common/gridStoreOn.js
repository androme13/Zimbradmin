/* 
 * gridStoreOn
 * (C) Androme 2015
 * 
 */
// fonction générique communes aux modules pour le store

Ext.define('MyDesktop.modules.common.gridStoreOn', {
    create: function () {
        var listener = ({
            refresh: function (store, eOpts) {
                message = store.proxy.reader.jsonData;
                // on gère les messages de retour
                // se reporter à DOC/ZMErrorCodes
                switch (message.error.ZMErrorCode.toString()[0]) {
                    case '1':
                        console.log('add');
                        switch (message.error.ZMErrorCode.toString()[2]) {
                            case'0':
                                Ext.infoMsg.msg("Ajout d'éléments", "L'entrée a bien été ajoutée");
                                break;
                        }
                        break;
                    case '2':
                        console.log('destroy');
                        var nbItems = message.error.affectedRows;
                        console.log('store', store, nbItems);
                        var txtItems = "<BR><B>" + nbItems + "</B> élément(s) supprimé(s)";
                        switch (message.error.ZMErrorCode.toString()[2]) {
                            case'0':
                                Ext.infoMsg.msg("Suppression d'éléments", "La suppression a bien été effectuée" + txtItems);
                                break;
                            case'3':
                                Ext.infoMsg.msg("Suppression d'éléments", "Aucune entrée n'a été supprimée", 5000, 'red');
                                store.reload();
                                break;
                            case'4':
                                Ext.infoMsg.msg("Suppression d'éléments", "Certaines entrées n'ont pas été supprimées" + txtItems, 5000, 'orange');
                                store.reload();
                                break;
                        }
                        break;
                    case '3':
                        console.log('read');
                        break;
                    case '4':
                        console.log('update');
                        switch (message.error.ZMErrorCode.toString()[2]) {
                            case'0':
                                Ext.infoMsg.msg("Modification d'éléments", "La modification a bien été effectuée");
                                break;
                        }
                        break;
                }
            },
            scope: this
        });
        return listener;
    }
});

