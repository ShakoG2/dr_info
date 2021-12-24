Ext.define('dr.view.main.transformator.SubscribersWin', {
	extend: 'Ext.window.Window',
	width: 900,
	height: 900,

	modal: true,
	reference: 'subscribeWindow',
	title: 'აბონენტები',
	iconCls: 'fas fa-user-friends',

	items: [{
		xtype: 'grid',
		store: {
			xclass: 'dr.store.transformator.Subscribers'
		},
		reference: 'subscribesGrid',
		columns: [{
			text: "მრიცხველის სერიული N",
			dataIndex: 'serialNumber',
			flex: 1,
		}, {
			text: "მრიცხველის უნიკალური ნომერი",
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
		}],
		bbar: {
			xtype: 'pagingtoolbar',
			displayInfo: true
		},
	}],

	buttons: [{
		text: 'დახურვა',
		handler: 'closeSubscribersWin',
		iconCls: 'fa fa-times'
	}],

	listeners: {
		afterRender: 'afterRenderSubscribeGrid'
	}
})