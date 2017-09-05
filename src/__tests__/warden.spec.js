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
    };
    const local = {
      a: 25,
      b: 'b',
      c: true,
      d: ['a', 'b'],
      e: { f: 'f', g: 'g' },
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

  it('fails boolean primitive', () => {
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

  it('fails boolean primitive', () => {
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
};


describe('Warden', tests);
