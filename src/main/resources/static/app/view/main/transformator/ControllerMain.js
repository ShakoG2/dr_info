Ext.define('dr.view.main.transformator.ControllerMain', {
	extend: 'Ext.app.ViewController',

	searChTransformators: function () {

		const me = this;
		const grid = me.lookup('transformatorGrid');
		grid.getStore().loadPage(1, {
			params: me.lookup('tSearchForm').getValues()
		})
	},

	reset: function () {
		const me = this;
		me.lookup('tSearchForm').getValues().reset();
	}
})