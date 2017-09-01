import { expect } from 'chai';
import { Types } from '../index';

const tests = () => {

  // primitives

  it('reflect string type', () => {
    expect(Types.string().type).to.eql('string');
  });

  it('reflect number type', () => {
    expect(Types.number().type).to.eql('number');
  });

  it('reflect boolean type', () => {
    expect(Types.bool().type).to.eql('bool');
  });

  it('reflect array type', () => {
    expect(Types.array().type).to.eql('array');
  });

  it('reflect shape type', () => {
    expect(Types.shape().type).to.eql('shape');
  });

  // primitives fail

  it('reflect non required state', () => {
    expect(Types.string().required).to.eql(false);
  });

  it('reflect non required state', () => {
    expect(Types.string().isRequired().required).to.eql(true);
  });

  // advanced

  it('reflect arrayOf string', () => {
    expect(Types.arrayOf(Types.string)().of().type).to.eql('string');
  });

  it('reflect arrayOf number', () => {
    expect(Types.arrayOf(Types.number)().of().type).to.eql('number');
  });

  it('reflect arrayOf boolean', () => {
    expect(Types.arrayOf(Types.bool)().of().type).to.eql('bool');
  });

  it('reflect arrayOf shape', () => {
    expect(Types.arrayOf(Types.shape)().of().type).to.eql('shape');
  });

  it('reflect arrayOf array', () => {
    expect(Types.arrayOf(Types.array)().of().type).to.eql('array');
  });

  it('reflect shapeOf object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(Types.shapeOf(obj)().of).to.eql(obj);
  });

  // advanced failed

  it('reflect missing parameter to arrayOf', () => {
    expect(() => Types.arrayOf(Types.fail)().of).to.throw();
  });
};


describe('Types', tests);
