const Rand = (start, end) => {
    return Math.round((Math.random() * (end -start)) + start);
};

function DistanceVector(vector1, vector2) {
    const distanceX = vector2.x - vector1.x;
    const distanceY = vector2.y - vector1.y;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    return distance.toFixed(2) - 0;
}

function Vector (x , y){
    return {
        x,y
    };
}

module.exports = {
    Rand,
    DistanceVector,
    Vector
}