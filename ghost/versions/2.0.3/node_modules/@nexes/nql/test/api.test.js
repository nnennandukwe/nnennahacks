require('./utils');

const mingo = require('mingo');
const nqlLang = require('@nexes/nql-lang');
const nql = require('../lib/nql');
const knex = require('knex')({client: 'mysql'});
const sandbox = sinon.sandbox.create();

const testAliases = {tags: 'tags.slug', authors: 'authors.slug'};

/**
 nql('id:3').lex()
 nql('id:3').parse()
 nql('id:3').queryJSON({});
 nql('id:3').querySQL(knex('posts'));
 nql('id:3').toJSON();

 // In future?
 nql('id:3').merge('title:6');
 */
describe('Public API', function () {
    afterEach(function () {
        sandbox.restore();
    });

    it('Basic API works as expected', function () {
        const query = nql('id:3');

        query.toJSON().should.eql({id: 3});
        query.toString().should.eql('id:3');

        query.queryJSON({id: 5}).should.be.false();
        query.queryJSON({id: 3, name: 'kate'}).should.be.true();

        query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where `posts`.`id` = 3');
    });

    it('ensure multiple nql instances', function () {
        const query1 = nql('id:3');
        const query2 = nql('featured:true');

        query1.parse().should.eql({id: 3});
        query2.parse().should.eql({featured: true});

        query1.queryJSON({id: 3}).should.be.true();
        query1.queryJSON({id: 2}).should.be.false();

        query2.queryJSON({featured: true}).should.be.true();
        query2.queryJSON({featured: false}).should.be.false();
    });

    it('ensure caching works as expected', function () {
        sandbox.spy(mingo, 'Query');
        sandbox.spy(nqlLang, 'parse');

        const query = nql('id:3');

        query.queryJSON({id: 3}).should.be.true();
        mingo.Query.calledOnce.should.be.true();
        query.queryJSON({id: 3}).should.be.true();
        mingo.Query.calledOnce.should.be.true();

        query.parse().should.eql({id: 3});
        nqlLang.parse.calledOnce.should.be.true();
        query.parse().should.eql({id: 3});
        nqlLang.parse.calledOnce.should.be.true();
    });

    it('Supports options (aliases)', function () {
        const query = nql('tags:[photo]', {aliases: testAliases});

        query.toJSON().should.eql({'tags.slug': {$in: ['photo']}});
        query.toString().should.eql('tags:[photo]');

        query.queryJSON({tags: [{slug: 'video'}, {slug: 'audio'}]}).should.be.false();
        query.queryJSON({id: 3, tags: [{slug: 'video'}, {slug: 'photo'}, {slug: 'audio'}]}).should.be.true();

        // @TODO implement actual joins in mongo-knex!
        query.querySQL(knex('posts')).toQuery().should.eql('select * from `posts` where `tags`.`slug` in (\'photo\')');
    });
});

describe.skip('Potential Future API', function () {
    it('does not work this way yet', function () {
        // const nql = new nql.Env({
        //     aliases: {author: 'author.slug', tags: 'tags.slug', tag: 'tags.slug', authors: 'authors.slug'}
        // });
        //
        // nql('tag:test')
        //   .toSQL(knex('posts'))
        //   .should.eql('
        //       select * from `posts`
        //         left join `posts_tags` on `posts`.`id` = `posts_tags`.`posts_id`
        //         left join `tags` on `tags`.`id` = `posts_tags`.`tags_id`
        //         where `tags`.`slug` = \'test\'
        // ');
    });
});
