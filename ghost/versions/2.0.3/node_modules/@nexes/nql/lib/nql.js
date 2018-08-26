const nql = require('@nexes/nql-lang');
const mingo = require('mingo');
const mongoKnex = require('@nexes/mongo-knex');

/**
 * Public API of NQL tools with consistent usage:
 *
 * nql('id:3').toJSON() = {id:3}
 * nql('id:3').queryJSON({test:true, id:3}) = true
 * nql('tags:test', {aliases: {tags: 'tags.slug'}}).toJSON() = {'tags.slug': test}
 */

module.exports = (queryString, options) => {
    const api = {};

    // Convert the string to tokens - useful for testing / debugging, maybe for validating?
    api.lex = () => nql.lex(queryString);

    // Parse converts to mongo JSON and caches the result
    api.parse = function () {
        if (!this.filter) {
            this.filter = nql.parse(queryString, options);
        }

        return this.filter;
    };

    // Use Mingo to apply the query to a JSON object
    // @TODO rethink this naming
    api.queryJSON = function (obj) {
        this.query = this.query || new mingo.Query(api.parse());
        return this.query.test(obj);
    };

    // Use MongoKnex to apply the query to a query builder object
    api.querySQL = qb => mongoKnex(qb, api.parse());

    // Get back the original query string
    api.toString = () => queryString;

    // Alias parse as toJSON()
    api.toJSON = api.parse;

    return api;
};
