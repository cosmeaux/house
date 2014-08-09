/*jslint browser: true, vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, todo: true, sloppy: true */
/*global: Ext, window, House */
Ext.define('House.view.south.FooterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.footer',
    onAppHeaderAfterRender: function (panel) {
        panel.addCls('house-header');
    }
});