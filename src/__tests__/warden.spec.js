import { expect } from 'chai';

import warden, { Types } from '../index';

const tests = () => {
  it('supports primitives', () => {
    const blueprint = {
      age: Types.number,
      name: Types.string,
      isNiceGuy: Types.bool,
      qualities: Types.array,
      defects: Types.shape,
    };
    const local = {
      age: 25,
      name: 'justin',
      isNiceGuy: true,
      qualities: ['good at Guitar Hero', 'canBackflip'],
      defects: { no1: 'badly judges coffee temperature', no2: 'tendency to burn eggs' },
    };
    expect(warden(blueprint, local)).to.eql(true);
  });

  it('fails string primitive', () => {
    const blueprint = {
      age: Types.number,
      name: Types.string,
    };
    const local = {
      age: 25,
      name: 25,
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

  it('fails number primitive', () => {
    const blueprint = {
      age: Types.number,
      name: Types.string,
    };
    const local = {
      age: 'fail',
      name: 'justin',
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

  it('fails boolean primitive', () => {
    const blueprint = {
      name: Types.string,
      isNiceGuy: Types.bool,
    };
    const local = {
      name: 'justin',
      isNiceGuy: 25,
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

  it('fails boolean primitive', () => {
    const blueprint = {
      name: Types.string,
      isNiceGuy: Types.bool,
    };
    const local = {
      name: 'justin',
      isNiceGuy: 25,
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

  it('fails array primitive', () => {
    const blueprint = {
      name: Types.string,
      qualities: Types.array,
    };
    const local = {
      name: 'justin',
      qualities: {},
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

  it('fails shape primitive', () => {
    const blueprint = {
      name: Types.string,
      defects: Types.shape,
    };
    const local = {
      name: 'justin',
      defects: [],
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

  it('fails if isRequired was specified', () => {
    const blueprint = {
      age: Types.number,
      name: Types.string.isRequired,
    };
    const local = {
      age: 25,
    };
    expect(() => warden(blueprint, local)).to.throw();
  });

};


describe('Warden', tests);
