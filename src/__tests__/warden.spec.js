import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import warden, { Types } from '../index';

chai.use(chaiAsPromised);

const tests = () => {

  // Unexpected Types

  it('fails on unexpected type', () => {
    const blueprint = {
      a: Types.String,
    };
    const local = {
      a: 25,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  // primitives

  it('supports primitives', () => {
    const blueprint = {
      a: Types.number,
      b: Types.string,
      c: Types.bool,
      d: Types.array,
      e: Types.shape,
      f: Types.func,
    };
    const local = {
      a: 25,
      b: 'b',
      c: true,
      d: ['a', 'b'],
      e: { f: 'f', g: 'g' },
      f: () => {},
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  // primitive fails

  it('fails string primitive', () => {
    const blueprint = {
      a: Types.number,
      b: Types.string,
    };
    const local = {
      a: 25,
      b: 25,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails number primitive', () => {
    const blueprint = {
      a: Types.number,
      b: Types.string,
    };
    const local = {
      a: 'a',
      b: 'b',
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails bool primitive', () => {
    const blueprint = {
      a: Types.string,
      b: Types.bool,
    };
    const local = {
      a: 'a',
      b: 25,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails func primitive', () => {
    const blueprint = {
      a: Types.string,
      b: Types.func,
    };
    const local = {
      a: 'a',
      b: 25,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails array primitive', () => {
    const blueprint = {
      a: Types.string,
      b: Types.array,
    };
    const local = {
      a: 'a',
      b: {},
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails shape primitive', () => {
    const blueprint = {
      a: Types.string,
      b: Types.shape,
    };
    const local = {
      a: 'a',
      b: [],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  // isRequired fail

  it('fails if isRequired was specified', () => {
    const blueprint = {
      a: Types.number,
      b: Types.string.isRequired,
    };
    const local = {
      a: 25,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  // arrayOf

  it('supports arrayOf string', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.string),
    };
    const local = {
      a: 'a',
      b: ['b', 'c'],
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  it('supports arrayOf number', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.number),
    };
    const local = {
      a: 'a',
      b: [12, 12],
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  it('supports nested arrayOf', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.shapeOf({
        c: Types.string,
        d: Types.number,
      })),
    };
    const local = {
      a: 'a',
      b: [
        {
          c: '12',
          d: 12,
        },
        {
          c: '12',
          d: 12,
        },
      ],
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  // arrayOf fails

  it('supports arrayOf string error', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.string),
    };
    const local = {
      a: 'a',
      b: [12, 12],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('supports arrayOf bool error', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.bool),
    };
    const local = {
      a: 'a',
      b: [12, 123],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('supports arrayOf func error', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.func),
    };
    const local = {
      a: 'a',
      b: [() => {}, 123],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails arrayOf strings when has number', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.string),
    };
    const local = {
      a: 'a',
      b: ['b', 12],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails arrayOf shape when has array', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.shape),
    };
    const local = {
      a: 'a',
      b: [[12], {}],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails arrayOf array when has object', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.array),
    };
    const local = {
      a: 'a',
      b: [[12], {}],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails arrayOf shapeOf with faulty types', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.shapeOf({
        c: Types.string,
        d: Types.array,
      })),
    };
    const local = {
      a: 'a',
      b: [
        {
          c: 'c',
          d: [1, 2, 3],
        },
        {
          c: 'c',
          d: {},
        },
      ],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails arrayOf arrayOf with faulty types', () => {
    const blueprint = {
      a: Types.string,
      b: Types.arrayOf(Types.arrayOf(Types.string)),
    };
    const local = {
      a: 'a',
      b: [['b'], ['b'], [1]],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails arrayOf arrayOf when data is not arrays', () => {
    const blueprint = {
      a: Types.arrayOf(Types.arrayOf(Types.string)),
    };
    const local = {
      a: ['true', 'fail'],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  // shapeOf

  it('supports shapeOf', () => {
    const blueprint = {
      a: Types.string,
      b: Types.shapeOf({}),
    };
    const local = {
      a: 'a',
      b: { c: 2, d: 4 },
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  it('supports nested shapeOf', () => {
    const blueprint = {
      a: Types.string,
      b: Types.shapeOf({
        c: Types.string,
        d: Types.number,
      }),
    };
    const local = {
      a: 'a',
      b: { c: '2', d: 4 },
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  it('supports nested shapeOf with isRequired', () => {
    const blueprint = {
      a: Types.string,
      b: Types.shapeOf({
        c: Types.string.isRequired,
        d: Types.number.isRequired,
        e: Types.bool,
        f: Types.bool.isRequired,
      }),
    };
    const local = {
      a: 'a',
      b: { c: '2', d: 4, f: true },
    };
    return warden(blueprint, local).then(r => expect(r).to.eql(local));
  });

  // shapeOf fails

  it('fails nested shapeOf with bad type', () => {
    const blueprint = {
      a: Types.string,
      b: Types.shapeOf({
        c: Types.string,
        d: Types.number,
      }),
    };
    const local = {
      a: 'a',
      b: { c: '2', d: '4' },
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails nested shapeOf with bad type level 2', () => {
    const blueprint = {
      a: Types.string,
      b: Types.shapeOf({
        c: Types.string,
        d: Types.shapeOf({
          e: Types.number,
        }),
      }),
    };
    const local = {
      a: 'a',
      b: {
        c: '2',
        d: {
          e: true,
        },
      },
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails isRequired inside of shapeOf', () => {
    const blueprint = {
      a: Types.shapeOf({
        b: Types.shapeOf({
          c: Types.string.isRequired,
        }),
      }),
    };
    const local = {
      a: {
        b: {
          d: 12,
        },
      },
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  // values() fails

  it('fails if value not coherent with Type', () => {
    const blueprint = {
      a: Types.string.values(['l', 12]),
    };
    const local = {
      a: 'd',
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if unsupported value in string', () => {
    const blueprint = {
      a: Types.string.values(['hello', 'hey']),
    };
    const local = {
      a: 'fail',
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if unsupported value in array', () => {
    const blueprint = {
      a: Types.array.values(['hello', 12, true]),
    };
    const local = {
      a: [false],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if unsupported value in shapeOf()', () => {
    const blueprint = {
      a: Types.shapeOf({
        b: Types.string,
        c: Types.number.isRequired.values([1, 2, 3]),
      }),
    };
    const local = {
      a: {
        b: 'b',
        c: 5,
      },
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if support value in shapeOf() but isRequired', () => {
    const blueprint = {
      a: Types.shapeOf({
        b: Types.string,
        c: Types.number.isRequired.values([1, 2, 3]),
      }),
    };
    const local = {
      a: {
        b: 'b',
      },
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if unsupported value in arrayOf() shapeOf()', () => {
    const blueprint = {
      a: Types.arrayOf(Types.shapeOf({
        b: Types.array.values([false, 42, 'hey']),
      })),
    };
    const local = {
      a: [
        {
          b: [42, false],
        },
        {
          b: [52, false, 'hey'],
        },
      ],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if values of arrayOf() are incoherent', () => {
    const blueprint = {
      a: Types.arrayOf(Types.string).values(['hey', 12]),
    };
    const local = {
      a: ['hey', 'fail'],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if value not present if arrayOf() values', () => {
    const blueprint = {
      a: Types.arrayOf(Types.string).values(['hey', 'hello']),
    };
    const local = {
      a: ['hey', 'fail'],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if value not present if arrayOf() of arrayOf() values', () => {
    const blueprint = {
      a: Types.arrayOf(Types.arrayOf(Types.string).values(['hello', 'test'])),
    };
    const local = {
      a: [['fail'], ['test']],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if values on primitive type inside arrayOf does not contain the value', () => {
    const blueprint = {
      a: Types.arrayOf(Types.string.values(['d'])),
    };
    const local = {
      a: ['a'],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if values in array inside arrayOf is not provided', () => {
    const blueprint = {
      a: Types.arrayOf(Types.array.values([true, 12, 'hey'])),
    };
    const local = {
      a: [[true], ['hey'], [13]],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  // min

  it('fails if min is not met', () => {
    const blueprint = {
      a: Types.number.min(5),
    };
    const local = {
      a: 4,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if max is not met', () => {
    const blueprint = {
      a: Types.number.max(5),
    };
    const local = {
      a: 6,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if range is not met part 1', () => {
    const blueprint = {
      a: Types.number.range(10, 15),
    };
    const local = {
      a: 5,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if range is not met part 2', () => {
    const blueprint = {
      a: Types.number.range(10, 15),
    };
    const local = {
      a: 16,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if range is met with faulty values', () => {
    const blueprint = {
      a: Types.number.values([12, 13]).range(10, 15),
    };
    const local = {
      a: 11,
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if range is not met in array of number', () => {
    const blueprint = {
      a: Types.arrayOf(Types.number.max(4)),
    };
    const local = {
      a: [5],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if range is met in array of number with faulty values', () => {
    const blueprint = {
      a: Types.arrayOf(Types.number.max(4)).values([2, 3]),
    };
    const local = {
      a: [1],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

  it('fails if range is not met in arrayOf(arrayOf(number)) ', () => {
    const blueprint = {
      a: Types.arrayOf(Types.arrayOf(Types.number.range(1, 5))),
    };
    const local = {
      a: [[1], [2], [3], [4, 5, 6]],
    };
    return expect(warden(blueprint, local)).to.be.rejectedWith();
  });

};


describe('Warden', tests);
