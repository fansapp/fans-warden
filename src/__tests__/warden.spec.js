import { expect } from 'chai';

import warden, { Types } from '../index';

const tests = () => {

  // primitives

  // it('supports primitives', () => {
  //   const blueprint = {
  //     age: Types.number,
  //     name: Types.string,
  //     isNiceGuy: Types.bool,
  //     qualities: Types.array,
  //     defects: Types.shape,
  //   };
  //   const local = {
  //     age: 25,
  //     name: 'justin',
  //     isNiceGuy: true,
  //     qualities: ['good at Guitar Hero', 'canBackflip'],
  //     defects: { no1: 'badly judges coffee temperature', no2: 'tendency to burn eggs' },
  //   };
  //   expect(warden(blueprint, local)).to.eql(true);
  // });

  // // primitive fails

  // it('fails string primitive', () => {
  //   const blueprint = {
  //     age: Types.number,
  //     name: Types.string,
  //   };
  //   const local = {
  //     age: 25,
  //     name: 25,
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails number primitive', () => {
  //   const blueprint = {
  //     age: Types.number,
  //     name: Types.string,
  //   };
  //   const local = {
  //     age: 'fail',
  //     name: 'justin',
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails boolean primitive', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     isNiceGuy: Types.bool,
  //   };
  //   const local = {
  //     name: 'justin',
  //     isNiceGuy: 25,
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails boolean primitive', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     isNiceGuy: Types.bool,
  //   };
  //   const local = {
  //     name: 'justin',
  //     isNiceGuy: 25,
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails array primitive', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.array,
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: {},
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails shape primitive', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     defects: Types.shape,
  //   };
  //   const local = {
  //     name: 'justin',
  //     defects: [],
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // // isRequired fail

  // it('fails if isRequired was specified', () => {
  //   const blueprint = {
  //     age: Types.number,
  //     name: Types.string.isRequired,
  //   };
  //   const local = {
  //     age: 25,
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // // arrayOf

  // it('supports arrayOf string', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.string),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: ['hey', 'wassup'],
  //   };
  //   expect(warden(blueprint, local)).to.eql(true);
  // });

  // it('supports arrayOf number', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.number),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: [12, 12],
  //   };
  //   expect(warden(blueprint, local)).to.eql(true);
  // });


  // it('supports arrayOf string error', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.string),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: [12, 12],
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('supports arrayOf string error', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.bool),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: [12, 123],
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // // arrayOf fails

  // it('fails arrayOf strings when has number', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.string),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: ['hello', 12],
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails arrayOf shape when has array', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.shape),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: [[12], {}],
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  // it('fails arrayOf array when has object', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     qualities: Types.arrayOf(Types.array),
  //   };
  //   const local = {
  //     name: 'justin',
  //     qualities: [[12], {}],
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });


  // // shapeOf

  // it('supports shapeOf', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     defects: Types.shapeOf({}),
  //   };
  //   const local = {
  //     name: 'justin',
  //     defects: {a: 2, b: 4 },
  //   };
  //   expect(warden(blueprint, local)).to.eql(true);

  // });

  // it('supports nested shapeOf', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     defects: Types.shapeOf({
  //       a: Types.string,
  //       b: Types.number,
  //     }),
  //   };
  //   const local = {
  //     name: 'justin',
  //     defects: { a: '2', b: 4 },
  //   };
  //   expect(warden(blueprint, local)).to.eql(true);
  // });


  // // shapeOf fails

  // it('fails nested shapeOf with bad type', () => {
  //   const blueprint = {
  //     name: Types.string,
  //     defects: Types.shapeOf({
  //       a: Types.string,
  //       b: Types.number,
  //     }),
  //   };
  //   const local = {
  //     name: 'justin',
  //     defects: {a: '2', b: '4' },
  //   };
  //   expect(() => warden(blueprint, local)).to.throw();
  // });

  it('fails nested shapeOf with bad type level 2', () => {
    const blueprint = {
      name: Types.string,
      defects: Types.shapeOf({
        a: Types.string,
        b: Types.shapeOf({
          c: Types.number.isRequired,
        }),
      }),
    };
    const local = {
      name: 'justin',
      defects: {
        a: '2',
        b: {
          c: 155,
        },
      },
    };
    expect(warden(blueprint, local)).to.eql(true);
  });
};


describe('Warden', tests);
