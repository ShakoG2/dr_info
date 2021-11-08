//----- ext bug fixes -----
Ext.override(Ext.window.Window, {
	constrainHeader: true,
	constructor: function (cfg) {
		cfg = cfg || {};
		let me = this;

		this.callParent(arguments);

		if (!cfg.maxHeight && !cfg.height && !me.maxHeight && !me.height) {
			this.setMaxHeight(Ext.getBody().getHeight() * 0.8);
			// if (this.items.items.length === 1) {
			// 	this.items.items[0].setScrollable('y');
			// }
			// პატარა ფანჯრებს
		}

		me.on('show', function () {
			me.removeCls('x-unselectable');
		});
	}
});

Ext.override(Ext.button.Button, {
	config: {
		badgeText: null
	},
	updateBadgeText: function (badgeText, oldBadgeText) {
		const me = this;

		if (me.rendered) {
			me.getEl().set({
				'data-badge-text': badgeText
			});
			me.getEl().toggleCls(Ext.baseCSSPrefix + 'badge', badgeText !== false);
			me.fireEvent('badgetextchange', me, badgeText, oldBadgeText);
		} else {
			let listener = me.on('afterrender', function () {
				me.un('afterrender', listener);
				me.updateBadgeText(badgeText);
			});
		}
	},
	constructor: function () {
		const me = this;
		me.callParent(arguments);
		let badgeText = this.getBadgeText();
		if (badgeText) {
			me.updateBadgeText(badgeText);
		}
	}
});

Ext.override(Ext.grid.RowEditor, {
	cancelEdit: function () {
		if (this.context)
			this.callParent(arguments);
	}
});

Ext.override(Ext.form.RadioGroup, {
	isValid: function () {
		this.validate();
		return this.callParent(arguments);
	}
});

Ext.override(Ext.view.Table, {
	enableTextSelection: true
});

Ext.override(Ext.app.bind.Formula, {
	setValue: function (a) {
		if (Ext.isFunction(this.set)) {
			this.callParent(arguments)
		}
	}
});

Ext.override(Ext.form.trigger.Trigger, {
	onFieldBlur: function (a) {
		this.getStateEl() && this.getStateEl().removeCls(this.focusCls)
	},
	onFieldFocus: function (a) {
		this.getStateEl() && this.getStateEl().addCls(this.focusCls)
	}
});

Ext.override(Ext.form.field.Text, {
	refreshEmptyText: function () {
		let me = this,
				inputEl = me.inputEl,
				emptyClsElements = me.emptyClsElements,
				value, isEmpty, i;

		if (inputEl) {
			value = me.getValue();
			// დავამატე !Ext.isEmpty(value) ეს პირობა
			isEmpty = !(inputEl.dom.value || !Ext.isEmpty(value) || (Ext.isArray(value) && value.length));

			if (me.placeholderLabel) {
				me.placeholderLabel.setDisplayed(isEmpty);
			}

			for (i = 0; i < emptyClsElements.length; i++) {
				emptyClsElements[i].toggleCls(me.emptyUICls, isEmpty);
			}
		}
	}
});
//!----- ext bug fixes -----

Ext.Date.defaultFormat = 'd.m.Y';
Ext.Date.defaultTimeFormat = 'H:i:s';
Ext.Date.defaultDateTimeFormat = 'd.m.Y H:i:s';
Ext.Date.isoDateTimeFormat = 'd-m-Y H:i:s';
if (Ext.util && Ext.util.Format) {
	Ext.apply(Ext.util.Format, {
		dateFormat: Ext.Date.defaultFormat
	});
}
Ext.override(Ext.picker.Date, {
	format: Ext.Date.defaultFormat
});
Ext.override(Ext.form.field.Date, {
	format: Ext.Date.defaultFormat
});
Ext.override(Ext.grid.DateColumn, {
	format: Ext.Date.defaultFormat
});
Ext.override(Ext.grid.PropertyColumnModel, {
	dateFormat: Ext.Date.defaultFormat
});
Ext.override(Ext.form.field.Time, {
	format: Ext.Date.defaultTimeFormat
});
Ext.override(Ext.form.field.Time, {
	format: Ext.Date.defaultTimeFormat
});

Ext.define('LE.form.trigger.Clear', {
	extend: 'Ext.form.trigger.Trigger',
	alias: 'trigger.clear',
	cls: 'x-form-clear-trigger',
	weight: -1,
	handler: function () {
		this.reset();
		this.setValue();
	},
	constructor: function () {
		this.tooltip = _('გასუფთავება');
		this.callParent(arguments);
	}
});

Ext.override(Ext.grid.column.Number, {
	align: 'right'
});

Ext.override(Ext.form.RadioGroup, {
	msgTarget: 'side'
});

Ext.override(Ext.form.Panel, {
	constructor: function (cfg) {
		cfg = cfg || {};
		cfg.enablekeyEvents = true;
		let me = this;

		me.callParent(arguments);

		let submitBtn = me.down('button[submitsForm=true]');

		if (me.submitFn || me.submitBtn || submitBtn) {
			me.on('afterrender', function () {
				me.keyNav = new Ext.util.KeyNav({
					target: me.getEl(),
					enter: function (e) {
						if (me.getForm().isValid()) {
							if (Ext.isFunction(me.submitFn)) {
								me.submitFn.call();
							} else if (me.submitBtn) {
								me.submitBtn.fireHandler();
							} else if (submitBtn) {
								submitBtn.fireHandler();
							}
						}
					}
				});
			});
		}
	},

	clearForm: function (validate) {
		Ext.each(this.getForm().getFields().items, function (field) {
			field.setValue('');
		});
		if (!validate) {
			this.getForm().clearInvalid();
		}
	},

	resetOriginalValues: function () {
		Ext.each(this.getForm().getFields().items, function (field) {
			field.resetOriginalValue();
		});
	}
});

Ext.override(Ext.form.Basic, {
	setValues: function (values) {
		return this.callParent([flatObject(values)]);
	},
	updateRecord: function (record) {
		record = record || this.getRecord();

		let data = record.getData();
		let values = this.getFieldValues();

		for (let i in values) {
			let paths = i.split('.');
			if (paths.length > 1 && record.getField(paths[0])) {
				deepChange(data, paths, values[i]);
			}
		}
		record.set(data);

		this.callParent([record]);

		return record;
	}
});

Ext.override(Ext.form.field.Base, {
	labelAlign: 'top',
	constructor: function (cfg) {
		let me = this;
		if (cfg.description) {
			me.afterLabelTextTpl = ' <i class="far fa-question-circle" data-qtip="' + cfg.description + '"></i>';
		}

		me.callParent(arguments);

		if (!me.allowBlank && this.fieldLabel
				&& me.$className !== 'Ext.form.field.Display'
				&& me.$className !== 'Ext.form.field.Checkbox') {
			// this.setFieldLabel('<span class="mandatory"><span class="icon">*</span> '
			// 	+ this.fieldLabel + '</span>');
			me.refreshMandatorySign();
		}
	},
	setAllowBlank: function (allowBlank) {
		this.allowBlank = allowBlank;
		this.refreshMandatorySign();
	},
	refreshMandatorySign: function () {
		if (this.allowBlank === false) {
			this.addCls('mandatory');
		} else {
			this.removeCls('mandatory');
		}
	}
});

Ext.override(Ext.form.FieldContainer, {
	labelAlign: 'top',
	constructor: function (cfg) {
		this.callParent(arguments);
		if (this.allowBlank === false && this.fieldLabel) {
			this.refreshMandatorySign();
		}
	},
	setAllowBlank: function (allowBlank) {
		this.allowBlank = allowBlank;
		this.refreshMandatorySign();
	},
	refreshMandatorySign: function () {
		if (this.allowBlank === false) {
			this.addCls('mandatory');
		} else {
			this.removeCls('mandatory');
		}
	}
});

Ext.override(Ext.form.field.Display, {
	labelAlign: 'left',
	padding: '0 0 0 0',
	style: 'margin-top:0px;margin-bottom:0px;'
});

Ext.override(Ext.form.field.Number, {
	minValue: 0,
	mouseWheelEnabled: false,
	// spinDownEnabled: false,
	// spinUpEnabled: false
});

Ext.override(Ext.form.field.Checkbox, {
	inputValue: true,
	uncheckedValue: false
});

Ext.override(Ext.form.field.Text, {
	config: {vtype: null},
	setVtype: function (vtype) {
		this.updateVtype(vtype, this.rendered);
	},
	updateVtype: function (newVtype, withValidate) {
		let me = this;

		me.vtype = newVtype;
		Ext.apply(me, {vtype: newVtype});
		me.maskRe = Ext.form.field.VTypes[me.vtype + 'Mask'];
		if (withValidate !== false) {
			me.validate();
		}
	}
});

Ext.override(Ext.data.proxy.Server, {
	constructor: function (cfg = {}) {
		this.timeout = cfg.timeout || Ext.Ajax.getTimeout();
		this.callParent(arguments);
	},
	getParams: function (operation) {
		let params = this.callParent(arguments);
		if (Ext.isFunction(operation.getFilters)) {
			Ext.each(operation.getFilters(), function (filter) {
				let val = filter.config.value;
				params[val.property] = val.value;
			});
		}
		return params;
	}
});

Ext.override(Ext.data.AbstractStore, {
	_doFilter: function (name, regex) {
		let me = this;

		let filter = new Ext.util.Filter({
			filterFn: function (rec) {
				return me._found(rec, name, regex)
			}
		});
		me.addFilter(filter);
		return filter;
	},

	_found: function (rec, name, regex) {
		let toSearch = (name instanceof Ext.XTemplate) ? name.apply(rec.getData()) : rec.get(name);
		return toSearch && toSearch.match(regex);
	}
});

Ext.override(Ext.data.Store, {
	loadPage: function (page, options) {
		if (!options && this.lastOptions) {
			options = {
				params: this.lastOptions.params,
				pathParams: this.lastOptions.pathParams
			};
		}
		this.callParent([page, options]);
	}
});

Ext.override(Ext.data.TreeStore, {
	_doFilter: function (name, regex) {
		// console.debug('tree filter');
		let me = this;
		let foundIds = {};
		me.getRootNode().cascade(function (rec) {
			if (foundIds[rec.getId()]) return;
			if (me._found(rec, name, regex)) {
				do {
					foundIds[rec.getId()] = true;
					rec = rec.parentNode;
				} while (rec);
			}
		});

		let filter = new Ext.util.Filter({
			filterFn: function (rec) {
				return foundIds[rec.getId()];
			}
		});
		me.addFilter(filter);
		return filter;
	}
});

Ext.override(Ext.data.ProxyStore, {
	/**
	 * @deprecated
	 * @param opts
	 */
	loadBy: function (opts) {
		this.loadPage(1, opts);
	}
});

Ext.override(Ext.Base, {
	setAccess: function (access) {
		this.removeAccess();
		access.component = this;
		this.access = Ext.create('LE.component.Access', access);
		this.access.check();
	},
	getAccess: function () {
		return this.access;
	},
	removeAccess: function () {
		if (this.access) {
			delete this.access;
		}
	}
});

Ext.override(Ext.Component, {
	constructor: function () {
		let me = this;
		me.callParent(arguments);
		if (me.access) {
			me.setAccess(me.access);
		}
	},
	setLoading: function (msg) {
		const me = this;
		if (msg === false && !me) {
			return;
		}
		me.callParent(arguments);
	}
});

Ext.override(Ext.app.ViewController, {
	setLoading: function () {
		const view = this.getView();
		view && view.setLoading.apply(view, arguments);
	}
});

Ext.override(Ext.plugin.Abstract, {
	constructor: function (cfg) {
		let me = this;
		me.callParent(arguments);
		if (me.access) {
			me.setAccess(me.access);
		}
	}
});

Ext.override(Ext.list.TreeItem, {
	constructor: function (it) {
		let access = it.node ? it.node.get('access') : false;
		this.callParent(arguments);
		if (access) {
			this.setAccess(access);
		}
	},
	setDisabled: function (disabled) {
		if (disabled) {
			this.getToolElement().addCls('x-treelist-item-disabled');
			this.addCls('x-treelist-item-disabled');
		} else {
			this.getToolElement().removeCls('x-treelist-item-disabled');
			this.removeCls('x-treelist-item-disabled');
		}
	}
});

Ext.override(Ext.panel.Panel, {
	constructor: function (cfg) {
		cfg = cfg || {};
		let me = this;
		if (me.refreshTool || cfg.refreshTool) {
			me.tools = cfg.tools = [{
				type: 'refresh',
				tooltip: _('განახლება'),
				callback: function () {
					let store = me.store;
					if (!store) {
						store = me.down('grid').store;
					}
					if (store) store.reload();
				}
			}]
		}
		me.callParent(arguments);
	}
});

Ext.override(Ext.grid.column.Column, {
	// this.tooltip = {
	constructor: function (cfg) {
		this.callParent(arguments);
		if (cfg.text || cfg.header) {
			this.addListener('afterrender', function () {
				let txt = cfg.text || cfg.header;
				if (txt.trim()) {
					Ext.create('Ext.tip.ToolTip', {
						target: this.id,
						trackMouse: true,
						html: cfg.text || cfg.header
					});
				}
			});
		}
	},
});
//
// Ext.override(Ext.grid.plugin.RowEditing, {
// 	startEdit: function (rec) {
// 		let me = this;
// 		me.callParent(arguments);
// 		let field = me.editor.down('textfield');
// 		field && field.fireEvent('change');
// 	}
// });

Ext.override(Ext.PagingToolbar, {
	constructor: function () {
		let me = this;
		let hasStore = !!me.store;
		me.callParent(arguments);

		if (!hasStore) {
			let grid = me.up('grid');
			if (grid) {
				me.bindStore(grid.getStore());
			}
		}
	}
});

Ext.override(Ext.panel.Table, {
	filter: function (name, value) {
		const me = this;
		let regex = (value instanceof RegExp) ? value : getFullTextRegex(value);
		me.regex = regex;
		if (me.fullTextLastFilter) {
			me.getStore().removeFilter(me.fullTextLastFilter);
			me.fullTextLastFilter = null;
		}
		if (regex) {
			me.fullTextLastFilter = me.getStore()._doFilter(name, regex);
		}
	}
});

Ext.override(Ext.form.field.ComboBox, {
	filter: function (name, value) {
		let me = this;
		let regex = (value instanceof RegExp) ? value : getFullTextRegex(value);

		if (regex) {
			return me.getStore()._doFilter(name, regex);
		}
	},
	doLocalQuery: function (queryPlan) {
		const me = this;
		if (!me.fullTextFilter) {
			me.callParent(arguments);
		} else {
			let value = queryPlan.query;

			if (me.fullTextLastFilter) {
				me.getStore().removeFilter(me.fullTextLastFilter);
				me.fullTextLastFilter = null;
			}

			if (value !== null) {
				me.changingFilters = true;

				me.fullTextLastFilter = me.filter('value', value);
				me.changingFilters = false;
			}

			if (me.store.getCount() || me.getPicker().emptyText) {
				me.getPicker().refresh();
				me.expand();
			} else {
				me.collapse();
			}

			me.afterQuery(queryPlan);
		}
	}
});

Ext.override(Ext.grid.column.Boolean, {
	renderer: function (v) {
		return v ? '<i class="far fa-check-square"/>' : '<i class="far fa-square"/>';
	}
});

Ext.override(Ext.util.Format, {
	_: _,
	objectRenderer: objectRender,
	moneyRenderer: moneyRenderer,
	money: moneyRenderer(),
	rate: rateRenderer(),
	dateTime: dateTimeRenderer(),
	user: userRenderer,
	branch: officeRenderer,
	customerRenderer: customerRenderer,
	productNameRenderer: productNameRenderer,
	hasPermission: function (permission) {
		return hasPermission(permission);
	},
	contains: function (val, arr) {
		return Ext.isArray(arr) && arr.includes(val);
	}
});

//
// Ext.override(Ext.data.Model, {
// 	// load: function (opt) {
// 	// 	if (opt && opt.pathParams) {
// 	// 		this.getProxy().setUrl(buildURL(this.getProxy().getUrl(), opt.pathParams));
// 	// 	}
// 	// 	this.callParent(arguments);
// 	// },
// 	//todo depricate remove
// 	set: function () {
// 		this.callParent(arguments);
// 		if (Ext.isFunction(this.onUpdate)) {
// 			this.onUpdate.call();
// 		}
// 	}
// });

Ext.define('Override.form.field.VTypes', {
	override: 'Ext.form.field.VTypes',

	IPAddress: function (value) {
		return this.IPAddressRe.test(value);
	},
	IPAddressRe: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
	IPAddressText: 'Must be a numeric IP address',
	IPAddressMask: /[\d\.]/i,

	PersonalNoPhys: function (v) {
		return this.PersonalNoPhysRe.test(v);
	},
	PersonalNoPhysText: 'პირადი N უნდა შედგებოდეს 11 ციფრისგან',
	PersonalNoPhysRe: /^[\d]{11}$/,
	PersonalNoPhysMask: /[\d]/i,

	personalNoJur: function (v) {
		return this.personalNoJurRe.test(v);
	},
	personalNoJurRe: /^[\d]{9}$/,
	personalNoJurText: 'საიდენტიფიკაციო N უნდა შედგებოდეს 9 ციფრისგან',
	personalNoJurMask: /[\d]/i,


	phone: function (v) {
		return this.phoneRe.test(v);
	},
	phoneRe: /^[\d]{4,20}$/,
	phoneText: 'ტელეფონის ნომერი უნდა შედგებოდეს 4-20 სიმბოლოსგან',
	phoneMask: /[\d]/i,


	mobile: function (v) {
		return this.mobileRe.test(v);
	},
	mobileRe: /^(5)[\d]{8}$/,
	mobileText: 'მობილური უნდა შედგებოდეს 9 სიმბოლოსგან. ფორმატი: 5XXXXXXXX',
	mobileMask: /[\d]/i,

	mobileForeign: function (v) {
		return this.mobileForeignRe.test(v);
	},
	mobileForeignRe: /^[+]?[\d]+$/,
	mobileForeignText: 'არასწორი ფორმატი. დასაშვები ფორმატი: დასაწყისში "+" ან მის გარეშე, შემდეგ ნომერი',
	mobileForeignMask: /[+\d]/i,

});
