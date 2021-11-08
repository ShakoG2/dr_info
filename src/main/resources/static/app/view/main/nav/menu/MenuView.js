Ext.define('dr.view.nav.menu.MenuView', {
	extend: 'Ext.list.Tree',
	requires: ['Ext.data.TreeStore'],
	ui: 'nav',
	scrollable: true,
	bind: {
		micro: '{navCollapsed}',
		store: '{menu}'
	},
	expanderFirst: false,
	expanderOnly: false,
	listeners: {
		selectionchange: 'onMenuViewSelectionChange'
	}
});