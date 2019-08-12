'use strict';

const _ = require('lodash');
const assert = require('assert');

describe('lodash', function() {
  describe('sortBy', function() {
    it('property name', function() {
      const characters = [
        { name: 'Jean-Luc Picard', age: 59 },
        { name: 'William Riker', age: 29 },
        { name: 'Deanna Troi', age: 28 },
        { name: 'Worf', age: 24 }
      ];

      // Sort characters by the `age` property
      const sorted = _.sortBy(characters, 'age');

      sorted[0].name; // Worf
      sorted[1].name; // Deanna Troi
      sorted[2].name; // William Riker
      sorted[3].name; // Jean-Luc Picard
      // acquit:ignore:start
      assert.equal(sorted[0].name, 'Worf');
      assert.equal(sorted[1].name, 'Deanna Troi');
      assert.equal(sorted[2].name, 'William Riker');
      assert.equal(sorted[3].name, 'Jean-Luc Picard');
      // acquit:ignore:end
    });

    it('using function', function() {
      const characters = [
        { name: 'Jean-Luc Picard', age: 59 },
        { name: 'William Riker', age: 29 },
        { name: 'Deanna Troi', age: 28 },
        { name: 'Worf', age: 24 }
      ];

      // Sort characters by the `age` property
      const iteratees = obj => obj.age;
      const sorted = _.sortBy(characters, iteratees);

      sorted[0].name; // Worf
      sorted[1].name; // Deanna Troi
      sorted[2].name; // William Riker
      sorted[3].name; // Jean-Luc Picard
      // acquit:ignore:start
      assert.equal(sorted[0].name, 'Worf');
      assert.equal(sorted[1].name, 'Deanna Troi');
      assert.equal(sorted[2].name, 'William Riker');
      assert.equal(sorted[3].name, 'Jean-Luc Picard');
      // acquit:ignore:end
    });

    it('length', function() {
      const characters = [
        { name: 'Jean-Luc Picard', age: 59 },
        { name: 'William Riker', age: 29 },
        { name: 'Deanna Troi', age: 28 },
        { name: 'Worf', age: 24 }
      ];

      // Sort characters by the length of their name, longest first. Note
      // the negative sign.
      const iteratees = obj => -obj.name.length;
      const sorted = _.sortBy(characters, iteratees);

      sorted[0].name; // Jean-Luc Picard
      sorted[1].name; // William Riker
      sorted[2].name; // Deanna Troi
      sorted[3].name; // Worf
      // acquit:ignore:start
      assert.equal(sorted[3].name, 'Worf');
      assert.equal(sorted[2].name, 'Deanna Troi');
      assert.equal(sorted[1].name, 'William Riker');
      assert.equal(sorted[0].name, 'Jean-Luc Picard');
      // acquit:ignore:end
    });
  });

  describe('get', function() {
    it('basic', function() {
      // acquit:ignore:start
      const landmark = {
        name: 'Golden Gate Bridge',
        // GeoJSON feature: https://geojson.org/
        location: {
          type: 'Feature',
          properties: {
            city: 'San Francisco',
            state: 'California'
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.4804438, 37.8199328]
          }
        }
      };

      // acquit:ignore:end
      let type = _.get(landmark, 'location.geometry.type'); // 'Point'
      // acquit:ignore:start
      assert.equal(type, 'Point');
      // acquit:ignore:end

      delete landmark.location;
      // `_.get()` doesn't error out, even though `landmark.location` is
      // undefined.
      type = _.get(landmark, 'location.geometry.type'); // undefined
      // acquit:ignore:start
      assert.strictEqual(type, void 0);
      // acquit:ignore:end

      // Even if `landmark` is `null`, `_.get()` does not error out.
      type = _.get(null, 'location.geometry.type'); // undefined
      // acquit:ignore:start
      assert.strictEqual(type, void 0);
      // acquit:ignore:end
    });

    it('default', function() {
      // acquit:ignore:start
      const landmark = {
        name: 'Golden Gate Bridge',
        // GeoJSON feature: https://geojson.org/
        location: {
          type: 'Feature',
          properties: {
            city: 'San Francisco',
            state: 'California'
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.4804438, 37.8199328]
          }
        }
      };
      // acquit:ignore:end
      landmark.location.geometry.type = undefined;
      // If the value of the property is `undefined`, `_.get()` will return
      // the default value.
      let type = _.get(landmark, 'location.geometry.type', 'default'); // 'default'
      // acquit:ignore:start
      assert.equal(type, 'default');
      // acquit:ignore:end

      delete landmark.location;
      // If the property doesn't exist, `_.get()` will also return the default
      // value.
      type = _.get(landmark, 'location.geometry.type', 'default'); // 'default'
      // acquit:ignore:start
      assert.strictEqual(type, 'default');
      // acquit:ignore:end
    });

    it('with null', function() {
      // acquit:ignore:start
      const landmark = {
        name: 'Golden Gate Bridge',
        // GeoJSON feature: https://geojson.org/
        location: {
          type: 'Feature',
          properties: {
            city: 'San Francisco',
            state: 'California'
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.4804438, 37.8199328]
          }
        }
      };
      // acquit:ignore:end
      landmark.location.geometry.type = null;
      // If the value of the property is `null`, `_.get()` will **not** use
      // the default value
      let type = _.get(landmark, 'location.geometry.type', 'default'); // null
      // acquit:ignore:start
      assert.strictEqual(type, null);
      // acquit:ignore:end
    });

    it('safe null', function() {
      // acquit:ignore:start
      const landmark = {
        name: 'Golden Gate Bridge',
        // GeoJSON feature: https://geojson.org/
        location: {
          type: 'Feature',
          properties: {
            city: 'San Francisco',
            state: 'California'
          },
          geometry: {
            type: 'Point',
            coordinates: [-122.4804438, 37.8199328]
          }
        }
      };
      // acquit:ignore:end
      landmark.location.geometry.type = null;

      const checkDefault = (v, def) => v == null ? def : v;
      // 'default'
      let type = checkDefault(_.get(landmark, 'location.geometry.type'), 'default');
      // acquit:ignore:start
      assert.strictEqual(type, 'default');
      // acquit:ignore:end
    });
  });

  describe('find', function() {
    it('basic', function() {
      const arr = [1, 2, 3, 4, 5];

      // `find()` executes `predicate` for every element in the array until
      // `predicate` returns true.
      const predicate = v => v > 3;
      _.find(arr, predicate); // 4
      // acquit:ignore:start
      assert.equal(_.find(arr, predicate), 4);
      // acquit:ignore:end
    });

    it('no result', function() {
      const arr = [1, 2, 3, 4, 5];

      _.find(arr, v => v > 5); // undefined
      // acquit:ignore:start
      assert.strictEqual(_.find(arr, v => v > 5), void 0);
      // acquit:ignore:end
    });

    it('object', function() {
      const obj = { key1: 1, key2: 2, key3: 3 };

      _.find(obj, v => v > 2); // 3
      // acquit:ignore:start
      assert.strictEqual(_.find(obj, v => v > 2), 3);
      // acquit:ignore:end
    });

    it('object comparison', function() {
      const characters = [
        { firstName: 'Jean-Luc', lastName: 'Picard', rank: 'Captain', age: 59 },
        { firstName: 'Will', lastName: 'Riker', rank: 'Commander', age: 29 },
        { firstName: 'Geordi', lastName: 'La Forge', rank: 'Lieutenant', age: 29 }
      ];

      _.find(characters, { rank: 'Commander', age: 29 }).lastName; // 'Riker'
      // acquit:ignore:start
      assert.strictEqual(_.find(characters, { rank: 'Commander', age: 29 }).lastName,
        'Riker');
      // acquit:ignore:end
    });

    it('string comparison', function() {
      const characters = [
        { name: 'Doctor Pulaski' },
        { name: 'Tasha Yar', active: false },
        { name: 'Wesley Crusher', active: null },
        { name: 'Jean-Luc Picard', active: true }
      ];

      // Find the first character with a truthy `active` property
      _.find(characters, 'active').name; // 'Jean-Luc Picard'
      // acquit:ignore:start
      assert.strictEqual(_.find(characters, 'active').name, 'Jean-Luc Picard');
      // acquit:ignore:end
    });
  });
});