import { decode, encode } from '../../src/helpers/jsonapi'

// Decode
// ========================
// ============
// ===
describe('Helpers | JSONAPI | Decode', () => {
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
          albums: [ 'seven swans', 'illinois', 'michigan', ],
        },
      },
    }

    test('returns the correct output', () => {
      const output = decode(samplePayload);
  
      const expected = {
        id: 1,
        name: 'sufjan stevens',
        active: true,
        albums: ['seven swans', 'illinois', 'michigan',],
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
          albums: ['seven swans', 'illinois', 'michigan',],
        },
      }, {
        id: 2,
        type: 'artist',
        attributes: {
          name: 'bon iver',
          active: true,
          albums: ['for emma', 'bon iver', '22, a million', 'i,i',],
        },
      },],
    }

    test('returns the correct output', () => {
      const output = decode(samplePayload);
      const expected = [{
        id: 1,
        name: 'sufjan stevens',
        active: true,
        albums: ['seven swans', 'illinois', 'michigan',],

      }, {
        id: 2,
        name: 'bon iver',
        active: true,
        albums: ['for emma', 'bon iver', '22, a million', 'i,i',],
      },]
      
      expect(output).toEqual(expected);
    });
  });
});


// encode
// ========================
// ============
// ===
describe('Helpers | JSONAPI | encode', () => {
  describe('Nothing has been horribly destroyed', () => {
    test('encode function exists', () => {
      expect(!!encode).toBe(true);
    });

    test('encode is a function', () => {
      expect(typeof encode).toBe('function')
    });
  });

  describe('It Encodes single objects correctly', () => {
    const sampleObject = {
      id: 1,
      name: 'tallest man on earth',
      active: true,
      albums: [ 'shallow graves', 'the dreamer ep', 'the wild hunt', ],
    }

    const output = encode(sampleObject, 'artist');
    const expected = {
      data: {
        id: 1,
        type: 'artist',
        attributes: {
          name: 'tallest man on earth',
          active: true,
          albums: [ 'shallow graves', 'the dreamer ep', 'the wild hunt', ],
        },
      },
    }
    test('it encodes a single object', () => {
      expect(output).toEqual(expected);
    });
  });

  describe('It encodes many objects correctly', () => {
    const sampleList = [
      {
        id: 1,
        name: 'neutral milk hotel',
        active: false,
        albums: [ 'avery island', 'in the aeroplane over the sea', ],
      }, {
        id: 2,
        name: 'grizzly bear',
        active: false,
        albums: [ 'yellow house', 'shields', 'veckatimest', ],
      },
    ];

    const output = encode(sampleList, 'artist');
    const expected = {
      data: [{
        id: 1,
        type: 'artist',
        attributes: {
          name: 'neutral milk hotel',
          active: false,
          albums: [ 
            'avery island', 
            'in the aeroplane over the sea', ],

        },
      }, {
        id: 2,
        type: 'artist',
        attributes: {
          name: 'grizzly bear',
          active: false,
          albums: [ 
            'yellow house', 
            'shields', 
            'veckatimest',
          ],
        },
      },],
    }

    test('it encodes an array of objects', () => {
      expect(output).toEqual(expected);
    });
  });

  // check post new situation
  describe('It doesnt panic encoding without an id', () => {
    const sampleObject = {
      name: 'tallest man on earth',
      active: true,
      albums: ['shallow graves', 'the dreamer ep', 'the wild hunt',],
    }

    const output = encode(sampleObject, 'artist');
    const expected = {
      data: {
        type: 'artist',
        attributes: {
          name: 'tallest man on earth',
          active: true,
          albums: [
            'shallow graves', 
            'the dreamer ep', 
            'the wild hunt',
          ],
        },
      },
    }

    test('it encodes a single object', () => {
      expect(output).toEqual(expected);
    });
  });
});