initApp();

var app;
function initApp() {
	app = new PIXI.Application({
			width: innerWidth,
			height: innerHeight,
			transparent: true
		});
	document.body.appendChild(app.view);
	PIXI.loader

	.add("/img/carriage.png")

	.add("/img/dog.png")
	.add("/img/scroll.png")

	.add("/img/santa/landing.png")
	.add("/img/santa/idle.png");

	for (var i = 1; i <= 11; i++)
		PIXI.loader.add("/img/santa/run" + i + ".png");

	for (var i = 1; i <= 3; i++)
		PIXI.loader.add("/img/gift/gift" + i + ".png");

	for (var i = 1; i <= 5; i++)
		PIXI.loader.add("/img/snow/snow" + i + ".png");

	SCROLL_TEXT = b64ToUTF8(document.location.href.split('<1>')[1].split('</1>')[0]);

	var copyright = new PIXI.Text('© [CYBOR] 2018', {
			fill: 0x00FF00,
			fontSize: 14
		});
	copyright.interactive = true;
	copyright.on('click', function () {
		window.location.href = 'https://github.com/muhametshin1997/Card2018';
	});
	copyright.on('touchend', function (e) {
		window.location.href = 'https://github.com/muhametshin1997/Card2018';
	});
	copyright.y = app.renderer.height - copyright.height * 2;
	copyright.x = app.renderer.width - copyright.width - copyright.height;
	app.stage.addChild(copyright);

	PIXI.loader.load(function () {
		app.ticker.add(gameLoop)
	});

}

var sceneId = 0;
var timeline = 0, anchorTime = 0;
var snowTime;

function gameLoop(delta) {
	if (sceneId != -1) {
		snowTime = Date.now() % 10 === 0;
		if (snowTime) {
			var sectorWidth = app.renderer.width / 10;
			for (var sectorI = 0; sectorI < 10; sectorI++) {
				var random = Math.random();
				var snowflake = new PIXI.Sprite(getTexture("snow/snow" + (Math.floor(random * 5) + 1)));
				var size = Math.floor(random * 30);
				snowflake.width = snowflake.height = size;
				snowflake.x = sectorWidth * sectorI + random * sectorWidth;
				snowflake.isFallable = true;
				app.stage.addChild(snowflake);
				if (Math.floor(random * 100) % 5 === 0)
					break;
			}
		}

		if (scenes[sceneId](delta * 4))
			sceneId++;

		var fallenFallables = [];
		for (var i = 0; i < app.stage.children.length; i++)
			if (app.stage.children[i].isFallable) {
				var fallable = app.stage.children[i];
				if (fallable.y < app.renderer.height)
					fallable.y += delta * 5;
				else
					fallenFallables.push(fallable);
			}

		for (var i = 0; i < fallenFallables.length; i++)
			app.stage.removeChild(fallenFallables[i]);
	}
}

function dropAnchor() {
	anchorTime = 0;
	timeline = 1;
}

function getTexture(textureName) {
	return PIXI.loader.resources["/img/" + textureName + ".png"].texture;
}

function b64ToUTF8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}
