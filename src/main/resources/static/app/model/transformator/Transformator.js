Ext.define('dr.model.transformator.Transformator', {
	extend: 'Ext.data.Model',
	fields: ['id',
		'taskId',
		'custNumber',
		'disconnectedDate',
		'disconnectedTime',
		'reconnectedDate',
		'reconnectedTime',
		{
			name: 'turnOffDuration', convert: function (v) {
				return v + ' ' + 'სთ'
			}
		},
	],

	proxy: {
		type: 'rest',
		url: 'category',
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