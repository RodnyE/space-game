const SpaceZoneModel = (DataTypes) => {
    return {
        name: {
            type: DataTypes.STRING,
            unique: true,
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
        type: {
            type: DataTypes.STRING,
            defaultValue: "empty"
        }
    };
};

module.exports = SpaceZoneModel;