Ext.define('ma.model.MenuModel', {
	extend: 'Ext.data.TreeModel',
	fields: ['name', 'token', 'iconCls'],

	data: [
		{name: 'ობიექტები', token: 'objects', iconCls: 'no-icon'}
	]
})