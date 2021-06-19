import * as PIXI from "pixi.js";

import Player from "./components/PlayerClass";
import MapManager from "./MapManager";
import layers from "./layers";

import { collideProps } from "./utils/collision";

import { init as pointerInit } from "./controllers/pointer";
import { init as keyboardInit } from "./controllers/keyboard";
import GameStateService from "./services/GameStateService";
import NetworkService from "./services/NetworkService";
import Companion from "./components/CompanionClass";

const gameStateService = new GameStateService();

const PixiApp = new PIXI.Application({
	width: 48 * 22,
	height: 48 * 18,
	backgroundColor: 0xffffff,
});

pointerInit();
keyboardInit();

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const world = new PIXI.Container();

world.width = 48 * 22;
world.height = 48 * 18;

const networkService = new NetworkService("http://127.0.0.1:5000", gameStateService, "d1vshar", 150, 150);

const player1 = new Player("d1vshar", 0xff0000, 150, 150, gameStateService);

gameStateService.player = {
	id: networkService.id,
	nickname: "d1vshar",
	x: 150,
	y: 150
};

let solids = [];

const setup = () => {
	PixiApp.stage.addChild(world);

	let sheet = PIXI.Loader.shared.resources["assets/spritesheet.json"].spritesheet;

	const Map = new MapManager(22, 18, 48, sheet, layers);
	const sprites = Map.sprites;
	solids = Map.solids;
	sprites.forEach((sprite) => {
		world.addChild(sprite);
	});

	world.addChild(player1);

	Object.keys(gameStateService.companions).forEach(key => {
		const companion = gameStateService.companions[key];
		console.log(companion);
		world.addChild(new Companion(key,companion.nickname, 0x00ff00, companion.x, companion.y, gameStateService));
	});
};

PIXI.Loader.shared.add("assets/spritesheet.json").load(setup);

const printGameState = () => console.log('gamestate', gameStateService);
printGameState();
setInterval(printGameState, 2000);

// animation loop
const render = () => {
	requestAnimationFrame(render);
	collideProps(player1.avatar, solids);

	PixiApp.render(world);
};
render();

export default PixiApp;
