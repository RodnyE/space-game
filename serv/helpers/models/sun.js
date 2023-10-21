const SunModel = (DataTypes) => {
    return {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        spacezone_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        x: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        y: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        temperature: {
            type: DataTypes.INTEGER, //3000 - 9000 ºc
            allowNull: false
        },
        diameter: {
            type: DataTypes.INTEGER, //1m - 10m metros3
            allowNull: false
        }
    };
};

module.exports = SunModel;