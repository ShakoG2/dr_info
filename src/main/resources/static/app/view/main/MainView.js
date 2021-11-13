Ext.define('dr.view.main.MainView', {
	xtype: 'mainView',
	extend: 'Ext.panel.Panel',
	title: 'ობიექტები',
	layout: {
		type: 'vbox',
	},
	items: [{
		xtype: 'tabpanel',
		items: [{
			xtype: 'panel',
			title: 'panel1',
		},{
			xtype: 'panel',
			title: 'panel2',
		}]
	}]
})