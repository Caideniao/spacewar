let common = {
    keyboard: function (keyCode){
        let key = {}
        key.code = keyCode
        key.isDown = false
        key.isUp = true
        key.press = null
        key.release = null

        key.downHandler = event => {
          if (event.keyCode === key.code) {
            key.press()
            key.isDown = true
            key.isUp = false
          }
          event.preventDefault()
        }

        key.upHandler = event => {
          if (event.keyCode === key.code) {
            key.release()
            key.isDown = false
            key.isUp = true
          }
          event.preventDefault()
        }

        window.addEventListener(
          "keydown", key.downHandler.bind(key), false
        )
        window.addEventListener(
          "keyup", key.upHandler.bind(key), false
        )
        return key
      },
    keyPress: function (playerShip,speed,s) {
        let left = this.keyboard(65),
        up = this.keyboard(87),
        right = this.keyboard(68),
        down = this.keyboard(83),
        space = this.keyboard(74)
    
        left.press = () => {
            if (right.isDown) {
                playerShip.vx = 0
            } else {
                playerShip.vx = -speed
            }
        }
    
        left.release = () => {      
            if (!right.isDown) {
                playerShip.vx = 0
            }
        }
        up.press = () => {
            if (down.isDown) {
                playerShip.vy = 0
            } else {
                playerShip.vy = -speed
            }
        }
        up.release = () => {
            if (!down.isDown) {
                playerShip.vy = 0
            }
        }
        right.press = () => {
            if (left.isDown) {
                playerShip.vx = 0
            } else {
                playerShip.vx = speed
            }        
        }
        right.release = () => {
            if (!left.isDown) {
                playerShip.vx = 0
            }
        }
        down.press = () => {
            if (up.isDown) {
               playerShip.vy = 0 
            } else {
                playerShip.vy = speed
            }
          }
        down.release = () => {
            if (!up.isDown) {
              playerShip.vy = 0
            }
        }
        space.press = () => {
            if (!space.isDown) {
                playerShip.fire = 1
            }else {
                playerShip.fire = false
            }
        }
        space.release = () => {
            playerShip.fire =  false
        }
    },
    hitTestRectangle: function (r1, r2) {
        let hit, combinedHalfWidths, combinedHalfHeights, vx, vy

        hit = false

        r1.centerX = r1.x + r1.width / 2
        r1.centerY = r1.y + r1.height / 2
        r2.centerX = r2.x + r2.width / 2
        r2.centerY = r2.y + r2.height / 2

        r1.halfWidth = r1.width / 2
        r1.halfHeight = r1.height / 2
        r2.halfWidth = r2.width / 2
        r2.halfHeight = r2.height / 2

        vx = r1.centerX - r2.centerX
        vy = r1.centerY - r2.centerY
      
        combinedHalfWidths = r1.halfWidth + r2.halfWidth
        combinedHalfHeights = r1.halfHeight + r2.halfHeight

        if (Math.abs(vx) < combinedHalfWidths) {

          if (Math.abs(vy) < combinedHalfHeights) {

            hit = true
          } else {

            hit = false
          }
        } else {

          hit = false
        }
        return hit
      },
      contain: function (sprite, container) {
        let collision = undefined
        if (sprite.x < container.x) {
          sprite.x = container.x
          collision = "left"
        }     
        if (sprite.y < container.y) {
          sprite.y = container.y
          collision = "top"
        }

        if (sprite.x + sprite.width > container.width) {
          sprite.x = container.width - sprite.width
          collision = "right"
        }

        if (sprite.y + sprite.height > container.height) {
          sprite.y = container.height - sprite.height
          collision = "bottom"
        }
        return collision
      }
}

export default common