Ext.define('dr.view.main.MainView', {
	xtype: 'mainView',
	extend: 'Ext.panel.Panel',
	title: 'ობიექტები',
	layout: {
		type: 'vbox',
	},
	items: [{
		xtype: 'panel',
		flex: 1,
		title: 'panel1'
	},{
		xtype: 'panel',
		flex: 1,
		title: 'panel2'
	}]
})