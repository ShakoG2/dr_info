/**
 * Created by vano on 4/8/16.
 */
//---------- LOAN UTILS ----------

function increaseDate(date, durationType, durationPeriods) {
	switch (durationType) {
		case 'DAY':
			return Ext.Date.add(date, Ext.Date.DAY, durationPeriods);
		case 'MONTH':
			return Ext.Date.add(date, Ext.Date.MONTH, durationPeriods);
		case 'YEAR':
			return Ext.Date.add(date, Ext.Date.YEAR, durationPeriods);
		default:
			throw 'Invalid Duration Type';
	}
}

//---------- END OF LOAN UTILS ----------
//---------- RENDERERS ----------
const dynamicRendererCache = {};

function dynamicRenderer(type, id, tplOrFn) {
	if (!id) {
		return '';
	} else if (!type) {
		return id;
	}
	let cache = (dynamicRendererCache[type] = dynamicRendererCache[type] || {});

	if (!cache[id]) {
		cache[id] = {
			type: type,
			id: id,
			loading: true,
			success: false,
			data: null,
			callbackFns: []
		};
		request({
			url: 'utils/dynamic-renderer/{type}/{id}',
			method: 'GET',
			alert: false,
			pathParams: {
				type: type,
				id: id
			},
			callback: function (data, res, success) {
				cache[id].loading = false;
				cache[id].success = success;
				cache[id].data = data;
				while (cache[id].callbackFns.length) {
					cache[id].callbackFns.pop().call();
				}
			}
		});
	}
	if (cache[id].loading) {
		let uniqueId = Ext.id();
		cache[id].callbackFns.push(function () {
			let element = Ext.get(uniqueId);
			if (element) {
				element.update(callTplCache(tplOrFn, cache[id]));
			} else if (Ext.isFunction(tplOrFn)) {
				callTplCache(tplOrFn, cache[id]);
				// tplOrFn.call(null, cache[id].data);
			}
		});
		return '<span id="' + uniqueId + '"><i class="fas fa-spinner fa-pulse"></i></span>';
	}
	return callTplCache(tplOrFn, cache[id]);
}

function callTplCache(tplOrFn, cache) {
	if (!cache.success) {
		return '<i style="color:red;" class="fas fa-exclamation-triangle" data-qtitle="' + _('შეცდომა') + '" data-qtip="type: ' + cache.type + ', id:' + cache.id + '"></i>';
	}
	return callTpl(tplOrFn, cache.data);
}

function callTpl(tplOrFn, data) {
	if (Ext.isFunction(tplOrFn)) {
		return tplOrFn.call(null, data);
	}
	if (Ext.isString(tplOrFn)) {
		tplOrFn = new Ext.XTemplate(tplOrFn);
	}
	return tplOrFn.apply(data);
}

function objectRender(objectType, objectId, hideObjectType) {
	if (objectType && objectId) {
		if (hideObjectType) {
			return Ext.String.format('<a href="#{0}">{1}</a>', getHashByObjType(objectType, objectId), objectId);
		}
		return Ext.String.format('{1}: <a href="#{0}"> #{2}</a>', getHashByObjType(objectType, objectId), _(objectType), objectId);
	}
	return '';
}

function validatorRenderer(id) {
	return dynamicRenderer('VALIDATORS', id, '{name}')
}

function objectNameRenderer(id) {
	return dynamicRenderer('OBJECT_TYPE', id, '{title}');
}

function cashNodeRenderer(id, tplOrFn) {
	return dynamicRenderer('CASH_NODE', id, tplOrFn || '{name}');
}

function cashNodeNameRenderer(id) {
	return cashNodeRenderer(id, '{name}');
}

function structuralUnitRenderer(id, tplOrFn) {
	return dynamicRenderer('STRUCTURAL_UNIT', id, tplOrFn || '{name}');
}

function structuralUnitNameRenderer(id) {
	return structuralUnitRenderer(id, '{name}');
}

function branchRenderer(id, tplOrFn) {
	return dynamicRenderer('BRANCH', id, tplOrFn || '{name}');
}

function branchNameRenderer(id) {
	return branchRenderer(id, '{name}');
}

function employeeRenderer(id, tplOrFn) {
	return dynamicRenderer('EMPLOYEE', id, tplOrFn || '{firstName} {lastName}')
}

function collateralGenParamRenderer(id, tplOrFn) {
	return dynamicRenderer('COLLATERAL_GEN_PARAM', id, tplOrFn || '{value}');
}

function collateralGenParamNameRenderer(id) {
	return collateralGenParamRenderer(id, '{value}');
}

function marketRenderer(id, tplOrFn) {
	return dynamicRenderer('MARKET', id, tplOrFn || '{name}');
}

function marketNameRenderer(id) {
	return marketRenderer(id, '{name}');
}

function discountConditionRenderer(id, tplOrFn) {
	return dynamicRenderer('DISCOUNT_CONDITION', id, tplOrFn || '{name}');
}

function discountConditionNameRenderer(id) {
	return discountConditionRenderer(id, '{name}');
}

function employeeGenParamRenderer(id, tplOrFn) {
	return dynamicRenderer('EMPLOYEE_GEN_PARAM', id, tplOrFn || '{value}');
}

function employeeGenParamNameRenderer(id) {
	return employeeGenParamRenderer(id, '{value}');
}

function insuranceCompanyRenderer(id, tplOrFn) {
	return dynamicRenderer('INSURANCE_COMPANY', id, tplOrFn || '{companyName}')
}

function positionWithWorkSalaryDate(id, tplOrFn) {
	return dynamicRenderer('POSITION_WORK_SALARY_DATE', id, tplOrFn || '{positionWithChargeDateNumber}')
}

function userRenderer(id) {
	return userTplRenderer('{firstName} {lastName}')(id);
}

function usernameRenderer(id) {
	return userTplRenderer('{username}')(id);
}

function userTplRenderer(tpl) {
	tpl = tpl || '{username} ({firstName} {lastName})';
	return function (id) {
		return dynamicRenderer('USER', id, tpl);
	}
}

function glChartRenderer(id, tplOrFn) {
	return dynamicRenderer('GL_CHART', id, tplOrFn || '{balanceAccountName}');
}

function glChartNameRenderer(id) {
	return glChartRenderer(id, '{balanceAccountName}');
}

// function glAccountRenderer(accountId, account) {
// 	if (Ext.isEmpty(account)) return '';
// 	return '<a onclick="explainGlAccount(' + accountId + ', \'' + account + '\', this)"><span class="label bg-red fas fa-exclamation-triangle"></span>' + account + '</a>';
// }

function eventRenderer(eventId) {
	if (!eventId) return '';
	return objectRender("EVENT", eventId, true);
}

function jobRenderer(jobId) {
	if (!jobId) return '';
	return dynamicRenderer("JOB", jobId, '<a href="#jobs/{id}">{title}</a>');
}

function flowRenderer(flowId) {
	if (!flowId) return '';
	return dynamicRenderer("FLOW", flowId, '<a href="#flow/{id}">{name}</a>');
}

function glAccountRenderer(id, tpl) {
	return dynamicRenderer('GL_ACCOUNT', id, function (account) {
		return renderGlAccount(account, tpl);
	});
}

function loanAgreementNumberRenderer(agreementNumber) {
	if (!agreementNumber) return '';
	return '<a href="#loans/agrNum/' + agreementNumber + '">' + agreementNumber + '</a>';
}

function loanRenderer(loanId) {
	return dynamicRenderer('LOAN', loanId, '<a href="#loans/{id}">{agrNum}</a>');
}

function renderGlAccount(account, tpl) {
	if (!account || Ext.isEmpty(account.account)) return '';

	if (!tpl) {
		tpl = '{account}';
	}

	if (Ext.isString(tpl)) {
		tpl = new Ext.XTemplate(tpl);
	}

	let accountTxt = '<a onclick="explainGlAccount(' + account.id + ', \'' + account.account + '\', this)">' + account.account + '</a>';
	if (!account.active) {
		accountTxt = '<span class="color-red">' + accountTxt + '</span>';
	}
	return tpl.apply(Ext.merge({}, account, {account: accountTxt}));
}

function explainGlAccount(id, account, el) {
	Ext.create('LE.view.accounting.glAccount.AccountExplainWin', {
		accountId: id,
		account: account,
		animateTarget: el
	}).show();
}

function officeRenderer(officeId) {
	return branchNameRenderer(officeId);
}

function transactionNameRenderer(id) {
	return dynamicRenderer('TRANSACTION', id, '{name}');
}

function productNameRenderer(ids) {
	if (!Ext.isArray(ids)) ids = [ids];
	return ids.map(function (id) {
		return dynamicRenderer('PRODUCT', id, '{name}');
	}).join(', ');
}

function amountTypeNameRenderer(id) {
	return dynamicRenderer('AMOUNT_TYPE', id, '{name}');
}

function dateRenderer(format) {
	format = format || Ext.Date.defaultFormat;
	return Ext.util.Format.dateRenderer(format);
}

function dateTimeRenderer(format) {
	format = format || Ext.Date.defaultFormat + ' ' + Ext.Date.defaultTimeFormat;// 'Y-m-d H:i';
	return Ext.util.Format.dateRenderer(format);
}

function boolRenderer(v) {
	if (v === null) return '';
	return '<i class="fas fa-' + (v ? 'check' : 'times') + '"></i>';
}

function moneyRenderer(format) {
	format = format || '0,000.00';
	return Ext.util.Format.numberRenderer(format);
}

function rateRenderer(format) {
	format = format || '0,000.0000%';
	return Ext.util.Format.numberRenderer(format);
}

function currencyRenderer(v) {
	return v ? Ext.util.Format.currency(v) : '';
}

function highlightRenderer(tpl) {
	if (tpl) {
		tpl = tpl instanceof Ext.XTemplate ? tpl : new Ext.XTemplate(tpl);
	}
	return function (v, meta, rec, x, y, s, view) {
		let text = tpl ? tpl.apply(rec.getData()) : v;
		return view.grid.regex ? highlight(text, view.grid.regex) : text;
	}
}

function timeRenderer(t) {
	if (t === undefined || t === null || t === '') return '';
	t = parseInt(t);
	let hour = Math.floor(t / 3600);
	let minute = Math.floor(t % 3600 / 60);
	let second = t % 60;

	if (hour < 10) hour = '0' + hour;
	if (minute < 10) minute = '0' + minute;
	if (second < 10) second = '0' + second;
	return hour + ':' + minute + ':' + second;
}

function label(text, bgColor, color, extraStyle) {
	bgColor = bgColor || '#000';
	color = color || '#FFF';
	return '<span class="label" style="background-color: ' + bgColor + ';color: ' + color + ';' + extraStyle + '">' + text + '</span>';
}

function customerRenderer(id, tplOrFn = '{fullName} ({personalNo})') {
	return dynamicRenderer('CUSTOMER', id, function (customer) {
		return renderCustomer(customer, tplOrFn);
	});
}

function renderCustomer(customer, tpl = '{fullName}') {
	if (!customer) return '';
	let type;
	if (customer.juridical) {
		type = 'juridical';
	} else {
		type = 'individual';
	}

	let tooltip = '<table>' +
			'<tr><td colspan="2"><img src="' + getProfilePhoto(customer.profileFileId) + '" style="height: 60px;" alt="No Photo"/></td></tr>' +
			'<tr><td colspan="2" style="font-weight: bold;">' + (customer.juridical ? _('იურიდიული') : _('ფიზიკური')) + '</td></tr>' +
			'<tr><td style="font-weight: bold;">' + _('სახელი') + ':</td><td>' + customer.fullName + '</td></tr>' +
			'<tr><td style="font-weight: bold;">' + _('პირადი N') + ':</td><td>' + customer.personalNo + '</td></tr>' +
			'</table>';

	tooltip = Ext.String.htmlEncode(tooltip);
	return '<a href = "/#clients/' + type + '/' + customer.id + '" data-qtip="' + tooltip + '">' + callTpl(tpl, customer) + '</a>';
}

function getProfilePhoto(profileFileId) {
	return profileFileId ? 'attachments/files/' + profileFileId + '/preview' : 'images/no-photo.jpg';
}

function collateralRenderer(id, tpl) {
	return dynamicRenderer('COLLATERAL', id, function (collateral) {
		return renderCollateral(collateral, tpl);
	});
}

function renderCollateral(collateral, tpl) {
	let text;
	if (tpl) {
		text = callTpl(tpl, collateral);
	} else {
		let res = [];
		switch (collateral.collateralType) {
			case 'HYPOTHEC':
				res = [collateral.sakCode, collateral.address, collateral.area];
				break;
			case 'TECHNIC':
				res = [collateral.brand, collateral.model, collateral.code];
				break;
			case 'GOLD':
				res = [collateral.ware, collateral.rtial, collateral.ligMass];
				break;
			case 'AUTO':
				res = [collateral.mark, collateral.model, collateral.vinCode, collateral.govNumber];
				break;
		}
		text = res.join(' / ');
	}

	return Ext.String.format('<a href="#{0}">#{1}</a> - {2}', getHashByObjType('COLLATERAL', collateral.id), collateral.id, text);
}

function collateralProtocolRenderer(id) {
	return dynamicRenderer('COLLATERAL_PROTOCOL', id, function (protocol) {
		return Ext.String.format('<a href="#{0}">{1}</a>', getHashByObjType('COLLATERAL_PROTOCOL', protocol.id), protocol.number);
	});
}

function countryRenderer(code) {
	return dynamicRenderer('COUNTRY', code, '{countryName}');
}

function collateralBuySellStatusRender(status) {
	const statusText = _(status);
	switch (status) {
		case 'DELETED':
			return labelRenderer(statusText, 'bg-red');
		case 'FOR_SALE':
			return labelRenderer(statusText, 'bg-lime');
		case 'GUARANTEE_PERIOD':
			return labelRenderer(statusText, 'bg-orange');
		case 'SOLD':
			return labelRenderer(statusText, 'bg-green');
		default:
			return statusText;
	}
}

function labelRenderer(text, colorClass) {
	return '<span class="label ' + colorClass + '">' + text + '</span>';
}

//---------- END OF RENDERERS ----------

let loggingout = false;
window.le = window.le || {
	// print: function (event) {
	// 	let printerWin = Ext.create('LE.view.agreements.print.Main');
	// 	printerWin.setEvent(event);
	// 	return printerWin;
	// }
};

le.lang = localStorage.LELang || 'GE';
le.defaultCurrency = 'GEL';
window.onresize = reLayoutWindows;

let objTypeToHashMapping = {
	CUSTOMER: 'clients',
	LOAN: 'loans',
	DEPOSIT: 'deposits',
	AGREEMENT: 'agreements',
	EXCHANGE: 'exchange/operations',
	MONEY_TRANSFER: 'money-transfers',
	LOAN_APPLICATION: 'applications',
	CASHIER: 'cashier/operation',
	EVENT: 'events',
	GENERAL_AGREEMENT: 'general-agreements',
	COLLATERAL: 'collaterals',
	COVENANT: 'covenants',
	FINANCIAL_ANALYSIS: 'financial-analysis',
	COLLATERAL_PROTOCOL: 'collaterals/buy-sell/protocols',
	EMPLOYEE: 'hr-module/employees'
};

function getHashByObjType(objType, objId) {
	return objTypeToHashMapping[objType] + "/" + objId;
}

let geo2engMap = new Map([
	['ა', 'a'],
	['ბ', 'b'],
	['გ', 'g'],
	['დ', 'd'],
	['ე', 'e'],
	['ვ', 'v'],
	['ზ', 'z'],
	['თ', 't'],
	['ი', 'i'],
	['კ', 'k'],
	['ლ', 'l'],
	['მ', 'm'],
	['ნ', 'n'],
	['ო', 'o'],
	['პ', 'p'],
	['ჟ', 'zh'],
	['რ', 'r'],
	['ს', 's'],
	['ტ', 't'],
	['უ', 'u'],
	['ფ', 'f'],
	['ქ', 'q'],
	['ღ', 'gh'],
	['ყ', 'k'],
	['შ', 'sh'],
	['ჩ', 'ch'],
	['ც', 'ts'],
	['ძ', 'dz'],
	['წ', 'ts'],
	['ჭ', 'ch'],
	['ხ', 'kh'],
	['ჯ', 'j'],
	['ჰ', 'h']
]);

function log() {
	console.log.apply(console, arguments);
}


function _(txt) {
	arguments[0] = le.translations && le.translations[txt] || txt;
	if (txt === arguments[0] && false) {
		console.warn(txt, 'not translated');
	}
	return Ext.String.format.apply(this, arguments);
}

function translate(str) {
	let newStr = "";
	for (let i in str) {
		newStr += geo2engMap.has(str[i]) ? geo2engMap.get(str[i]) : str[i];
	}
	return newStr;
}

function translateName(str) {
	let newStr = "";
	for (let i in str) {
		newStr += geo2engMap.has(str[i]) ? geo2engMap.get(str[i]) : str[i];
	}
	return toTitleCase(newStr);
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function getExceptionMessage(s) {
	let r = /<p><b>message<\/b>.*?: (.*?)<\/p>/i;
	let match = s.match(r);
	return match ? match[1] : '';
}

function collapseMainMenu() {
	let menu = le.menu.down('treelist'),
			//mainLogoContainer = le.header.getReferences()['mainLogoContainer'],
			isMicro = menu.getMicro(),
			width = 44;
	//ref.mainLogoContainer.setWidth(width);
	setTimeout(function () {
		menu.setMicro(true);
	}, 600);
	//mainLogoContainer.animate({dynamic: true, to: {width: width}});
	le.menu.animate({dynamic: true, to: {width: width}});
	menu.width = width;
	//mainLogoContainer.updateLayout({isRoot: true});
	// TODO afterlayoutanimation event არ მუშაობს
	//ip.menu.on({
	//	afterlayoutanimation: function () {
	//		menu.setMicro(true);
	//	}, single: true
	//});
}

function expandMainMenu() {
	let menu = le.menu.down('treelist'),
			//mainLogoContainer = le.header.getReferences()['mainLogoContainer'],
			isMicro = menu.getMicro(),
			width = 260;
	//ref.mainLogoContainer.setWidth(width);
	menu.setMicro(false);
	//mainLogoContainer.animate({dynamic: true, to: {width: width}});
	le.menu.animate({dynamic: true, to: {width: width}});
	menu.width = width;
	//mainLogoContainer.updateLayout({isRoot: true});
}

function toggleMainMenu(expand) {
	if (!le.menu) return;
	if (expand === true) {
		expandMainMenu();
	} else if (expand === false) {
		collapseMainMenu();
	} else {
		let menu = le.menu.down('treelist');
		if (menu.getMicro()) {
			expandMainMenu();
		} else {
			collapseMainMenu();
		}
	}
}

function reLayoutWindows() {
	clearTimeout(window.relayoutWindowsT);
	window.relayoutWindowsT = setTimeout(function () {
		let width = Ext.getBody().getViewSize().width;
		toggleMainMenu(width > 1200);
		Ext.WindowManager.each(function (win) {
			if (win instanceof Ext.window.Window && Ext.isFunction(win.updateLayout)) {
				win.updateLayout();
				win.center();
			}
		});
	}, 300);
}

function logout() {
	le.tabPanel.setLoading(true);
	loggingout = true;
	clearCachedTabs();
	Ext.Ajax.request({
		url: 'logout',
		method: 'GET',
		callback: function () {
			location.reload();
		}
	})
}

function clearCachedTabs() {
	localStorage.LoanExpertTabs = "{}";
}

function doGet(options) {
	return request(Ext.merge({
		method: 'GET'
	}, options));
}

function doPost(options) {
	return request(Ext.merge({
		method: 'POST'
	}, options));
}

function doPut(options) {
	return request(Ext.merge({
		method: 'PUT'
	}, options));
}

function doPatch(options) {
	return request(Ext.merge({
		method: 'PATCH'
	}, options));
}

function doDelete(options) {
	return request(Ext.merge({
		method: 'DELETE'
	}, options));
}

function request(options) {
	if (!options.url)
		return;

	options.method = options.method || 'POST';
	emptyString2Null(options.jsonData);
	// if (options.pathParams) {
	// 	options.url = buildURL(options.url, options.pathParams);
	// }

	const callbackFn = options.callback;
	const successFn = options.success;
	const failureFn = options.failure;
	//not using this callbacks because of we need first to execute callback and then success or failure.
	//but we must init them otherwise response works incorrectly
	options.success = Ext.emptyFn;
	options.failure = Ext.emptyFn;

	return new Ext.Promise(function (resolve, reject) {
		options.callback = function (opts, success, response) {
			let res = decodeResponse(response);
			processResponse(callbackFn, res, response, success);
			if (success) {
				processResponse(successFn, res, response, true);
				resolve(res);
			} else {
				processResponse(failureFn, res, response, false);
				reject(res);
			}
		};
		Ext.Ajax.request(options);
	});
}

function decodeResponse(response) {
	let res;
	try {
		res = response.responseText.replace(/\n/g, '');
		if (res) {
			res = Ext.decode(res);
		}
	} catch (e) {
	}
	return res || response.responseText;
}

function processResponse(fn, res, response, success) {
	if (Ext.isFunction(fn)) {
		fn.call(null, res, response, success);
	}
}

function emptyString2Null(obj) {
	let i, j;
	for (i in obj) {
		if (obj[i] === null || obj[i] === "" || obj[i] === undefined) {
			delete obj[i];
		} else if (obj[i].constructor === ({}).constructor) {
			emptyString2Null(obj[i]);
		} else if (obj[i].constructor === ([]).constructor) {
			for (j in obj[i]) {
				emptyString2Null(obj[i][j]);
			}
		}
	}
}

function buildURL(url, params) {
	for (let i in params) {
		url = url.replace(new RegExp('{' + i + '}', 'g'), params[i]);
	}
	return url.replace('//', '/');
}

function getDataFromStore(store, exclude, includeRemoved = true, includeFiltered = false) {
	let range = includeFiltered ? store.getData().getSource().getRange() : store.getRange();
	let data = getDataFromRecords(range, exclude);

	Ext.each(data, function (item) {
		item.id = item.id < 0 ? null : item.id;
	});

	if (includeRemoved) {
		let removed = getDataFromRecords(store.getRemovedRecords(), exclude);
		for (let i in removed) {
			removed[i].active = false;
			data.push(removed[i]);
		}
	}
	return data;
}

function getDataFromRecords(records, exclude) {
	let arr = [];
	for (let i in records) {
		arr.push(getDataFromRecord(records[i], exclude));
	}
	return arr;
}

function getDataFromRecord(record, exclude) {
	exclude = exclude || [];
	let data = Ext.clone(record.getData());
	if (record.phantom) {
		data[record.idProperty] = null;
	}
	Ext.each(exclude, function (ex) {
		delete data[ex];
	});
	return data;
}

function getRawDataFromStore(store, exclude) {
	let data = getDataFromStore(store, exclude);
	for (let i in data) {
		for (let j in data[i]) {
			if (data[i][j] instanceof Date) {
				data[i][j] = dateRenderer()(data[i][j]);
			}
		}
	}
	return data;
}

function dateStrToDate(dateString, format) {
	return dateString ? Ext.Date.parse(dateString, format ? format : Ext.Date.defaultFormat) : '';
}

function openCustomerProfile(customerId) {
	let le = window.le || {};
	let tabId = 'tab-customer-' + customerId;
	let tab = le.tabPanel.queryById(tabId);
	if (!tab) {
		tab = Ext.create('LE.view.clients.profile.ProfileTab', {
			customerId: customerId,
			id: tabId
		});
		le.tabPanel.add(tab);
	}
	le.tabPanel.setActiveTab(tab);
}


function openTechnicProfile(technicId) {
	let le = window.le || {};
	let tabId = 'tab-technic-' + technicId;
	let tab = le.tabPanel.queryById(tabId);
	if (!tab) {
		tab = Ext.create('LE.view.collateral.profile.technic.Tab', {
			id: tabId,
			technicId: technicId,
		});
		le.tabPanel.add(tab);
	}
	le.tabPanel.setActive(tab);
}

le.namesMap = {
	'TEXT': _('ტექსტი'),
	'MONEY': _('თანხა'),
	'NUMBER': _('რიცხვი'),
	'DATE': _('თარიღი'),
	'LIST': _('სია'),
	'UNKNOWN': _('უცნობი'),
	'MALE': _('მამრ.'),
	'FEMALE': _('მდედრ.'),
	'CANCELLED': _('გაუქმებული'),
	'UNCONFIRMED': _('დასადასტურებელი'),
	'ACTIVE': _('აქტიური'),
	'PERMISSION': _('უფლება'),
	'ROLE': _('როლი'),
	'YES': _('კი'),
	'NO': _('არა'),
	'NA': _('უცნობია'),
	'BLANK': _('საბლანკო'),
	'TECHNIC': _('ტექნიკა'),
	'GOLD': _('ძვირფასეულობა'),
	'HYPOTHEC': _('იპოთეკა'),
	'AUTO': _('ავტო'),
	'UNCHECKED': _('შეუმოწმებელი'),
	'MATCHED': _('დამთხვეული'),
	'UNMATCHED': _('უარყოფილი')
};


le.currencyMap = {
	'GEL': '₾'
};

function getLocalIPs(callback) {
	let ips = [];

	let RTCPeerConnection = window.RTCPeerConnection ||
			window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

	let pc = new RTCPeerConnection({
		// Don't specify any stun/turn servers, otherwise you will
		// also find your public IP addresses.
		iceServers: []
	});
	// Add a media line, this is needed to activate candidate gathering.
	pc.createDataChannel('');

	// onicecandidate is triggered whenever a candidate has been found.
	pc.onicecandidate = function (e) {
		if (!e.candidate) { // Candidate gathering completed.
			pc.close();
			callback(ips);
			return;
		}
		let ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
		if (ips.indexOf(ip) === -1) // avoid duplicate entries (tcp/udp)
			ips.push(ip);
	};
	pc.createOffer(function (sdp) {
		pc.setLocalDescription(sdp);
	}, function onerror() {
	});
}

function getTranslations() {
	let translations = Ext.decode(localStorage.LETranslations) || {};
	if (translations.version !== le.userInfo.translationsVersion) {
		translations = {
			version: le.userInfo.translationsVersion
		};
	}
	return translations;
}

function initTranslations() {
	let trans = getTranslations();
	return new Promise(res => {
		if (!trans[le.lang]) {
			doGet({
				url: 'translations',
				params: {
					language: le.lang
				},
				success: function (translations) {
					trans[le.lang] = {};
					for (let i in translations) {
						let text = translations[i].label.text.trim();
						trans[le.lang][text] = translations[i].value;
					}

					localStorage.LETranslations = Ext.encode(trans);
					le.translations = trans[le.lang];
					res();
				}
			});
		} else {
			le.translations = trans[le.lang];
			res();
		}
	});
}

//
// function initTranslations(callback) {
// 	let trans = getTranslations();
// 	if (!trans[le.lang]) {
// 		request({
// 			url: 'translations',
// 			method: 'GET',
// 			params: {
// 				language: le.lang
// 			},
// 			success: function (translations) {
// 				trans[le.lang] = {};
// 				for (let i in translations) {
// 					let text = translations[i].label.text.trim();
// 					trans[le.lang][text] = translations[i].value;
// 				}
//
// 				localStorage.LETranslations = Ext.encode(trans);
// 				if (typeof callback === 'function')
// 					callback(trans[le.lang]);
// 			}
// 		});
// 	} else {
// 		if (typeof callback === 'function')
// 			callback(trans[le.lang]);
// 	}
// }

function monitorEvents(obj) {
	Ext.util.Observable.capture(obj, function (evname, args) {
		log(evname, [args]);
	});
}

function query() {
	let res = Ext.ComponentQuery.query.apply(Ext.ComponentQuery, arguments);
	return res.length === 1 ? res[0] : res;
}


function flatObject(object, path, rootObject) {
	rootObject = rootObject || Ext.clone(object);
	for (let i in object) {
		let p = path ? path + "." + i : i;
		if (Ext.isObject(object[i])) {
			flatObject(object[i], p, rootObject);
		} else if (p) {
			rootObject[p] = object[i];
		}
	}
	return rootObject;
}

function deepChange(obj, paths, newVal) {
	let fName = paths.shift();
	obj[fName] = obj[fName] || {};
	if (paths.length === 0) {
		return obj[fName] = newVal;
	}
	return deepChange(obj[fName], paths, newVal);
}

function pxToPt(px) {
	return px * 3 / 4;
}

function ptToPx(pt) {
	return pt * 4 / 3;
}

function getFullTextRegex(text, wordBeginRegex) {
	if (!text) {
		return null;
	}

	wordBeginRegex = wordBeginRegex || '(?:^|\\s)';
	text = text.trim().split(/\s+/);
	let regs = [];
	Ext.each(text, function (t) {
		regs.push('(' + wordBeginRegex + Ext.String.escapeRegex(t) + ')+?');
	});
	return new RegExp(regs.join('(.*)'), 'gi');
}

function highlight(text, regexp) {
	return text.replace(regexp, function () {
		let res = '';
		for (let i = 1; i < arguments.length - 2; i++) {
			if (i % 2) {
				if (arguments[i][0].match(/\s/)) {
					res += ' ';
				}
				res += '<mark>' + arguments[i].trim() + '</mark>';
			} else {
				res += arguments[i];
			}
		}
		return res;
	});
}

function hasPermission(permission) {
	return le.user.permissions.indexOf(permission) > -1;
}

function toast(title, message) {
	if (message === undefined) {
		message = title;
		title = null;
	}
	Ext.toast({
		title: title,
		html: message,
		minWidth: 500,
		align: 'tr',
		closable: true,
		style: 'box-shadow: 1px 1px 20px 1px #333'
	});
}

function setLoading(panel, loading) {
	panel && panel.setLoading(loading);
}

function startLoading(panel) {
	panel && panel.setLoading(true);
}

function stopLoading(panel) {
	panel && panel.setLoading(false);
}

// todo დასახვეწია
function SockClient(url) {
	let me = this;
	let _onConnect = [];
	let _onDisconnect = [];
	me.retries = 0;
	me.maxRetries = 10;
	me.onConnect = function (fn) {
		if (typeof fn === "function")
			_onConnect.push(fn);
	};
	me.onDisconnect = function (fn) {
		if (typeof fn === "function")
			_onDisconnect.push(fn);
	};
	me.connect = function (connectionOptions) {
		me.connectionOptions = connectionOptions;
		let socket = new SockJS(url);
		me.stompClient = Stomp.over(socket);
		if (!le.debug && localStorage.LoanExpertStompDebug !== 'true') {
			me.stompClient.debug = false;
		}
		me.stompClient.connect({}, function () {
			for (let i in _onConnect) {
				_onConnect[i].apply(me, arguments);
			}
		}, function () {
			if (me.reconnectInterval) return;
			for (let i in _onDisconnect) {
				_onDisconnect[i].apply(me, arguments);
			}
			me.reconnectInterval = setInterval(function () {
				if (me.connected() || me.retries >= me.maxRetries) {
					clearInterval(me.reconnectInterval);
					delete me.reconnectInterval;
					me.retries = 0;
					log(me.connected() ? 'reconnected' : 'stop trying');
					return;
				}
				log('reconnecting...');
				me.retries++;
				me.connect();
			}, 20000)
		});
		// socket.onclose = function () {
		// 	me.disconnect();
		// };
		return me;
	};
	me.disconnect = function () {
		if (me.stompClient) {
			me.stompClient.disconnect();
			for (let i in _onConnect) {
				_onDisconnect[i].apply(me, arguments);
			}
			delete me.stompClient;
		}
	};
	me.connected = function () {
		return me.stompClient && !!me.stompClient.connected;
	};
	me.subscribe = function (path, fn) {
		if (!me.connected()) {
			let subscriber = {};
			me.onConnect(function () {
				let s = me.subscribe(path, fn);
				subscriber.id = s.id;
				subscriber.unsubscribe = s.unsubscribe
			});
			// console.warn("client not connected");
			return subscriber;
		}
		return me.stompClient.subscribe(path, fn);
	};
}

function copyTextToClipboard(text) {
	let el = document.createElement('textarea');
	el.value = text;
	let success = false;
	try {
		document.body.appendChild(el);
		el.value = text;
		el.select();
		document.execCommand('copy');
		success = true;
	} catch (err) {
	} finally {
		document.body.removeChild(el);
	}
	return success;
}

function initSockClient() {
	le.messageClient = new SockClient('message');
	le.messageClient.onConnect(function () {
		le.mainViewModel.set('socketConnected', true);
		le.viewport.getController().onMessageClientConnect(this);
	});
	le.messageClient.onDisconnect(function () {
		le.mainViewModel.set('socketConnected', false);
	});
	le.messageClient.connect();
}

// function base64ToArrayBuffer(base64) {
// 	let binaryString = window.atob(base64);
// 	let binaryLen = binaryString.length;
// 	let bytes = new Uint8Array(binaryLen);
// 	for (let i = 0; i < binaryLen; i++) {
// 		let ascii = binaryString.charCodeAt(i);
// 		bytes[i] = ascii;
// 	}
// 	return bytes;
// }

function dayCloseLoading() {
	window.dayCloseTimer = window.dayCloseTimer || localStorage.LoanExpertDayCloseTimer || 1;
	window.dayCloseTimer = Number(window.dayCloseTimer);
	le.viewport.setLoading(_('მიმდინარეობს დღის დახურვა') + '... ' + timeRenderer(window.dayCloseTimer++));
	localStorage.LoanExpertDayCloseTimer = window.dayCloseTimer;
}

function htmlToText(html) {
	return html ? html.replace(/<\/?[^>]+(>|$)/g, '').replace('&nbsp;', ' ') : '';
}

function getDPI() {
	let dpiCheckDiv = document.createElement('div');
	dpiCheckDiv.style.width = '1in';
	dpiCheckDiv.style.height = '1in';
	dpiCheckDiv.style.position = 'absolute';
	dpiCheckDiv.style.left = '-100%';
	dpiCheckDiv.style.top = '-100%';
	document.body.appendChild(dpiCheckDiv);
	let dpi = dpiCheckDiv.offsetHeight;
	document.body.removeChild(dpiCheckDiv);
	return dpi;
}

function mm2px(mm, dpi) {
	return Math.round(dpi * mm / 25.4);
}

function px2mm(px, dpi) {
	return Math.round(px * 25.4 / dpi);
}

function coalesce() {
	let args = arguments;

	for (let i in args) {
		if (args[i] !== undefined && args[i] !== null && args[i] !== "")
			return args[i];
	}
	return null;
}

function sleep(milliseconds) {
	let start = new Date().getTime();
	for (let i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

function showBirthdayAlert() {
	if (le.userInfo.hasBirthday) {
		if (localStorage.LoanExpertBirthdayAlertShown !== 'true') {
			Ext.Msg.alert('', '<i style="font-size: 20px" class="fa fa-birthday-cake"></i> '
					+ le.user.firstName + ', კომპანია სოფტგენი გილოცავთ დაბადების დღეს!');
			localStorage.LoanExpertBirthdayAlertShown = 'true';
		}
	} else {
		localStorage.LoanExpertBirthdayAlertShown = 'false';
	}
}

function round(value, precision) {
	let result = Number(value),
			adjust = 0.5;

	if (typeof precision === 'number') {
		precision = Math.pow(10, precision);
		adjust = adjust / precision;
		result = Math.floor((value + adjust) * precision) / precision;
	}
	return result;
}

function printGlDocument(documentId, animateTarget) {
	Ext.create('Ext.Window', {
		xtype: 'window',
		width: '80%',
		height: '80%',
		modal: true,
		autoShow: true,
		animateTarget: animateTarget,
		layout: 'fit',
		title: _('ბუღალტრული გატარება'),
		iconCls: 'fas fa-file-pdf',
		items: {
			xtype: 'component',
			autoEl: {
				tag: 'iframe',
				src: 'accounting/gl-documents/' + documentId + '/print'
			}
		}
	}).show();
}

function tryAfterRender(scope, view, fn) {
	if (!view.rendered) {
		let event = view.on('afterrender', function () {
			view.un('afterrender', event);
			fn.call(scope);
		});
		return true;
	}
	return false;
}

function downloadWithPost(url, dataObj) {
	let form = document.createElement('form');
	form.style.display = 'none';
	form.target = '_blank';
	form.method = 'POST';
	form.action = url;

	for (let key in dataObj) {
		let input = document.createElement('input');
		input.type = 'hidden';
		input.name = key;
		input.value = dataObj[key];
		form.appendChild(input);
	}

	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

le.renderers = le.renderers || {};
le.renderers.tipRenderer = function (value, metadata) {
	if (!value) {
		return value;
	}
	metadata.tdAttr = 'data-qtip="' + value.replaceAll('"', "'") + '"';
	return value;
};

function loadCreditinfoErrorCodes() {
	return new Promise((res, rej) => {
		le.creditinfo = le.creditinfo || {};
		if (le.creditinfo.ERROR_CODES) {
			res(le.creditinfo.ERROR_CODES);
		} else {
			doGet({
				url: 'loans/creditinfo/error-codes',
				success: function (errorCodes) {
					le.creditinfo.ERROR_CODES = errorCodes;
					res(le.creditinfo.ERROR_CODES);
				},
				failure: function () {
					rej();
				}
			});
		}
	});
}