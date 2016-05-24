import chai from 'chai';
import CharacterSkill from '../lib/Character/CharacterSkill';
const assert = chai.assert;

describe('CharacterSkill', function () {
  let characterStub;
  let cs;
  const LEVEL = 2;
  const ATTR = 'body';
  const BODY_LEVEL = 7;

  beforeEach(() => {
    characterStub = {
      body: BODY_LEVEL
    };
    cs = new CharacterSkill(characterStub, 'running', ATTR, LEVEL);
  });

  describe('.attr', function () {
    it('should be set', function () {
      assert.equal(cs.attr, ATTR, 'it has the attribute body');
    });

    it('rejects bad attributes', function () {
      assert.throws(() => {
          let badCs = new CharacterSkill(characterStub, 'flubbing', 'flub', 0); // eslint-disable-line no-unused-vars
        }, 'attempt to set non-existant attribute flub'
      );
    });
  });

  describe('.level', function () {
    it('should be set', function () {
      assert.equal(cs.level, LEVEL, 'it has the right level');
    });

    it('rejects bad values', function () {
      assert.throws(() => {
        let badCs = new CharacterSkill(characterStub, 'flubbing', ATTR, 'flub'); // eslint-disable-line no-unused-vars
      }, 'attempt to set level to bad value flub');
    });
  });

  it('.rank', function () {
    assert.equal(cs.rank, LEVEL + BODY_LEVEL, 'rank is the sum of attr & body level');
  });
});
