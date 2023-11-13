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
            defaultValue: {x: 300 , y: 300}
        },
        space_pos: {
            type: DataTypes.JSON,
            defaultValue: {x: -1 , y: -1}
        },
        stats:{
            type: DataTypes.JSON,
            defaultValue: { hp: 100 , shield: 100 , energy: 100}
        },
        inventory: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        shortcuts: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    };
};

module.exports = UserModel;