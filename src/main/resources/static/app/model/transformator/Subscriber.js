Ext.define('dr.model.transformator.Subscriber', {
	extend: 'Ext.data.Model',
	fields: ['id', 'unitNumber', 'serialNumber', 'customerName', 'transformerCustNumber', 'custNumber'],

	proxy: {
		type: 'rest',
		url: 'category/subscribers',
		reader: {
			rootProperty: 'content',
			totalProperty: 'totalElements'
		},
		writer: {
			writeAllFields: true,
			writeRecordId: false
		}
	}
})