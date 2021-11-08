Ext.define('ma.view.main.nav.NavView', {
	extend: 'Ext.Panel',
	controller: {
		xclass: 'dr.view.main.nav.NavViewController'
	},
	cls: 'navview',
	layout: 'fit',
	renderConfig: {
		store: null,
		micro: false,
		name: null,
		selection: null
	},
	twoWayBindable: ['selection'],
	updateMicro: function (micro) {
		this.getController().updateMicro(micro);
	},
	updateSelection: function (selection) {
		this.getController().updateSelection(selection);
	},
	items: [{
		xclass: 'dr.view.nav.menu.MenuView',
		reference: 'menuview',
		listeners: {
			selectionchange: 'onMenuViewSelectionChange'
		}
	}]
});