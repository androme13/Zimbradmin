/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('MyDesktop.modules.core.directapi.DirectAPI', {
    /*
     Require Ext.Direct classes
     */
    requires: ['Ext.direct.*']
}, function() {
    var Loader = Ext.Loader,
        wasLoading = Loader.isLoading;

    //Loading API
    Loader.loadScriptFile('https://10.0.0.19/directapi', Ext.emptyFn, Ext.emptyFn, null, true);
    
    Loader.isLoading = wasLoading;
    /*
     Add provider. Name must match settings on serverside
     */
    var ns = ExtRemote.REMOTING_API;
    if(ns){
        // Check for unexpected problems
        // Node backend will set error object
        if(ns.error){
            //This is handled later in Application launch method
            console.log(ns.error);
        } else {
           // console.log('ns',ns);
            Ext.direct.Manager.addProvider(ns);
        }
    }
    //Ext.direct.Manager.addProvider(ExtRemote.REMOTING_API);
});
