import config from '../config'

const MenuState = {
    preload: function() {
        const docElement = document.documentElement
        this.width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
        this.height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
    },

    create: function() {
        this.background = game.add.tileSprite(0, 0,  config.gameWidth, config.gameHeight, 'background')
        this.bar = game.add.graphics();
        this.bar.beginFill(0x000000, 0.7);
        this.bar.drawRect(0, 160, 960, 100);
        this.title = this.add.text(this.game.world.centerX, 210, 'Advance Wars', {font: '64pt Arial', fill: 'white', fontStyle: 'oblique', fontWeight: 'bold'})
        this.title.anchor.set(0.5)
        
        this.onlineSelect = game.add.text(this.game.world.centerX, this.game.world.centerY, 'Online Multiplayer', {font: '34pt Arial', fill: 'white', fontWeight: 'bold'})
        this.onlineSelect.anchor.set(.5);
        this.onlineSelect.inputEnabled = true;
        this.onlineSelect.events.onInputDown.add(() => selectOnline(), this);
        this.onlineSelect.events.onInputOver.add(() => select(this.onlineSelect), this)
        this.onlineSelect.events.onInputOut.add(() => deSelect(this.onlineSelect), this);

        this.localSelect = game.add.text(this.game.world.centerX, this.game.world.centerY+80, 'Local Multiplayer', {font: '34pt Arial', fill: 'white', fontWeight: 'bold'})
        this.localSelect.anchor.set(.5);
        this.localSelect.inputEnabled = true;
        this.localSelect.events.onInputDown.add(() => selectLocal(), this);
        this.localSelect.events.onInputOver.add(() => select(this.localSelect), this)
        this.localSelect.events.onInputOut.add(() => deSelect(this.localSelect), this);

        const selectOnline = () => this.state.start('All_Lobbies')
        const selectLocal = () => this.state.start('Game');
        const select = (item) => item.alpha = 0.6
        const deSelect = (item) => item.alpha = 1.0

    },
    update: function(){
    }
}


export default MenuState