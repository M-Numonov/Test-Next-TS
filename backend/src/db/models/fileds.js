const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const fileds = sequelize.define(
    'fileds',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      stringfield: {
        type: DataTypes.TEXT,
      },

      boolfield: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
      },

      datetime: {
        type: DataTypes.DATE,
      },

      demical: {
        type: DataTypes.DECIMAL,
      },

      intfield: {
        type: DataTypes.INTEGER,
      },

      enumfield: {
        type: DataTypes.ENUM,

        values: ['1', '2'],
      },

      enumfieldselect: {
        type: DataTypes.ENUM,

        values: ['1', '2'],
      },

      datefield: {
        type: DataTypes.DATEONLY,

        get: function () {
          return this.getDataValue('datefield')
            ? moment.utc(this.getDataValue('datefield')).format('YYYY-MM-DD')
            : null;
        },
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  fileds.associate = (db) => {
    db.fileds.belongsToMany(db.users, {
      as: 'relationmanyfield',
      foreignKey: {
        name: 'fileds_relationmanyfieldId',
      },
      constraints: false,
      through: 'filedsRelationmanyfieldUsers',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.fileds.belongsTo(db.users, {
      as: 'relationonefield',
      foreignKey: {
        name: 'relationonefieldId',
      },
      constraints: false,
    });

    db.fileds.hasMany(db.file, {
      as: 'imagesfield',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.fileds.getTableName(),
        belongsToColumn: 'imagesfield',
      },
    });

    db.fileds.hasMany(db.file, {
      as: 'filedfield',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.fileds.getTableName(),
        belongsToColumn: 'filedfield',
      },
    });

    db.fileds.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.fileds.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return fileds;
};
