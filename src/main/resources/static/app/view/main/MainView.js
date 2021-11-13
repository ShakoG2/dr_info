Ext.define('dr.view.main.MainView', {
	xtype: 'mainView',
	extend: 'Ext.tab.Panel',
	title: '<div style="text-align:center;"><span style="font-size: 12px">Dr Info</span></div>',
	tabPosition: 'left',
	tabRotation:0,
	items: [{
		xtype: 'panel',
		title: 'ობიექტები',
		iconCls:'fa fa-table'
	}]
})