const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class FiledsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const fileds = await db.fileds.create(
      {
        id: data.id || undefined,

        stringfield: data.stringfield || null,
        boolfield: data.boolfield || false,

        datetime: data.datetime || null,
        demical: data.demical || null,
        intfield: data.intfield || null,
        enumfield: data.enumfield || null,
        enumfieldselect: data.enumfieldselect || null,
        datefield: data.datefield || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await fileds.setRelationonefield(data.relationonefield || null, {
      transaction,
    });

    await fileds.setRelationmanyfield(data.relationmanyfield || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.fileds.getTableName(),
        belongsToColumn: 'imagesfield',
        belongsToId: fileds.id,
      },
      data.imagesfield,
      options,
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.fileds.getTableName(),
        belongsToColumn: 'filedfield',
        belongsToId: fileds.id,
      },
      data.filedfield,
      options,
    );

    return fileds;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const filedsData = data.map((item) => ({
      id: item.id || undefined,

      stringfield: item.stringfield || null,
      boolfield: item.boolfield || false,

      datetime: item.datetime || null,
      demical: item.demical || null,
      intfield: item.intfield || null,
      enumfield: item.enumfield || null,
      enumfieldselect: item.enumfieldselect || null,
      datefield: item.datefield || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const fileds = await db.fileds.bulkCreate(filedsData, { transaction });

    // For each item created, replace relation files

    for (let i = 0; i < fileds.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.fileds.getTableName(),
          belongsToColumn: 'imagesfield',
          belongsToId: fileds[i].id,
        },
        data[i].imagesfield,
        options,
      );
    }

    for (let i = 0; i < fileds.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.fileds.getTableName(),
          belongsToColumn: 'filedfield',
          belongsToId: fileds[i].id,
        },
        data[i].filedfield,
        options,
      );
    }

    return fileds;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const fileds = await db.fileds.findByPk(id, {
      transaction,
    });

    await fileds.update(
      {
        stringfield: data.stringfield || null,
        boolfield: data.boolfield || false,

        datetime: data.datetime || null,
        demical: data.demical || null,
        intfield: data.intfield || null,
        enumfield: data.enumfield || null,
        enumfieldselect: data.enumfieldselect || null,
        datefield: data.datefield || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await fileds.setRelationonefield(data.relationonefield || null, {
      transaction,
    });

    await fileds.setRelationmanyfield(data.relationmanyfield || [], {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.fileds.getTableName(),
        belongsToColumn: 'imagesfield',
        belongsToId: fileds.id,
      },
      data.imagesfield,
      options,
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.fileds.getTableName(),
        belongsToColumn: 'filedfield',
        belongsToId: fileds.id,
      },
      data.filedfield,
      options,
    );

    return fileds;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const fileds = await db.fileds.findByPk(id, options);

    await fileds.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await fileds.destroy({
      transaction,
    });

    return fileds;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const fileds = await db.fileds.findOne({ where }, { transaction });

    if (!fileds) {
      return fileds;
    }

    const output = fileds.get({ plain: true });

    output.imagesfield = await fileds.getImagesfield({
      transaction,
    });

    output.filedfield = await fileds.getFiledfield({
      transaction,
    });

    output.relationonefield = await fileds.getRelationonefield({
      transaction,
    });

    output.relationmanyfield = await fileds.getRelationmanyfield({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'relationonefield',
      },

      {
        model: db.users,
        as: 'relationmanyfield',
        through: filter.relationmanyfield
          ? {
              where: {
                [Op.or]: filter.relationmanyfield.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.relationmanyfield ? true : null,
      },

      {
        model: db.file,
        as: 'imagesfield',
      },

      {
        model: db.file,
        as: 'filedfield',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.stringfield) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('fileds', 'stringfield', filter.stringfield),
        };
      }

      if (filter.datetimeRange) {
        const [start, end] = filter.datetimeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            datetime: {
              ...where.datetime,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            datetime: {
              ...where.datetime,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.demicalRange) {
        const [start, end] = filter.demicalRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            demical: {
              ...where.demical,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            demical: {
              ...where.demical,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.intfieldRange) {
        const [start, end] = filter.intfieldRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            intfield: {
              ...where.intfield,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            intfield: {
              ...where.intfield,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.datefieldRange) {
        const [start, end] = filter.datefieldRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            datefield: {
              ...where.datefield,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            datefield: {
              ...where.datefield,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.boolfield) {
        where = {
          ...where,
          boolfield: filter.boolfield,
        };
      }

      if (filter.enumfield) {
        where = {
          ...where,
          enumfield: filter.enumfield,
        };
      }

      if (filter.enumfieldselect) {
        where = {
          ...where,
          enumfieldselect: filter.enumfieldselect,
        };
      }

      if (filter.relationonefield) {
        var listItems = filter.relationonefield.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          relationonefieldId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.fileds.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.fileds.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('fileds', 'stringfield', query),
        ],
      };
    }

    const records = await db.fileds.findAll({
      attributes: ['id', 'stringfield'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['stringfield', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.stringfield,
    }));
  }
};
