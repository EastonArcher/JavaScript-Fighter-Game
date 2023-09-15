const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4

const background = new Sprite({
    position : {
        x : 0,
        y : 0,
    },
    imageSrc : './img/background.png'
})

const shop = new Sprite({
    position : {
        x : 40,
        y : 218,
    },
    imageSrc : './img/shop_anim.png',
    scale : 2.7,
    framesMax : 6
})

const player = new Fighter({
    position : {
    x : 0,
    y : 0
    },
    velocity : {
    x : 0,
    y : 0
    },
    offset : {
        x : 0,
        y : 0
    },
    imageSrc : './img/Huntress/Idle.png',
    framesMax : 10,
    scale : 3,
    offset : {
        x : 80,
        y : 15
    },
    sprites : {
        idle : {
            imageSrc : './img/Huntress/Idle.png',
            framesMax : 10
        },
        run : {
            imageSrc : './img/Huntress/Run.png',
            framesMax : 8
        },
        jump : {
            imageSrc : './img/Huntress/Jump.png',
            framesMax : 3
        },
        fall : {
            imageSrc : './img/Huntress/Fall.png',
            framesMax : 3
        },
        attack1: {
            imageSrc : './img/Huntress/Attack1.png',
            framesMax : 7
        },
        takeDamage : {
            imageSrc : './img/Huntress/Take Hit.png',
            framesMax : 3
        },
        death : {
            imageSrc : './img/Huntress/Death.png',
            framesMax : 11
        }
    },
    attackBox : {
        offset : {
            x : 125,
            y : 100
        },
        width : 150,
        height : 100
    }
})

const enemy = new Fighter({
    position : {
    x : 725,
    y : 100
    },
    velocity : {
    x : 0,
    y : 0
    },
    color : 'blue',
    offset : {
        x : -50,
        y : 0 
    },
    imageSrc : './img/Swordsman/Idle.png',
    framesMax : 6,
    scale : 2.2,
    offset : {
        x : 0,
        y : 42
    },
    sprites : {
        idle : {
            imageSrc : './img/Swordsman/Idle.png',
            framesMax : 6
        },
        run : {
            imageSrc : './img/Swordsman/Run.png',
            framesMax : 8
        },
        jump : {
            imageSrc : './img/Swordsman/Jump.png',
            framesMax : 2
        },
        fall : {
            imageSrc : './img/Swordsman/Fall.png',
            framesMax : 2
        },
        attack1: {
            imageSrc : './img/Swordsman/Attack1.png',
            framesMax : 4
        },
        takeDamage : {
            imageSrc : './img/Swordsman/Hit.png',
            framesMax : 3
        }, 
        death : {
            imageSrc : './img/Swordsman/Death.png',
            framesMax : 9
        }
    },
    attackBox : {
        offset : {
            x : 20,
            y : 100
        },
        width : 150,
        height : 100
    }
})

const keys = {
    a : {
        pressed : false
    },
    d : {
        pressed : false
    },
    w : {
        pressed : false
    },
    ArrowRight : {
        pressed : false
    }, 
    ArrowLeft : {
        pressed : false
    }

}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    context.fillStyle = 'rgba(255, 255, 255, 0.15)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player Movement 

    if(keys.a.pressed && player.lastkey == 'a'){
        player.velocity.x = -3
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey == 'd'){
        player.velocity.x = 3
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //Jumping
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }

    //Enemy Movement
    if(keys.ArrowLeft.pressed && enemy.lastkey == 'ArrowLeft'){
        enemy.velocity.x = -3
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey == 'ArrowRight'){
        enemy.velocity.x = 3
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //Jumping
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //Collision Detection and Hit Detection
    if(rectangularCollision({
        rectangle1 : player,
        rectangle2 : enemy
    }) && 
    player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeDamage()
        player.isAttacking = false

        gsap.to('#enemyHealthBar', {
            width : enemy.health + '%'
        })
    }

    //Player Miss
    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }
    //Player hit detection 
    if(rectangularCollision({
        rectangle1 : enemy,
        rectangle2 : player 
    }) && 
    enemy.isAttacking)
        {
        player.takeDamage()
        enemy.isAttacking = false

        gsap.to('#playerHealthBar', {
            width : player.health + '%'
        })
    }

    //Enemy Miss
    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    //End Game based on health
    if (enemy.health <=0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    } 
}

animate()

window.addEventListener('keydown', (event) =>{
    if(!player.dead){
    switch(event.key){
        //Player 1's movement
        case 'd' :
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a' :
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w' :
            player.velocity.y = -15
            break
        case ' ':
            player.attack()
            break
    }
}
    if(!enemy.dead){
    switch (event.key){
        //Player 2's movement
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            enemy.velocity.y = -15
            break
        case 'ArrowDown' :
            enemy.attack()
            break
    }
}
})

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break
        case 'w' :
            keys.w.pressed = false
            break  
    }
    
    //Enemy Keys
    switch(event.key){
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break
    }

})