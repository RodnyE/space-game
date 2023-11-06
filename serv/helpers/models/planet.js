const PlanetModel = (DataTypes) => {
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
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        diameter: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isTerraforming: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        estronite: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        estronite_op: {
            type: DataTypes.INTEGER,
            defaultValue: 1000000000000
        },
        diamantine: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        diamantine_op: {
            type: DataTypes.INTEGER,
            defaultValue: 1000000000000
        },
        platirium: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        platirium_op: {
            type: DataTypes.INTEGER,
            defaultValue: 1000000000000
        },
        xenium: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        xenium_op: {
            type: DataTypes.INTEGER,
            defaultValue: 1000000000000
        },
        estronite_mine: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        estronite_warehouse: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        diamantine_mine: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        diamantine_warehouse: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        platirium_mine: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        platirium_warehouse: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        power_plant: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    };
};

module.exports = PlanetModel;