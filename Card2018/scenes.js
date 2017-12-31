var carriage, santa, gift, dog, greetingsScroll;
var santaText, scrollText;
var giftSize = 200;

var SCROLL_TEXT;

var scenes = [
	function (delta4) { //Starting
		if (!carriage) {
			carriage = new PIXI.Sprite(getTexture("carriage"));
			carriage.width /= 2;
			carriage.height /= 2;
			carriage.x = app.renderer.width;
			carriage.snowy = 5;
			carriage.interactive = true;
			carriage.on("click", function () {
				if (--carriage.snowy > 0) {
					var random = Math.random();
					var snowflake = new PIXI.Sprite(getTexture("snow/snow" + (Math.floor(random * 5) + 1)));
					var size = Math.floor(random * 50) + 20;
					snowflake.width = snowflake.height = size;
					snowflake.x = carriage.x;
					snowflake.isFallable = true;
					app.stage.addChild(snowflake);
				} else {
					var gift = new PIXI.Sprite(getTexture("gift/gift" + (Math.floor(Math.random() * 3) + 1)));
					var size = Math.floor(Math.random() * 30) + 30;
					gift.width = gift.height = size;
					gift.x = carriage.x;
					gift.isFallable = true;
					app.stage.addChild(gift);
					carriage.snowy = 3;
				}
			});
			app.stage.addChild(carriage);
		} else if (carriage.x > -carriage.width)
			carriage.x -= delta4;
		else
			sceneId++;
		timeline = anchorTime - Date.now();
	},

	function (delta4) { //Landing
		if (!santa) {
			santa = new PIXI.Sprite(getTexture("santa/landing"));
			santa.width /= 3;
			santa.height /= 3;
			santa.runMode = 1;

			var hohoho = new Audio('/sfx/hohoho.wav');
			hohoho.id = "hohoho";
			document.body.appendChild(hohoho);
			hohoho.play();

			app.stage.addChild(santa);
		} else if (santa.y < app.renderer.height - santa.height)
			santa.y += delta4;
		else if (santa.x < app.renderer.width / 4) {
			santa.x += delta4;
			if (++santa.runMode > 11)
				santa.runMode = 1;
			santa.texture = getTexture("santa/run" + santa.runMode);
		} else if (santa.runMode) {
			santa.texture = getTexture("santa/idle");
			santa.runMode = undefined;
		} else
			sceneId++;
	},

	function (delta4) {
		if (!gift) {
			gift = new PIXI.Sprite(getTexture("gift/gift1"));
			gift.width = gift.height = 10;
			gift.x = app.renderer.width / 2 - 5;
			gift.y = app.renderer.height / 2 - 5;
			gift.interactive = true;
			gift.on('click', function () {
				giftSize = 300;
			});
			gift.on('touchend', function (e) {
				giftSize = 300;
			});

			app.stage.addChild(gift);
		} else if (gift.width < giftSize - 3) {
			gift.width = gift.height = gift.width + 5;
			gift.x = app.renderer.width / 2 - gift.width / 2;
			gift.y = app.renderer.height / 2 - gift.height / 2;
		} else if (gift.height > giftSize + 3) {
			gift.width = gift.height = gift.width - 5;
			gift.x = app.renderer.width / 2 - gift.width / 2;
			gift.y = app.renderer.height / 2 - gift.height / 2;
		} else if (giftSize === 300) {
			sceneId++;
			app.stage.removeChild(gift);
		}
	},

	function (delta4) {
		if (!dog) {
			dog = new PIXI.Sprite(getTexture("dog"));
			var k = dog.width / 100;
			dog.width = 100;
			dog.height = dog.height / k;
			dog.x = app.renderer.width / 2 - dog.width / 2;
			dog.y = app.renderer.height / 2 - dog.height / 2;
			dog.interactive = true;
			dog.on('click', function () {
				document.getElementById('reactBark').play()
			});
			app.stage.addChild(dog);

			var greetingsBark = new Audio('/sfx/bark1.wav');
			greetingsBark.id = "greetingsBark";
			document.body.appendChild(greetingsBark);
			greetingsBark.play();

			var reactBark = new Audio('/sfx/bark2.wav');
			reactBark.id = "reactBark";
			document.body.appendChild(reactBark);
		} else if (dog.y < app.renderer.height - dog.height)
			dog.y += delta4;
		else if (dog.x < app.renderer.width - dog.width * 2 || santa.x > 0) {
			if (dog.x < app.renderer.width - dog.width * 2)
				dog.x += delta4;
			if (santa.x > 0)
				santa.x -= delta4;
		} else if (!greetingsScroll) {
			greetingsScroll = new PIXI.Sprite(getTexture("scroll"));
			var k = greetingsScroll.height / (app.renderer.height * 0.8);
			greetingsScroll.height = 0;
			greetingsScroll.width = greetingsScroll.width / k;
			greetingsScroll.x = app.renderer.width / 2 - greetingsScroll.width / 2;
			greetingsScroll.y = app.renderer.height / 2 - greetingsScroll.height / 2;
			app.stage.addChild(greetingsScroll);
		} else if (greetingsScroll.height < app.renderer.height * 0.9) {
			greetingsScroll.height += delta4;
			greetingsScroll.x = app.renderer.width / 2 - greetingsScroll.width / 2;
			greetingsScroll.y = app.renderer.height / 2 - greetingsScroll.height / 2;
		} else if (!scrollText) {
			scrollText = new PIXI.Text("", {
					fill: 0x0000FF,
					wordWrap: true,
					align: 'center',
					fontSize: 10
				});

			scrollText.x = app.renderer.width / 2 - scrollText.width / 2;
			scrollText.y = app.renderer.height / 2 - scrollText.height / 2;
			scrollText.width = greetingsScroll.width * 0.6;
			scrollText.height = greetingsScroll.height * 0.7;

			var typingSound = new Audio('/sfx/typing.mp3');
			typingSound.id = "typing";
			document.body.appendChild(typingSound);

			app.stage.addChild(scrollText);
		} else if (!typeText(scrollText, "", SCROLL_TEXT)) {
			scrollText.x = app.renderer.width / 2 - scrollText.width / 2;
			scrollText.y = app.renderer.height / 2 - scrollText.height / 2;
			document.getElementById('typing').play();
		} else if (!document.getElementById('music')) {
			var music = new Audio('http://ol4.mp3party.net/online/4903/4903146.mp3');
			music.id = "music";
			document.body.appendChild(music);
			music.play();
		}
	}
];

function typeText(textBlock, prevText, newText) {
	var currentText = textBlock.text == " " ? "" : textBlock.text;
	if (prevText != "" && prevText == currentText)
		currentText = "";
	if (currentText.length < newText.length)
		currentText += newText[currentText.length];
	textBlock.text = currentText;
	return currentText == newText;
}
