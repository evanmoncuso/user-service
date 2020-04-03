import { createUser } from '../../src/routes/users';

describe('Routes | Users | createUser', () => {
  describe('The basics are correct', () => {
    test('it exists', () => {
      expect(!!createUser).toBeDefined();
    });
  
    test('it is a function', () => {
      expect(typeof createUser).toBe('function')
    });
  });
})