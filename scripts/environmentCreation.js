//custom shapes
joint.shapes.tm = {};

joint.shapes.tm.toolElement = joint.shapes.basic.Generic.extend({

	toolMarkup: [
		'<g class="element-tools">',
			'<g class="element-tool-remove"><circle fill="red" r="11"/>',
				'<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
				'<title>Remove</title>',
			'</g>',
		'</g>'
	].join(''),

	defaults: joint.util.deepSupplement({
		attrs: {
			text: { 'font-weight': 400, 'font-size': 'small', fill: 'black', 'text-anchor': 'middle', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle' },
		},
	}, joint.shapes.basic.Generic.prototype.defaults)

});

joint.shapes.tm.devElement = joint.shapes.tm.toolElement.extend({

	markup: [
		'<g class="rotatable">',
			'<g class="scalable">',
				'<rect class="b-border"/>',
			'</g>',
			'<image/>',
			'<rect class="b-magnet"/>',
		'</g>'
	].join(''),

	defaults: joint.util.deepSupplement({
		type: 'tm.devElement',
		size: { width: 70, height: 70 },
		attrs: {
			'rect.b-border': {fill: '#fff', stroke: '#ccc', 'stroke-width': 1, width: 70, height: 70, rx: 5, ry: 5},
			'rect.b-magnet': {fill: '#104eab', width: 10, height: 10, rx: 2, ry: 2, magnet: true, transform: 'translate(30,55)'},
			image: {'ref-x': 2, 'ref-y': 2, ref: 'rect', width: 66, height: 66},
		}
	}, joint.shapes.tm.toolElement.prototype.defaults)
});

//custom view
joint.shapes.tm.ToolElementView = joint.dia.ElementView.extend({
	initialize: function() {
		joint.dia.ElementView.prototype.initialize.apply(this, arguments);
	},
	render: function () {
		joint.dia.ElementView.prototype.render.apply(this, arguments);
		this.renderTools();
		this.update();
		return this;
	},
	renderTools: function () {
		var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');
		if (toolMarkup) {
			var nodes = V(toolMarkup);
			V(this.el).append(nodes);
		}
		return this;
	},
	pointerclick: function (evt, x, y) {
		this._dx = x;
		this._dy = y;
		this._action = '';
		var className = evt.target.parentNode.getAttribute('class');
		switch (className) {
			case 'element-tool-remove':
				$('.js-add-dev-element[data-type=' + this.model.attributes.devType + ']')
					.removeClass('b-devops-menu__li-link_active');
				this.model.remove();
				$('.js-devops-item-info-block').hide();
				return;
				break;
			case 'rotatable':
				console.log(this.model);
				if(devOpsElementsInfo[this.model.attributes.devTypeId]) {
					var itemInfo = devOpsElementsInfo[this.model.attributes.devTypeId];
					$('.js-devops-item-info-block').hide();
					if(itemInfo.type == 'form') {
						$(itemInfo.text).show();
					} else {
						var contentBlock = $('.js-clicked-item-content');
						var img= document.createElement('img');
						img.src= itemInfo.img;
						img.alt= itemInfo.title;
						console.log(img);
						contentBlock.find('.js-clicked-item-content__title').html(img).append('<br>' + itemInfo.title);
						contentBlock.find('.js-clicked-item-content__text').html(itemInfo.text);
						contentBlock.show();
					}
				}
				return;
				break;
			default:
		}
		joint.dia.CellView.prototype.pointerclick.apply(this, arguments);
	}
});
joint.shapes.tm.devElementView = joint.shapes.tm.ToolElementView;

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
	el: $('#js-environment-creation'),
	width: '100%',
	height: '100%',
	model: graph,
	gridSize: 1
});

/*paper.on('cell:pointerdown', 
	function(cellView, evt, x, y) { 
		console.log(cellView);
		console.log(graph.getCells());
	}
);*/

$('#js-build-devops').on('submit', function(){
	var allElements = graph.getCells();
	var connections = [];
	for(var i = 0; i < allElements.length; i++) {
		var currentElement = allElements[i];
		if(currentElement.attributes.type == 'link') {
			var source = graph.getCell(currentElement.attributes.source.id);
			var target = graph.getCell(currentElement.attributes.target.id);
			var connection = {};
			connection[source.attributes.devTypeId] = target.attributes.devTypeId;
			connections.push(connection);
		}
	}
	var buildObj = {};
	$('.js-build-field').each(function(){
		buildObj[$(this).attr('name')] = $(this).val();
	});
	buildObj.connections = connections;
	console.log(buildObj);
	return false;
});

var devElement = new joint.shapes.tm.devElement({
	position: { x: 100, y: 30 },
	size: { width: 70, height: 70 },
	attrs: {
		image: { 'xlink:href': 'plugins/cassandra/cassandra.png' },
	}
});
graph.addCell(devElement);		

$('.js-add-dev-element').on('click', function(){
	if(!$(this).hasClass('b-devops-menu__li-link_unactive') && !$(this).hasClass('b-devops-menu__li-link_active')) {
		var devElement = new joint.shapes.tm.devElement({
			position: { x: 100, y: 30 },
			size: { width: 70, height: 70 },
			devType: $(this).data('type'),
			devTypeId: $(this).data('id'),
			attrs: {
				image: { 'xlink:href': $(this).data('img') },
			}
		});
		graph.addCell(devElement);
		$(this).addClass('b-devops-menu__li-link_active');
	}
});

