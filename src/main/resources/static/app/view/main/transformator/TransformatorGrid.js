Ext.define('dr.view.main.transformator.TransformatorGrid', {
	extend: 'Ext.grid.Panel',

	store: {
		xclass: 'dr.store.transformator.Transformator',
		autoLoad: true
	},
	tbar: [{
		text: 'ჩატვირთვა',
		handler: function () {
			Ext.Ajax.request({
				method: 'POST',
				url: 'category/load-transformators',
				success: function () {
					console.log("success")
				}
			})
		}
	}],
	columns: [{
		text: "დავალება",
		dataIndex: 'taskId',
		flex: 1,
	}, {
		text: "ტრანსფორმატორის N",
		dataIndex: 'custNumber',
		flex: 1,
	}, {
		text: "გათიშვის თარიღი",
		xtype: 'datecolumn',
		format: Ext.Date.defaultFormat,
		dataIndex: 'disconnectedDate',
		flex: 1
	}, {
		text: "გათიშვის დრო",
		dataIndex: 'disconnectedTime',
		flex: 1
	}, {
		xtype: 'datecolumn',
		format: Ext.Date.defaultFormat,
		text: 'ჩართვის თარიღი',
		dataIndex: 'reconnectedDate',
		flex: 1
	}, {
		text: 'ჩართვის დრო',
		dataIndex: 'reconnectedTime',
		flex: 1
	}, {
		text: 'გათიშვის ხანგრძლივობა',
		dataIndex: 'turnOffDuration',
		flex: 1
	}],
	listeners: {
		itemdblclick: 'showTransformerSubscribers'
	},
	bbar: {
		xtype: 'pagingtoolbar',
		displayInfo: true
	},
})