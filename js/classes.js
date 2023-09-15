class Sprite {
    constructor({
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x : 0, y : 0}
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 25
        this.offset = offset
    }

    draw() {
        context.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
        
    }

    update() {
        this.draw()
        this.framesElapsed++
        this.animateFrames()
}
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x : 0, y : 0},
        sprites,
        attackBox = {offset : {}, width: undefined, height : undefined}
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax, 
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkey 
        this.attackBox = {
            position : {
                x : this.position.x,
                y : this.position.y
            },
            offset : attackBox.offset,
            width : attackBox.width,
            height : attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 17
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        if(!this.dead ){
            this.animateFrames()
        }

        //hit boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        //context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //Gravity Function
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    takeDamage() {
        this.health -= 20

        if(this.health <= 0 ){
            this.switchSprite('death')
        } else {
            this.switchSprite('takeDamage')
        }
    }

    switchSprite(sprite){
        if(this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.framesMax -1){
                this.dead = true
            }
            return 
        }
        if(
            this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1
            ){
            return
        }
        if (
            this.image === this.sprites.takeDamage.image && 
            this.framesCurrent < this.sprites.takeDamage.framesMax -1
            ){
            return 
        }

        switch(sprite){
            case 'idle' : 
            if (this.image !== this.sprites.idle.image){
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.framesCurrent = 0
            }
                break
            case 'runLeft' :
                if (this.image !== this.sprites.runLeft.image){
                    this.image = this.sprites.runLeft.image
                    this.framesMax = this.sprites.runLeft.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'runRight' :
                    if (this.image !== this.sprites.runRight.image){
                        this.image = this.sprites.runRight.image
                        this.framesMax = this.sprites.runRight.framesMax
                        this.framesCurrent = 0
                    }
                    break
            case 'jump' :
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'fall' :
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'attack1' :
                if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeDamage' :
                if (this.image !== this.sprites.takeDamage.image){
                    this.image = this.sprites.takeDamage.image
                    this.framesMax = this.sprites.takeDamage.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'death' :
                if (this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
    }
}
}