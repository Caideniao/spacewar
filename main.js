import enemy from './enemy.js'  
import ship from './ship.js'
import common from './common.js'

var app = new PIXI.Application({
    width: 300,         // default: 800
    height: 400,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,      // default: 1
    }
)   
    document.body.appendChild(app.view)
    
    let loader
    loader = new PIXI.loaders.Loader()
    loader.add('assets/image.json').load(setup)
   
let playerShip,state,speed,gameScene,bull,bullets,ships,background1,background2,ff,good,gameOverScene
function setup() {
    // console.log(PIXI.tweenManager.tweens.length)
    gameScene = new PIXI.Container()
    bullets = new PIXI.Container()
    ships = new PIXI.Container()
    good = new PIXI.Container()
    gameOverScene = new PIXI.Container()
    gameOverScene.visible = false
    app.stage.addChild(gameScene)
    app.stage.addChild(bullets)
    app.stage.addChild(ships)
    app.stage.addChild(good)
    app.stage.addChild(gameOverScene)
    background2 = createSprite('blue.png',0,-380,300,400,gameScene)
    background1 = createSprite('blue.png',0,0,300,400,gameScene)
   

    playerShip = createSprite('playerShip1.png',135,370,ship.width,ship.height,gameScene)
    playerShip.vx = 0
    playerShip.name = 'playerShip'
    playerShip.vy = 0
    speed = 3
    loadBackground()
    state = play
    loadNormal(0,'normal')
    loadShip(12,PIXI.tween.Easing.outSine(),20,-20,380,450,'bad1')
    loadShip(12,PIXI.tween.Easing.outSine(),280,-20,-100,450,'bad1')   
    loadNormal(18,'rock') 
    loadNormal(20,'bad2')
    loadShip(25,PIXI.tween.Easing.inBounce(),280,-20,-100,450,'bad1') 
    loadShip(28,PIXI.tween.Easing.inBounce(),-20,-20,350,450,'bad1') 
    loadNormal(30,'bad3')
    loadNormal(35,'rock2')
    loadShip(40,PIXI.tween.Easing.outBounce(),-20,-20,350,450,'bad2') 
    loadShip(44,PIXI.tween.Easing.outBounce(),280,-20,-100,450,'bad2')
    loadNormal(46,'rock2') 
    
    ff = shipFire(playerShip)
    common.keyPress(playerShip,speed)
    app.ticker.add(gameLoop) 
}

function gameOver () {
    let style = new PIXI.TextStyle({
        fontFamily: "Futura",
        fontSize: 16,
        fill: "white"
      })
    let message = new PIXI.Text("The End~ \n作者：女巫 \n点击重来",style)
    message.x = 100
    message.y = 100
    message.interactive = true
    app.ticker.remove(gameLoop)
    //多个计时器，飞船速度叠加，可以试试多次load（setup）查看效果
    let t = PIXI.tweenManager.tweens
    let l = t.length
    for (let i = 0; i < l; i++) {
        t[i].remove() 
    }  
    //这里update不行 
    message.mousedown = function () {
        gameOverScene.removeChild(message) 
        PIXI.tweenManager.update()
        //为什么要在这update呢？？？ 
        loader.load(setup)            
    }
    gameOverScene.addChild(message)
}
function createSprite(image,px,py,width,height,Container,count) {
    let sprite = new PIXI.Sprite(
        loader.resources["assets/image.json"].textures[image]
      )
    sprite.x = px
    sprite.y = py
    sprite.width = width
    sprite.height = height
    sprite.count = count
    Container.addChild(sprite)
    return sprite
}
function gameLoop(delta) {
    state(delta)
}

function play() {
    if (playerShip.vx !==0 || playerShip.vy !== 0) {
        ff.destroy()
        gameScene.removeChild(ff)
        ff = shipFire(playerShip)
    }
    if (playerShip.strong) {
        fireTwo(playerShip)
        
    } else{
        fire(playerShip)
    }
    playerShip.x += playerShip.vx
    playerShip.y += playerShip.vy
    borderCheck()
    hitCheck()
    PIXI.tweenManager.update()
    common.contain(playerShip,{x:0,y:0,width:300,height:400})
}

function fire(craft) {  
    if (craft.fire ) {
        let x = craft.x + 15
        let y = craft.y - 1
        let bullet = createSprite('laserBlue.png',x,y,2,4,bullets)
        bullet.vy = -4
        bullets.addChild(bullet)
        craft.fire--
    }
}
function fireTwo (craft){
    if (craft.fire ) {
        let x = craft.x + 10
        let y = craft.y - 1
        let bullet1 = createSprite('laserGreen.png',x,y,3,5,bullets)
        let bullet2 = createSprite('laserGreen.png',x+10,y,3,5,bullets)
        bullet1.vy = -5
        bullet2.vy = -5
        bullets.addChild(bullet1)
        bullets.addChild(bullet2)
        craft.fire--
        playerShip.strong--
    }
}

function borderCheck() {
    bullets.children.forEach(function(bullet,index){
        if (bullet.y < 0) {
            bullets.removeChild(bullet)
        }})
    ships.children.forEach(function(e){
        if (e.y === 400) {
            ships.removeChild(e)
        }
        if (common.hitTestRectangle(playerShip,e)) {
            gameScene.removeChild(ff)
            state = end     
        }
    })  
}

function hitCheck() {
            bullets.children.forEach(function(bullet,index){ 
                ships.children.forEach(function(e){
                if (common.hitTestRectangle(bullet,e)) {
                    if (e.count < 1) {
                        e.width === 45 ? explosion(e,'playerShip3_damage',3) : explosion(e,'expl_02_00',23)
                        ships.removeChild(e)
                        bullets.removeChild(bullet)
                        if (random() < 80) {
                            loadGood('power',e)
                        }
                    } else {
                        e.count--
                        bullets.removeChild(bullet)     
                    }
                }
            })
            if (bullets.children[index]) {
                bullet.y +=bullet.vy                   
            }           
    })
    good.children.forEach(function(e){
        if (common.hitTestRectangle(e,playerShip)) {
            good.removeChild(e)
            playerShip.strong = 50
        } 
    }) 
}

function loadGood(key,craft) {
    let width = ship[key].width,
        height = ship[key].height,
        image = ship[key].image
    let s = createSprite(image,craft.x-10,craft.y+10,width,height,good,ship[key].count)
    let tween = PIXI.tweenManager.createTween(s)
    tween.from({x:craft.x-10, y:craft.y+10 }).to({x:random(),y:random() })
    tween.time = ship[key].last
    tween.delay = 0
    tween.repeat = 0;
    tween.expire = true
    tween.easing = PIXI.tween.Easing.inExpo()
    tween.on('end', function() {
        tween.remove()
    })
    tween.start()
    setTimeout(() =>{good.removeChild(s)},9000)    
}

function loadNormal (delay,key) {
    for (let i =0; i < enemy[key].amount; i++) {
        let tween = createShip(key)
        tween.from({ y:-20 }).to({y:400 })
        tween.time = enemy[key].last
        tween.delay = 1000*(delay + i)
        tween.repeat = 0;
        tween.expire = true
        tween.on('end', function() {
            tween.remove()
        })
        tween.start()
    }   
}
function loadShip (delay,easing,fromx,fromy,tox,toy,key) {
    for (let i =0; i < enemy[key].amount; i++) {
        let tween = createShip(key)
        tween.from({x:fromx, y:fromy }).to({x:tox, y:toy})
        tween.time = 5000;
        tween.delay = 1000*(delay + i)
        tween.repeat = 0;
        tween.easing = easing
        tween.expire = true
        tween.on('end', function() {
            tween.remove()
        })
        tween.start()
    }
}
function explosion(craft,name,index) {
    var explosionTextures = []
    let sprite
    for (let i = 1; i <= index; i++) {
        if (i < 10) {
            sprite = PIXI.Texture.fromFrame(name + 0 + i + '.png')
        }else {
            sprite = PIXI.Texture.fromFrame(name + i + '.png')
        } 
        explosionTextures.push({texture:sprite,time:50})
    }
    let explosion = new PIXI.extras.AnimatedSprite(explosionTextures)
    explosion.x = craft.x 
    explosion.y = craft.y
    explosion.scale.set(0.5)
    explosion.gotoAndPlay(1)
    gameScene.addChild(explosion)
    explosion.onLoop = function () {
        explosion.destroy()
        gameScene.removeChild(explosion)}
    return explosion    
}
function shipFire (craft){
    var explosionTextures = []
    let sprite
    for (let i = 1; i <= 15; i++) {
        if (i < 10) {
            sprite = PIXI.Texture.fromFrame('rocket_1_00' + 0 + i + '.png')
        }else {
            sprite = PIXI.Texture.fromFrame('rocket_1_00' + i + '.png')
        } 
        explosionTextures.push({texture:sprite,time:50})
    }
    var explosion = new PIXI.extras.AnimatedSprite(explosionTextures)
    explosion.x = craft.x + 12
    explosion.y = craft.y + craft.height
    explosion.scale.set(0.6)
    explosion.gotoAndPlay(1)
    gameScene.addChild(explosion)
    return explosion
}

function createShip (key) {
    let width = enemy[key].width,
        height = enemy[key].height,
        image = enemy[key].image
    let x = random() 
    let s = createSprite(image,x,-60,width,height,ships,enemy[key].count)
    let tween = PIXI.tweenManager.createTween(s)
    return tween
}

function loadBackground () {
    let b = [background1,background2]
    for (let i = 0; i < 2; i++) {
        let tween = PIXI.tweenManager.createTween(b[i])
        i === 0 ? tween.from({ y:0 }).to({y:400 }) : tween.from({ y:-390 }).to({y:0 })
        tween.time = 8000
        tween.repeat = 10
        tween.expire = true
        tween.start()
    }
}

function end (){  
    PIXI.tweenManager.update()
    if (gameScene.getChildByName('playerShip')) {
        gameOverScene.visible = true
        let s = explosion(playerShip,'expl_02_00',23)
        gameScene.removeChild(playerShip)
        s.onLoop = function () {
        s.destroy()
        gameScene.removeChild(s)}
        gameOver()
    }
}
function random() {
    let s = Math.floor(Math.random() * 250)
    return s
}

