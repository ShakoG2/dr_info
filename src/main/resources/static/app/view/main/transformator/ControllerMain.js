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
	},

	showTransformerSubscribers: function () {
		const me = this;
		const selection = me.lookup('transformatorGrid').getSelectionModel().getSelection()[0];
		let custNumber = selection.data.custNumber;
		const win = Ext.create('dr.view.main.transformator.SubscribersWin', {
			custNumber: custNumber
		});
		me.getView().add(win);
		win.show()
	},

	afterRenderSubscribeGrid: function () {
		const me = this;
		const store = me.lookup('subscribesGrid').getStore();
		const win = me.lookup('subscribeWindow');
		const view = me.getView();
		win.setLoading(true);
		Ext.Ajax.request({
			method: 'GET',
			url: 'category/subscribers',
			params: {
				custNumber: win.custNumber
			},
			success: function (res) {
				let subscribers = Ext.JSON.decode(res.responseText)
				store.loadData(subscribers);
				win.setLoading(false)
			}
		})
	},

	closeSubscribersWin: function () {
		const me = this;
		const win = me.lookup('subscribeWindow');
		win.close()
	}
})