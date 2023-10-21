const AsteroidModel = (DataTypes) => {
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
        diameter: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };
};

module.exports = AsteroidModel;