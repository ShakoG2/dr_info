Ext.define('dr.view.main.transformator.ControllerMain', {
	extend: 'Ext.app.ViewController',

	searChTransformators: function () {
		const me = this;
		const grid = me.lookup('transformatorGrid');
		const params = me.lookup('tSearchForm').getValues();
		let year = me.lookup('yearField').getValue()
		let month = me.lookup('monthField').getValue()
		params.year = year;
		params.month = month;
		if(!year || !month){
			Ext.Msg.alert('შეტყობინება!',"წლის და თვის ველი სავალდებულოა!");
			return;
		}
		grid.getStore().loadPage(1, {
			params: params
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
	},

	loadDataWithYearAndMonth: function () {
		const me = this;
		let year = me.lookup('yearField').getValue()
		let month = me.lookup('monthField').getValue()
		let view = me.getView();
		if (!year || !month) {
			Ext.Msg.alert('შეტყობინება!',"წლის და თვის ველი სავალდებულოა!");
			return;
		}
		view.setLoading(true);
		Ext.Ajax.request({
			method: 'POST',
			params: {
				year: year,
				month: month
			},
			url: 'category/load-transformators',
			success: function () {
				view.setLoading(false)
				Ext.Msg.alert('შეტყობინება!', 'მონაცემები წარმატებით ჩაიტვირთა 🥳')
			},
			// failure: function () {
			// 	view.setLoading(false)
			// 	Ext.Msg.alert('შეტყობინება!', 'მონაცემები ჩატვირთვა ვერ მოხერხდა ')
			// }
		})
	}
})