import config from '../config'

const MenuState = {
    preload: function() {
        const docElement = document.documentElement
        this.width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
        this.height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
        this.selected = 0
        this.gameplayOptions = ['Online Multiplayer', 'Local Multiplayer']
        // this.load.image('background');
        // this.canMove = true
        // this.moveCounter = 0
        // this.shadowX = 223
        // this.shadowY = 303
        // this.adventureCheck = false
    },

    create: function() {
        //Load Background and Title
        let highlighted;
        this.background = game.add.tileSprite(0, 0,  config.gameWidth, config.gameHeight, 'background')
        this.bar = game.add.graphics();
        this.bar.beginFill(0x000000, 0.7);
        this.bar.drawRect(0, 160, 960, 100);
        this.add.text(220, 160, 'Advance Wars', {font: '64pt Arial', fill: 'white', fontStyle: 'oblique', fontWeight: 'bold'})
        
        this.onlineSelect = game.add.text(this.game.world.centerX, this.game.world.centerY, 'Online Multiplayer', {font: '42pt Arial', fill: 'white', fontWeight: 'bold'})
        this.onlineSelect.anchor.set(.5);
        this.onlineSelect.inputEnabled = true;
        this.onlineSelect.events.onInputDown.add(selectOnline, this);
        this.onlineSelect.events.onInputOver.add(() => select(this.onlineSelect), this)
        this.onlineSelect.events.onInputOut.add(() => deSelect(this.onlineSelect), this);

        this.localSelect = game.add.text(this.game.world.centerX, this.game.world.centerY+80, 'Local Multiplayer', {font: '42pt Arial', fill: 'white', fontWeight: 'bold'})
        this.localSelect.anchor.set(.5);
        this.localSelect.inputEnabled = true;
        this.localSelect.events.onInputDown.add(selectLocal, this);
        this.localSelect.events.onInputOver.add(() => select(this.localSelect), this)
        this.localSelect.events.onInputOut.add(() => deSelect(this.localSelect), this);

    
        function selectOnline() {
            this.state.start('All_Lobbies')
        }

        function selectLocal() {
            this.state.start('Game');
        }
        const select = (item) => {
            item.alpha = 0.7
        }

        const deSelect = (item) => {
            item.alpha = 1.0
        }

        // arrow = game.add.sprite(168, 312, 'arrow')
        // arrow.enableBody = true

        // //Reset Scores
        // score = 0
        // score2 = 0

        // //reset map cycle
        // mapChoice = 0

        // //  Our controls.
        // this.cursors = this.game.input.keyboard.createCursorKeys()
        // this.enter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        // this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        // this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
        // this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        // this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        // this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)

        // //xbox 360 controller setup
        // game.input.gamepad.start()
        // pad1 = game.input.gamepad.pad1
        // console.log(game.input)

        // if (game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
        //     console.log('Controller is connected!');
        // } else {
        //     console.log('controller not connected :(')
        //     console.log('suported:', game.input.gamepad.supported, 'active:', game.input.gamepad.active, 'connected:', pad1.connected)
        // }
    },
    update: function(){
    //     // if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
    //     //     console.log(pad1)
    //     // }

    //     //Select Mode
    //     if (this.wKey.isDown || this.cursors.up.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1){
    //         if (this.canMove && this.selectArray[this.selected] !== 'DUEL'){
    //             arrow.position.y -= 75
    //             this.selected--
    //             shadow.destroy()
    //             this.shadowY -= 75
    //             shadow = game.add.text(this.shadowX, this.shadowY, this.selectArray[this.selected], {font: '42pt Impact', fill: '#AF1010'})
    //             this.canMove = false
    //         }
    //     }
    //     if (this.sKey.isDown || this.cursors.down.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1){
    //         if (this.canMove && this.selectArray[this.selected] !== 'HOW TO PLAY'){
    //             arrow.position.y += 75
    //             this.selected++
    //             shadow.destroy()
    //             this.shadowY += 75
    //             shadow = game.add.text(this.shadowX, this.shadowY, this.selectArray[this.selected], {font: '42pt Impact', fill: '#AF1010'})
    //             this.canMove = false
    //         }
    //     }

    //     if (!this.canMove){
    //         this.moveCounter++
    //     }

    //     if (this.moveCounter > inputDelay){
    //         this.canMove = true
    //         this.moveCounter = 0
    //     }

    //     //Start mode
    //     if (this.spaceBar.isDown || this.enter.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_A)){
    //         let selection = this.selectArray[this.selected]
    //         if (selection === 'DUEL'){
    //             this.state.start('DuelOptionState')
    //         } else if (selection === 'ADVENTURE' && !this.adventureCheck){
    //             game.add.text(500, 400, 'NO ADVENTURE MODE YET', {font: '14pt Ariel', fill: 'gray'})
    //             this.adventureCheck = true
    //         } else if (selection === 'HOW TO PLAY'){
    //             this.state.start('HowToPlayState')
    //         }
    //     }
    }
}


export default MenuState