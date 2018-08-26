require('./utils');
const nql = require('@nexes/nql-lang');
const mongoToKnex = require('@nexes/mongo-knex');
const knex = require('knex')({client: 'mysql'});
/**
 * The purpose of this file is to prove that NQL
 * is not just transformed to mongo queries correctly
 * but that this can be used in real world settings to query SQL databases
 */

const makeQuery = (nqlString, options) => {
    const postKnex = knex('posts');
    const filter = nql.parse(nqlString, options);

    // console.log('Filter', require('util').inspect(filter, false, null)); // eslint-disable-line no-console

    return mongoToKnex(postKnex, filter, {});
};

describe('Integration with Knex', function () {
    describe('Simple Expressions', function () {
        it('should match based on simple id', function () {
            const query = makeQuery('id:3');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` = 3');
        });

        it('should match based on string', function () {
            const query = makeQuery('title:\'Second post\'');

            query.toQuery().should.eql('select * from `posts` where `posts`.`title` = \'Second post\'');
        });

        // it('dummy version of tag query', function () {
        //     const query = makeQuery('tags:[photo, video]');
        //
        //     console.log(query.toQuery()); // eslint-disable-line no-console
        //
        //     query.toQuery().should.eql('select * from `posts` where tags in (\'photo\', \'video\')');
        // });
    });

    describe('Comparison Query Operators', function () {
        it('can match equals', function () {
            const query = makeQuery('id:2');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` = 2');
        });

        it('can match not equals', function () {
            const query = makeQuery('id:-2');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` != 2');
        });

        it('can match gt', function () {
            const query = makeQuery('id:>2');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` > 2');
        });

        it('can match lt', function () {
            const query = makeQuery('id:<2');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` < 2');
        });

        it('can match gte', function () {
            const query = makeQuery('id:>=2');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` >= 2');
        });

        it('can match lte', function () {
            const query = makeQuery('id:<=2');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` <= 2');
        });

        it('can match simple in (single value)', function () {
            const query = makeQuery('id:[2]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` in (2)');
        });

        it('can match simple in (multiple values)', function () {
            const query = makeQuery('id:[1,3]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` in (1, 3)');
        });

        it('can match simple NOT in (single value)', function () {
            const query = makeQuery('id:-[2]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` not in (2)');
        });

        it('can match simple NOT in (multiple values)', function () {
            const query = makeQuery('id:-[1,3]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`id` not in (1, 3)');
        });

        it('can match array in (single value)', function () {
            const query = makeQuery('tags:[video]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`tags` in (\'video\')');
        });

        it('can match array in (multiple values)', function () {
            const query = makeQuery('tags:[video, audio]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`tags` in (\'video\', \'audio\')');
        });

        it('can match array NOT in (single value)', function () {
            const query = makeQuery('tags:-[video]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`tags` not in (\'video\')');
        });

        it('can match array NOT in (multiple values)', function () {
            const query = makeQuery('tags:-[video, audio]');

            query.toQuery().should.eql('select * from `posts` where `posts`.`tags` not in (\'video\', \'audio\')');
        });
    });

    describe('Logical Query Operators', function () {
        it('$and (2 different properties)', function () {
            const query = makeQuery('featured:false+status:published');

            query.toQuery().should.eql('select * from `posts` where (`posts`.`featured` = false and `posts`.`status` = \'published\')');
        });

        it('$and (3 different properties)', function () {
            const query = makeQuery('featured:false+status:published+image:null');

            query.toQuery().should.eql('select * from `posts` where (`posts`.`featured` = false and `posts`.`status` = \'published\' and `posts`.`image` is null)');

            // const JSON = {$and: {featured: false, status: 'published', image: null}};
            // console.log('non nql', knexify(knex('posts'), JSON, {}).toQuery()); // eslint-disable-line no-console
        });

        it('$and (same properties)', function () {
            const query = makeQuery('featured:false+featured:true');

            query.toQuery().should.eql('select * from `posts` where (`posts`.`featured` = false and `posts`.`featured` = true)');
        });

        it('$or (different properties)', function () {
            const query = makeQuery('featured:false,status:published');

            query.toQuery().should.eql('select * from `posts` where (`posts`.`featured` = false or `posts`.`status` = \'published\')');
        });

        it('$or (same properties)', function () {
            const query = makeQuery('featured:false,featured:true');

            query.toQuery().should.eql('select * from `posts` where (`posts`.`featured` = false or `posts`.`featured` = true)');
        });
    });

    describe('Logical Groups', function () {
        describe('$or', function () {
            it('ungrouped version', function () {
                const query = makeQuery('author:-joe,tags:[photo],image:-null,featured:true');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or `posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true)');
            });

            it('RIGHT grouped version', function () {
                const query = makeQuery('author:-joe,(tags:[photo],image:-null,featured:true)');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or (`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true))');
            });

            it('LEFT grouped version', function () {
                const query = makeQuery('(tags:[photo],image:-null,featured:true),author:-joe');

                query.toQuery().should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true) or `posts`.`author` != \'joe\')');
            });
        });

        describe('$and', function () {
            it('ungrouped version', function () {
                const query = makeQuery('author:-joe+tags:[photo]+image:-null+featured:true');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' and `posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true)');
            });

            it('RIGHT grouped version', function () {
                const query = makeQuery('author:-joe+(tags:[photo]+image:-null+featured:true)');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' and (`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true))');
            });

            it('LEFT grouped version', function () {
                const query = makeQuery('(tags:[photo]+image:-null+featured:true)+author:-joe');

                query.toQuery().should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true) and `posts`.`author` != \'joe\')');
            });
        });

        describe('$or with $and group', function () {
            it('ungrouped version', function () {
                const query = makeQuery('author:-joe,tags:[photo]+image:-null+featured:true');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or (`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true))');
            });

            it('RIGHT grouped version', function () {
                const query = makeQuery('author:-joe,(tags:[photo]+image:-null+featured:true)');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' or (`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true))');
            });

            it('LEFT grouped version', function () {
                const query = makeQuery('(tags:[photo]+image:-null+featured:true),author:-joe');

                query.toQuery().should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') and `posts`.`image` is not null and `posts`.`featured` = true) or `posts`.`author` != \'joe\')');
            });
        });

        describe('$and with $or group', function () {
            it('ungrouped version', function () {
                const query = makeQuery('author:-joe+tags:[photo],image:-null,featured:true');

                query.toQuery().should.eql('select * from `posts` where ((`posts`.`author` != \'joe\' and `posts`.`tags` in (\'photo\')) or `posts`.`image` is not null or `posts`.`featured` = true)');
            });

            it('RIGHT grouped version', function () {
                const query = makeQuery('author:-joe+(tags:[photo],image:-null,featured:true)');

                query.toQuery().should.eql('select * from `posts` where (`posts`.`author` != \'joe\' and (`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true))');
            });

            it('LEFT grouped version', function () {
                const query = makeQuery('(tags:[photo],image:-null,featured:true)+author:-joe');

                query.toQuery().should.eql('select * from `posts` where ((`posts`.`tags` in (\'photo\') or `posts`.`image` is not null or `posts`.`featured` = true) and `posts`.`author` != \'joe\')');
            });
        });
    });

    describe('Aliases', function () {
        it('can handle empty aliases', function () {
            const query = makeQuery('tags:[photo]', {aliases: {}});

            query.toQuery().should.eql('select * from `posts` where `posts`.`tags` in (\'photo\')');
        });

        it('can expand a field alias', function () {
            const query = makeQuery('tags:[photo]', {aliases: {tags: 'tags.slug'}});

            query.toQuery().should.eql('select * from `posts` where `tags`.`slug` in (\'photo\')');
        });

        it('can expand multiple field aliases', function () {
            const query = makeQuery('tags:[photo]+authors:joanne', {aliases: {tags: 'tags.slug', authors: 'authors.slug'}});

            query.toQuery().should.eql('select * from `posts` where (`tags`.`slug` in (\'photo\') and `authors`.`slug` = \'joanne\')');
        });
    });
});
