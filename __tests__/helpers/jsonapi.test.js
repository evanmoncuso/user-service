import { decode, encode } from '../../src/helpers/jsonapi'

// Decode
// ========================
// ============
// ===
describe('Helpers | Decode', () => {
  describe('Nothing has been horribly destroyed', () => {
    test('decode function exists', () => {
      expect(!!decode).toBe(true);
    });

    test('decode is a function', () => {
      expect(typeof decode).toBe('function')

    });
  });

  describe('Transforms single object payloads', () => {
    const samplePayload = {
      data: {
        id: 1,
        type: 'artist',
        attributes: {
          name: 'sufjan stevens',
          active: true,
          albums: [ 'seven swans', 'illinois', 'michigan' ]
        }
      }
    }

    test('returns the correct output', () => {
      const output = decode(samplePayload);
  
      const expected = {
        id: 1,
        name: 'sufjan stevens',
        active: true,
        albums: ['seven swans', 'illinois', 'michigan']
      }
  
      expect(output).toEqual(expected);
    });
  });

  describe('Transforms multiple object payloads', () => {
    const samplePayload = {
      data: [{
        id: 1,
        type: 'artist',
        attributes: {
          name: 'sufjan stevens',
          active: true,
          albums: ['seven swans', 'illinois', 'michigan']
        }
      }, {
        id: 2,
        type: 'artist',
        attributes: {
          name: 'bon iver',
          active: true,
          albums: ['for emma', 'bon iver', '22, a million', 'i,i']
        }
      }]
    }

    test('returns the correct output', () => {
      const output = decode(samplePayload);
      const expected = [{
        id: 1,
        name: 'sufjan stevens',
        active: true,
        albums: ['seven swans', 'illinois', 'michigan']

      }, {
        id: 2,
        name: 'bon iver',
        active: true,
        albums: ['for emma', 'bon iver', '22, a million', 'i,i']
      }]
      
      expect(output).toEqual(expected);
    });
  });
});

test('encode wont stop talking about encode', () => {
  expect(encode()).toBe('encode');
});