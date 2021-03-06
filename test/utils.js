const assert = require('assert');
const {
  asArray,
  compose,
  env,
  get,
  getter,
  groupBy,
  identity,
  indexBy,
  isNone,
  not,
  set
} = require('..');

describe('Utils', function () {
  describe('get', function() {
    it('should load value for arbitrary nested path', function() {
      const obj = { root: { arr: [1, 2, { lol: 'wut', inner: [3] }] } };

      assert.strictEqual(get(obj, 'root.arr.2.inner.0'), 3);
      assert.deepStrictEqual(get(obj, 'root.arr.2'),
        { lol: 'wut', inner: [3] });
    });
  });

  describe('getter', function () {
    it('should return function like identity', function () {
      assert.equal(getter()('test'), 'test');
    });

    it('should return getter function for path', function () {
      assert.equal(getter('key1.key2')({ key1: { key2: 'test' } }), 'test');
    });

    it('should return undefined if no key found', function () {
      assert.equal(getter('key1.key2')({ key5: { key3: 'test' } }), undefined);
    });

    it('should cache functions', function () {
      assert.equal(getter('test'), getter('test'));
    })
  });

  describe('compose', function () {
    it('should chain functions', function () {
      assert.equal(
        compose(val => val - 5, val => val * 2)(20),
        30
      )
    });

    it('should return loopback function if no arguments passed', function () {
      assert.equal(compose()(55), 55);
    });
  });

  describe('identity', function () {
    it('should return function that return passed value', function () {
      assert.equal(identity(55)(87), 55);
    });

    it('should return loopback function if no arguments passed', function () {
      assert.equal(identity()(87), 87);
    });
  });

  describe('groupBy', function () {
    it('should return hash with groupped objects', function () {
      assert.deepEqual(groupBy('id', [{ id: '6', data: '55' }, { id: '9' }]), {
        '6': [{ id: '6', data: '55' }],
        '9': [{ id: '9' }]
      });
    });
  });

  describe('indexBy', function () {
    it('should return indexed hash', function () {
      assert.deepEqual(indexBy('id', [{ id: '6', data: '55' }, { id: '9' }]), {
        '6': { id: '6', data: '55' },
        '9': { id: '9' }
      });
    });
  });

  describe('env', function () {
    it('should return default value if not defined in enviroment', function () {
      assert.equal(env('key123', 'default'), 'default');
    });

    it('should return value of enviroment variable if defined', function () {
      process.env['test_var_123'] = 'defined';
      assert.equal(env('test_var_123', 'default'), 'defined');
    });

    it('should throw exception if variable not defined and default is not set', function () {
      assert.throws(() => env('test_var_12345'), Error);
    });
  });

  describe('asArray', function() {
    it('should return array as is', function() {
      const arr = [1, 2, 3];
      assert.strictEqual(asArray(arr), arr);
    });

    it('should wrap anything that is not an array into an array', function() {
      const obj = {};
      assert.deepStrictEqual(asArray(obj), [obj]);
    });
  });

  describe('not', function() {
    it('should invert a result of the function supplied', function() {
      const notA = not(getter('a'));

      assert.ok(notA({ a: false }));
      assert.ok(notA({}));
      assert.ok(!notA({ a: 5 }));
    });
    it('should wrap string arg into a getter', function() {
      const notA = not('a');

      assert.ok(notA({ a: false }));
      assert.ok(notA({}));
      assert.ok(!notA({ a: 5 }));
    });
  });

  describe('isNone', function() {
    it('should return true for null or undefined', function() {
      assert.ok(isNone(null));
      assert.ok(isNone(undefined));
    });

    it(`should return false for 0, false or ''`, function() {
      assert.ok(!isNone(false));
      assert.ok(!isNone(0));
      assert.ok(!isNone(''));
    });
    it('should return false for truthy values', function() {
      assert.ok(!isNone([]));
      assert.ok(!isNone({}));
      assert.ok(!isNone(3));
      assert.ok(!isNone(true));
      assert.ok(!isNone('abc'));
    });
  });

  describe('set', function() {
    it('sets nested object value', function() {
      const obj = {};
      set(obj, 'a.b.c', 3);

      assert.deepStrictEqual(obj, { a: { b: { c: 3 } } });
    });
    it('returns the top-level object being mutated', function() {
      const obj = {};

      assert.strictEqual(set(obj, 'a.b.c', 3), obj);
    });
  });
});
