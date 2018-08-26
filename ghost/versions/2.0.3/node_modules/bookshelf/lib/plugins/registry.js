'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Registry Plugin -
// Create a central registry of model/collection constructors to
// help with the circular reference problem, and for convenience in relations.
// -----
module.exports = function (bookshelf) {

  function preventOverwrite(store, name) {
    if (store[name]) throw new Error(name + ' is already defined in the registry');
  }

  bookshelf.registry = bookshelf.registry || {};

  // Set up the methods for storing and retrieving models
  // on the bookshelf instance.
  bookshelf.model = function (name, ModelCtor, staticProps) {
    this._models = this._models || Object.create(null);
    if (ModelCtor) {
      preventOverwrite(this._models, name);
      if ((0, _lodash.isPlainObject)(ModelCtor)) {
        ModelCtor = this.Model.extend(ModelCtor, staticProps);
      }
      this._models[name] = ModelCtor;
    }
    return this._models[name] = this._models[name] || bookshelf.resolve(name);
  };
  bookshelf.collection = function (name, CollectionCtor, staticProps) {
    this._collections = this._collections || Object.create(null);
    if (CollectionCtor) {
      preventOverwrite(this._collections, name);
      if ((0, _lodash.isPlainObject)(CollectionCtor)) {
        CollectionCtor = this.Collection.extend(CollectionCtor, staticProps);
      }
      this._collections[name] = CollectionCtor;
    }
    return this._collections[name] = this._collections[name] || bookshelf.resolve(name);
  };

  // Provide a custom function to resolve the location of a model or collection.
  bookshelf.resolve = function (name) {
    return void 0;
  };

  var ModelNotResolved = function (_Error) {
    (0, _inherits3.default)(ModelNotResolved, _Error);

    function ModelNotResolved() {
      (0, _classCallCheck3.default)(this, ModelNotResolved);
      return (0, _possibleConstructorReturn3.default)(this, (ModelNotResolved.__proto__ || Object.getPrototypeOf(ModelNotResolved)).apply(this, arguments));
    }

    return ModelNotResolved;
  }(Error);

  // Check the collection or module caches for a Model or Collection constructor,
  // returning if the input is not an object. Check for a collection first,
  // since these are potentially used with *-to-many relation. Otherwise, check for a
  // registered model, throwing an error if none are found.


  function resolveModel(input) {
    if (typeof input === 'string') {
      return bookshelf.collection(input) || bookshelf.model(input) || function () {
        throw new ModelNotResolved('The model ' + input + ' could not be resolved from the registry plugin.');
      }();
    }
    return input;
  }

  var Collection = bookshelf.Collection,
      Model = bookshelf.Model;

  // Re-implement the `bookshelf.Model` _relation method to include a check for
  // the registered model.

  var _relation = Model.prototype._relation;
  Model.prototype._relation = function () {
    // The second argument is always a model, so resolve it and call the original method.
    return _relation.apply(this, (0, _lodash.update)(arguments, 1, resolveModel));
  };

  // `morphTo` takes the relation name first, and then a variadic set of models so we
  // can't include it with the rest of the relational methods.
  var morphTo = Model.prototype.morphTo;
  Model.prototype.morphTo = function (relationName) {
    var candidates = void 0,
        columnNames = void 0;
    if ((0, _lodash.isArray)(arguments[1]) || (0, _lodash.isNil)(arguments[1])) {
      columnNames = arguments[1]; // may be `null` or `undefined`
      candidates = (0, _lodash.drop)(arguments, 2);
    } else {
      columnNames = null;
      candidates = (0, _lodash.drop)(arguments, 1);
    }

    // try to use the columnNames as target instead
    if ((0, _lodash.isArray)(columnNames)) {
      try {
        columnNames[0] = resolveModel(columnNames[0]);
      } catch (err) {
        // if it did not work, they were real columnNames
        if (err instanceof ModelNotResolved) {
          throw err;
        }
      }
    }

    var models = (0, _lodash.map)(candidates, function (target) {
      if ((0, _lodash.isArray)(target)) {
        var _target = (0, _slicedToArray3.default)(target, 2),
            model = _target[0],
            morphValue = _target[1];

        return [resolveModel(model), morphValue];
      } else {
        return resolveModel(target);
      }
    });
    return morphTo.apply(this, [relationName, columnNames].concat(models));
  };

  // The `through` method doesn't use `_relation` beneath, so we have to
  // re-implement it specifically
  var modelThrough = Model.prototype.through;
  Model.prototype.through = function () {
    // The first argument is the model
    return modelThrough.apply(this, (0, _lodash.update)(arguments, 0, resolveModel));
  };

  // The `through` method exists on the Collection as well, for
  // `hasMany` / `belongsToMany` through relations.
  var collectionThrough = Collection.prototype.through;
  Collection.prototype.through = function () {
    // The first argument is the model
    return collectionThrough.apply(this, (0, _lodash.update)(arguments, 0, resolveModel));
  };
};