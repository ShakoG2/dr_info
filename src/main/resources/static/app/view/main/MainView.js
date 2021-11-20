Ext.define('dr.view.main.MainView', {
	xtype: 'mainView',
	extend: 'Ext.tab.Panel',
	title: '<div style="text-align:center;"><span style="font-size: 12px">Dr Info</span></div>',
	tabPosition: 'left',
	tabRotation: 0,
	controller: {
		xclass: 'dr.view.main.transformator.ControllerMain'
	},
	items: [{
		xtype: 'panel',
		iconCls: 'fa fa-table',
		title: 'ტრანსფორმატორები',
		border: false,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [{
			xtype: 'form',
			height: 150,
			border: false,
			reference: 'tSearchForm',
			fieldDefaults: {
				width: 400,
				labelAlign: 'top'
			},
			layout: {
				align: "center",
				type: 'vbox',
			},
			items: [{
				xtype: 'container',
				flex: 1,
				layout: 'anchor',
				items: [{
					xtype: 'textfield',
					fieldLabel: 'თასქის ნომერი',
					name: 'taskId'
				}, {
					xtype: 'textfield',
					fieldLabel: 'ტრანსფორმატორის ნომერი',
					name: 'custNumber'
				}]
			}],
			buttons: ['->', {
				text: 'ძებნა',
				iconCls: 'fa fa-search',
				handler: 'searChTransformators',
				submitsForm: true

			}, {
				text: 'გასუფთავება',
				width: 130,
				iconCls: 'fa fa-eraser',
				handler: 'reset'
			}]
		}, {
			reference: 'transformatorGrid',
			flex: 1,
			xclass: 'dr.view.main.transformator.TransformatorGrid',
		}]
	}]
})