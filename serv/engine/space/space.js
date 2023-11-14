const config = require("../../../config.js");
const nameGen = require("../generation/nameGen.js");
const { Player, SpaceZone, Planet, Op } = require(config.HELPERS + "/db.js");
const Maths = require(config.HELPERS + "/maths.js");
const { setItems } = require("../player/inventory.js");
const actions = require("./actions.js");
const Action = actions.Action;

class _Space {
    constructor(g) {
        this.g = g;
        this.space = {};
        this.pj_changes = {};
        this.players = {};
        this.items = {};
        this.buildings = {};
    }

    async config() {
        // Calculate the size of the space grid based on the number of saved spaces
        const c = Math.ceil(Math.sqrt(await SpaceZone.count() - config.SPACES.saved));

        // Initialize default spaces and player changes for default spaces
        this.space[-1 + "_" + -1] = {};
        this.pj_changes[-1 + "_" + -1] = {};
        this.space[-1 + "_" + 0] = {};
        this.pj_changes[-1 + "_" + 0] = {};
        this.space[0 + "_" + -1] = {};
        this.pj_changes[0 + "_" + -1] = {};

        // Initialize spaces and player changes for the dynamic space grid
        for (let x = 0; x < c; x++) {
            for (let y = 0; y < c; y++) {
                this.space[x + "_" + y] = {};
                this.pj_changes[x + "_" + y] = {};
            }
        }

        // Load items and set them in the inventory
        this.items = require("./items.js")();
        setItems(this.items);
        actions.setItems(this.items);

        // Load buildings
        this.buildings = require("./buildings.js")();
    }

    async addPlayer(player) {
        // Add a player to the space
        this.players[player.id] = player;
        let space_pos = player.space_pos;
        let space = space_pos.x + "_" + space_pos.y;

        // Function to handle space changes when a player moves to an edge
        const changeSpaces = async (data) => {
            // Check if the player is at the edge of the space grid
            if (data.x < 0 || data.x >= 1000 || data.y < 0 || data.y >= 1000) {
                // Function to polarize coordinates
                const polarize = (data) => {
                    let mx = (data.x < 0 ? 999 : (data.x >= 1000 ? 1 : data.x));
                    let my = (data.y < 0 ? 999 : (data.y >= 1000 ? 1 : data.y));
                    return { x: mx, y: my };
                };

                // Function to mirror coordinates
                const mirror = async (x) => {
                    const c = Math.floor(Math.sqrt((await SpaceZone.count()) - config.SPACES.saved));
                    return (x >= c ? 0 : (x < 0 ? c : x));
                }

                // Handle the case when the player is at the starting point (-1, -1)
                if (space_pos.x == -1 && space_pos.y == -1) {
                    const sp = await SpaceZone.findAll({
                        where: {
                            type: "sun"
                        }
                    });
                    let c = sp.length;
                    let found = false;

                    // Find a suitable sun space for colonization
                    while (found == false) {
                        const s = sp[Maths.Rand(0, c - config.SPACES.saved)];

                        if (!s) continue;
                        const planets = await Planet.findAll({
                            where: {
                                spacezone_id: s.id,
                                owner: null,
                            }
                        });

                        if (planets.length > 0) {
                            found = s;
                            break;
                        }
                    }

                    // Polarize the coordinates and change the player's space
                    const p = polarize(data);
                    player.inventory.addItem("cm1", 1, true);
                    player.inventory.addItem("tm3", 1, true);
                    player.shortcuts.addShortcut("cm1", 0);
                    player.shortcuts.addShortcut("tm3", 1);
                    await player.changeSpace(p, found, this.space);

                    return true;
                } else {
                    // Handle other cases when the player is at an edge
                    let mx = (data.x < 0 ? -1 : (data.x >= 1000 ? 1 : 0));
                    let my = (data.y < 0 ? -1 : (data.y >= 1000 ? 1 : 0));
                    let nx = await mirror(player.space_pos.x + mx);
                    let ny = await mirror(player.space_pos.y + my);
                    const sp = await SpaceZone.findOne({
                        where: {
                            x: nx,
                            y: ny
                        }
                    });
                    if (!sp) return false;
                    const p = polarize(data);
                    await player.changeSpace(p, sp, this.space);
                    return true;
                }
            }
        };

        // Set up player movement handling
        player.setEnableMove(() => {
            player.On("move", async (data) => {
                space_pos = player.space_pos;
                space = space_pos.x + "_" + space_pos.y;
                if (player.canMove && data.x && data.y) {
                    player.pos.x = data.x;
                    player.pos.y = data.y;
                    if ((await changeSpaces(data)) == true) return;
                    this.space[space][player.name].pos = data;
                    if (!this.pj_changes[space][player.name]) this.pj_changes[space][player.name] = { pos: { x: data.x, y: data.y } };
                    else this.pj_changes[space][player.name] = { pos: { x: data.x, y: data.y } };
                    if (data.a) {
                        player.a = data.a;
                        this.pj_changes[space][player.name].a = data.a;
                    }
                } else if (player.canMove && data.a) {
                    player.a = data.a;
                    this.pj_changes[space][player.name].a = data.a;
                }
            });
        });

        // Join the player to the space and enable movement
        await player.joinSpace(space_pos.x, space_pos.y, this.space);
        player.enableMove();
        player.nameChange(this.space);

        // Handle player shortcuts
        player.On("shortcut", async (data) => {
            const item = player.shortcuts.getShortcut(data);
            if (!item) return;
            const action = new Action(item);
            await action.executeItem(player, this.g);
        });

        // Handle player disconnection
        player.On("disconnect", async (data) => {
            player.leaveSpace(this.space);
            const p = await Player.findOne({ where: { user_id: player.id } });
            if (p) {
                await p.update({
                    pos: player.pos,
                    space_pos: player.space_pos
                });
            }
            space_pos = player.space_pos;
            space = space_pos.x + "_" + space_pos.y;
            delete this.players[player.id];
        });
    }

    Loop(fps) {
        // Function to check if an object is empty
        const isEmptyObject = (obj) => {
            return Object.values(obj).length === 0;
        }

        // Game Loop
        setInterval(() => {
            const pj_changes = { ...this.pj_changes };
            for (let m in pj_changes) {
                if (isEmptyObject(pj_changes[m])) continue;
                this.g.BroadcastToRoom(m, 'pj_changes', pj_changes[m]); // sending players pj_changes to area
                this.pj_changes[m] = {};
            }
            // this.pj_changes = {}; // restart the variable
        }, 1000 / fps || 30);
    }

    async ResourcesLoop(time) {
        // To be implemented
    }
}

module.exports = _Space;
