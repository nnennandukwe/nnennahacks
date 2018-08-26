const _ = require('lodash');
const print = (...args) => {
    if (!process.env.DEBUG || !/nql/.test(process.env.DEBUG)) {
        return;
    }

    console.log(...args); // eslint-disable-line no-console
};

const logicOps = [
    '$and',
    '$or'
];

const compOps = {
    $eq: '=',
    $ne: '!=',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $in: 'in',
    $nin: 'not in'
};

const isOp = key => key.charAt(0) === '$';
const isLogicOp = key => isOp(key) && _.includes(logicOps, key);
const isCompOp = key => isOp(key) && _.includes(_.keys(compOps), key);

class MongoToKnex {
    constructor(qb) {
        this.qb = qb;
        this.tablename = qb._single.table;

        this.joins = [];
    }

    processWhereType(mode, op, value) {
        if (value === null) {
            return (mode === '$or' ? 'orWhere' : 'where') + (op === '$ne' ? 'NotNull' : 'Null');
        }

        if (mode === '$or') {
            return 'orWhere';
        }

        return 'andWhere';
    }

    processField(field, op) {
        const fieldParts = field.split('.');

        if (fieldParts[0] === this.tablename) {
            // If we have the right table already, return
            return field;
        } else if (fieldParts.length > 1) {
            // If we have a different table, that should be a join
            // Store the OP because an IN is different
            this.joins.push({table: fieldParts[0], op});

            return field;
        }

        return this.tablename + '.' + field;
    }

    buildComparison(qb, mode, field, op, value) {
        let comp = compOps[op] || '=';
        let whereType = this.processWhereType(mode, op, value);
        field = this.processField(field, op);

        print('add compare', whereType, field, op, comp, value);
        qb[whereType](field, comp, value);
    }

    buildWhereClause(qb, mode, field, sub) {
        print('whereClause', mode, field, sub);

        if (!_.isObject(sub)) {
            this.buildComparison(qb, mode, field, '$eq', sub);
        } else {
            _.forIn(sub, (value, op) => {
                if (isCompOp(op)) {
                    this.buildComparison(qb, mode, field, op, value);
                }
            });
        }
    }

    buildWhereGroup(qb, parentMode, mode, sub) {
        let whereType = this.processWhereType(parentMode);
        print('whereGroup', mode, whereType, sub, _.isObject(sub), _.isArray(sub));
        qb[whereType]((_qb) => {
            if (_.isArray(sub)) {
                sub.forEach(statement => this.buildQuery(_qb, mode, statement));
            } else if (_.isObject(sub)) {
                this.buildQuery(_qb, mode, sub);
            }
        });
    }

    buildQuery(qb, mode, sub) {
        print('buildQuery', mode, sub);
        _.forIn(sub, (value, key) => {
            if (isLogicOp(key)) {
                this.buildWhereGroup(qb, mode, key, value);
            } else {
                this.buildWhereClause(qb, mode, key, value);
            }
        });
    }

    processJSON(queryJSON) {
        // And is the default behaviour
        this.buildQuery(this.qb, 'and', queryJSON);
    }
}

module.exports = function convertor(qb, mongoJSON) {
    const mongoToKnex = new MongoToKnex(qb);

    mongoToKnex.processJSON(mongoJSON);

    return qb;
};
