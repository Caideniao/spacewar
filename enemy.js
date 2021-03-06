
let enemy = {
    normal: 12,
    spacing:40,
    normalWidth:15,
    normalHeight:20,
    rock:{
        width:45,
        height:40,
        amount:10,
        last:8000,
        image:'meteorBrown_med3.png',
        count:5
    },
    rock2:{
        width:55,
        height:51,
        amount:8,
        last:7000,
        image:'meteorGrey_big3.png',
        count:8
    },
    bad1:{
        width:25,
        height:30,
        amount:8,
        last:6000,
        image:'enemyGreen3.png',
        count:3
    },
    bad2:{
        width:40,
        height:35,
        amount:8,
        last:4000,
        image:'enemyGreen1.png',
        count:3
    },
    bad3:{
        width:20,
        height:25,
        amount:10,
        last:4000,
        image:'enemyRed5.png',
        count:3
    },
    normal:{
        width:15,
        height:20,
        amount:12,
        last:5000,
        image:'enemyBlue4.png',
        count:2
    },
    explosion:{
        width:15,
        height:20,
        amount:12,
        last:5000,
        image:'explosion.png',
    }
}

export default enemy