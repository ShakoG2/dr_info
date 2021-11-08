let Locator = draw2d.layout.locator;
let Basic = draw2d.shape.basic;
let blockColors = {
	highlightColor: '#fbc02d',
	blockLabelColor: '#000000',
	blockBackground: '#42a5f5',
	portLabelColor: '#000000',
	inPortBackground: '#42a5f5',
	okPortBackground: '#42a5f5',
	yesPortBackground: '#81c784',
	noPortBackground: '#f06292',
	connectionColor: '#1db7ce',
	yesConnectionColor: '#81c784',
	noConnectionColor: '#f48fb1'
};

let MyConnection = draw2d.Connection.extend({
	init: function (cfg, setter, getter) {
		let me = this;
		let decorator = new draw2d.decoration.connection.ArrowDecorator();
		decorator.setDimension(18, 10);

		cfg = cfg || {};
		cfg.stroke = cfg.stroke || 2;
		cfg.outlineStroke = cfg.outlineStroke || 0;
		cfg.color = cfg.color || blockColors.connectionColor;
		cfg.selectable = cfg.selectable || false;
		cfg.router = cfg.router || new draw2d.layout.connection.ManhattanBridgedConnectionRouter();
		cfg.targetDecorator = cfg.targetDecorator || decorator;
		me._super(cfg, setter, getter);
		me.on('contextmenu', function (conn, ev) {
			me.canvas.fireEvent('connectioncontextmenu', [conn, ev]);
		});
	},
	highlight: function () {
		this.setStroke(3);
		this.setColor(blockColors.highlightColor);
	}
});

let CustomLocator = Locator.Locator.extend({
	init: function (x, y) {
		this._super();
		this.xx = x;
		this.yy = y;
	},
	relocate: function (index, target) {
		if (this.xx === undefined) {
			let tbBox = target.getBoundingBox();
			target.setPosition(-tbBox.w / 2 + 0.5, -tbBox.h / 2 + 1);
		} else {
			target.setPosition(this.xx, this.yy);
		}
	}
});

function initLabels(node, text) {
	let label = new Basic.Text({
		text: text ? text : 'no title',
		padding: 0,
		margin: 0,
		align: 'center',
		fontColor: blockColors.blockLabelColor,
		fontSize: 11,
		stroke: 0,
		cssClass: 'pointer-events-none'
	});
	node.add(label, new Locator.CenterLocator());

	label.on('dblclick', function (l, ev) {
		node.fireEvent('dblclick', ev);
	});

	label.on('contextmenu', function (block, ev) {
		$.contextMenu({
			selector: 'body',
			items: {
				"red": {name: "Red"}
			}
		});
		setTimeout(function () {
			$.contextMenu('destroy');
		}, 100);
		node.fireEvent('contextmenu', ev);
	});

	node.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
	node.highlight = function () {
		this.setStroke(2);
		this.setColor(blockColors.highlightColor);
	};
	node.showError = function (msg) {
		this.add(new Basic.Label({
			text: msg,
			bgColor: '#ff1744',
			fontColor: '#ffffff',
			outlineColor: '#1565c0',
			color: '#1565c0'
		}), new Locator.LeftLocator());
		// let icon = new draw2d.shape.icon.Talkq({
		// 	width: 40,
		// 	height: 30
		// });
		// icon.setBackgroundColor(new draw2d.util.Color('#ac0013'));
		// this.add(icon, new Locator.XYRelPortLocator(100, -15));
	};
}

function createPort(parent, portLocator, value) {
	let portClass = draw2d.OutputPort, color;
	switch (value) {
		case 'IN':
			color = blockColors.inPortBackground;
			portClass = draw2d.InputPort;
			break;
		case 'NO':
			color = blockColors.noPortBackground;
			break;
		case 'YES':
			color = blockColors.yesPortBackground;
			break;
		case 'OK':
			color = blockColors.okPortBackground;
			break;
	}
	let port = new portClass({
		bgColor: color,
		color: color,
		stroke: 0,
		radius: 14
	});
	port.highlight = function () {
		port.setStroke(2);
		port.setColor(blockColors.highlightColor);
	};
	port.setValue(value);
	parent.ports = parent.ports || {};
	parent.ports[value] = port;

	let label = new Basic.Label({
		text: value,
		bold: true,
		padding: 0,
		margin: 0,
		width: 0,
		height: 0,
		fontColor: blockColors.portLabelColor,
		fontSize: 8,
		stroke: 0
	});
	port.add(label, new CustomLocator());
	parent.addPort(port, portLocator);

	if (value === 'IN') {
		port.setDraggable(false);
		port.on('connect', function (emitterPort, conn) {
			let sourcePort = conn.connection.sourcePort;
			let sourcePortValue = sourcePort.getValue();
			if (sourcePortValue === 'NO') {
				conn.connection.setColor(blockColors.noConnectionColor);
			} else if (sourcePortValue === 'YES') {
				conn.connection.setColor(blockColors.yesConnectionColor);
			}
			parent.fireEvent('connect', conn.connection);
		});
		port.onDragEnter = function () {
			label.setVisible(false);
		};
		port.onDragLeave = function () {
			label.setVisible(true);
		};
	} else {
		port.on('connect', function () {
			port.setDraggable(false);
		});
		port.on('disconnect', function () {
			port.setDraggable(true);
		});
		port.on('mouseenter', function () {
			if (port.isDraggable()) {
				port.isMouseOver = true;
				label.setVisible(false);
			}
		});
		port.on('dragstart', function () {
			label.setVisible(true);
		});
		port.on('dragend', function () {
			label.setVisible(!port.isMouseOver);
		});
		port.on('mouseleave', function () {
			port.isMouseOver = false;
			label.setVisible(true);
		});
	}
	return port;
}

let Blocks = function () {
	function initDefaultConfigs(cfg) {
		cfg = cfg || {};
		cfg.width = cfg.width || 160;
		cfg.height = cfg.height || 120;
		cfg.resizeable = cfg.resizeable || false;
		cfg.bgColor = cfg.bgColor || blockColors.blockBackground;
		cfg.stroke = cfg.stroke || 0;
		return cfg;
	}

	function initDefaults(node) {
		node.setDeleteable(false);
	}

	let me = this;
	me.START = Basic.Oval.extend({
		init: function (cfg, setter, getter) {
			let me = this;
			cfg = initDefaultConfigs(cfg);
			me._super(cfg, setter, getter);

			initDefaults(me);
			initLabels(me, cfg.label);
			createPort(me, new Locator.BottomLocator(), 'OK');
		}
	});

	me.END = Basic.Oval.extend({
		init: function (cfg, setter, getter) {
			let me = this;
			cfg = initDefaultConfigs(cfg);
			me._super(cfg, setter, getter);

			initDefaults(me);
			initLabels(me, cfg.label);
			createPort(me, new Locator.TopLocator(), 'IN');
		}
	});

	me.DECISION = Basic.Diamond.extend({
		init: function (cfg, setter, getter) {
			let me = this;
			cfg = cfg || {};
			cfg.width = cfg.width || 180;
			cfg.height = cfg.height || 140;
			cfg = initDefaultConfigs(cfg);
			me._super(cfg, setter, getter);

			initDefaults(me);
			initLabels(me, cfg.label);
			createPort(me, new Locator.BottomLocator(), 'YES');
			createPort(me, new Locator.RightLocator(), 'NO');
			createPort(me, new Locator.TopLocator(), 'IN');
		}
	});

	me.PROCESS = Basic.Rectangle.extend({
		init: function (cfg, setter, getter) {
			let me = this;
			cfg = cfg || {};
			cfg.bgColor = cfg.bgColor || blockColors.blockBackground;
			cfg.radius = cfg.radius || 10;
			cfg = initDefaultConfigs(cfg);
			me._super(cfg, setter, getter);

			initDefaults(me);
			initLabels(me, cfg.label);
			createPort(me, new Locator.TopLocator(), 'IN');
			createPort(me, new Locator.BottomLocator(), 'OK');
		}
	});

	me.UNKNOWN = Basic.Circle.extend({
		init: function (cfg, setter, getter) {
			let me = this;
			cfg = cfg || {};
			cfg.bgColor = '#ff4500';
			cfg.radius = cfg.radius || 60;
			cfg = initDefaultConfigs(cfg);
			me._super(cfg, setter, getter);

			initDefaults(me);
			initLabels(me, cfg.label || 'Unknown');
			createPort(me, new Locator.TopLocator(), 'IN');
			createPort(me, new Locator.LeftLocator(), 'YES');
			createPort(me, new Locator.RightLocator(), 'NO');
			createPort(me, new Locator.BottomLocator(), 'OK');
		}
	});
};