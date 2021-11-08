Ext.define('dr.view.main.MainViewModel', {
	extend: 'Ext.app.ViewModel',
	data: {
		name: 'dr',
		navCollapsed: false
	},
	stores: {
		menu: {
			xclass: 'dr.store.MenuStore',
		//	autoLoad: true
		}
	}

})