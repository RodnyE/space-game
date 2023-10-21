const UserModel = (DataTypes) => {
    return {
        user_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        colonies: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        pos: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        world_pos: {
            type: DataTypes.JSON,
            defaultValue: {}
        }
    };
};

module.exports = UserModel;