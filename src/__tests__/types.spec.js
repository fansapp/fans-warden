import { expect } from 'chai';
import { Types } from '../index';

const tests = () => {

  // primitives

  it('reflect string type', () => {
    expect(Types.string.type).to.eql('string');
  });

  it('reflect number type', () => {
    expect(Types.number.type).to.eql('number');
  });

  it('reflect boolean type', () => {
    expect(Types.bool.type).to.eql('bool');
  });

  it('reflect array type', () => {
    expect(Types.array.type).to.eql('array');
  });

  it('reflect shape type', () => {
    expect(Types.shape.type).to.eql('shape');
  });

  it('reflect shape type', () => {
    expect(Types.func.type).to.eql('func');
  });

  // primitives fail

  it('reflect non required state', () => {
    expect(Types.string.required).to.eql(false);
  });

  it('reflect required state', () => {
    expect(Types.string.isRequired.required).to.eql(true);
  });

  // advanced

  it('reflect arrayOf string', () => {
    expect(Types.arrayOf(Types.string).of.type).to.eql('string');
  });

  it('reflect arrayOf number', () => {
    expect(Types.arrayOf(Types.number).of.type).to.eql('number');
  });

  it('reflect arrayOf boolean', () => {
    expect(Types.arrayOf(Types.bool).of.type).to.eql('bool');
  });

  it('reflect arrayOf shape', () => {
    expect(Types.arrayOf(Types.shape).of.type).to.eql('shape');
  });

  it('reflect arrayOf func', () => {
    expect(Types.arrayOf(Types.func).of.type).to.eql('func');
  });

  it('reflect arrayOf array', () => {
    expect(Types.arrayOf(Types.array).of.type).to.eql('array');
  });

  it('reflect empty arrayOf falling back to array', () => {
    expect(Types.arrayOf(Types.fail).type).to.eql('array');
  });

  it('reflect empty shapeOf falling back to shape', () => {
    expect(Types.shapeOf(Types.fail).type).to.eql('shape');
  });

  it('reflect shapeOf object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(Types.shapeOf(obj).of).to.eql(obj);
  });

  // advanded fails

  it('reflect arrayOf with faulty Type', () => {
    expect(() => Types.arrayOf('fail')).to.throw();
  });

  it('reflect shapeOf with faulty Type', () => {
    expect(() => Types.shapeOf('fail')).to.throw();
  });

  // values

  it('reflect values ', () => {
    const values = ['hello', 'hey'];
    expect(Types.string.values(values).vals).to.eql(values);
  });

  it('reflect values used with isRequired first', () => {
    const values = ['hello', 'hey'];
    expect(Types.string.isRequired.values(values).vals).to.eql(values);
  });

  it('reflect values used with isRequired second', () => {
    const values = ['hello', 'hey'];
    expect(Types.string.values(values).isRequired.vals).to.eql(values);
  });

  it('reflect values and isRequired have no specific order to work part 1', () => {
    expect(Types.string.values(['hello', 'hey']).isRequired.required).to.eql(true);
  });

  it('reflect values and isRequired have no specific order to work part 2', () => {
    expect(Types.string.isRequired.values(['hello', 'hey']).required).to.eql(true);
  });

  it('reflect an error when values is passed something different than an array', () => {
    expect(() => Types.string.values('fail')).to.throw();
  });

  // min

  it('reflect min', () => {
    expect(Types.number.min(12).minValue).to.eql(12);
  });

  it('reflect min with isRequired first', () => {
    expect(Types.number.min(12).minValue).to.eql(12);
  });

  it('reflect min with isRequired second', () => {
    expect(Types.number.min(12).isRequired.minValue).to.eql(12);
  });

  it('reflect min with values first', () => {
    expect(Types.number.values([1, 2, 3]).min(12).isRequired.minValue).to.eql(12);
  });

  it('reflect min with values last', () => {
    expect(Types.number.min(12).isRequired.values([1, 2, 3]).minValue).to.eql(12);
  });

  it('reflect error if min missing argument', () => {
    expect(() => Types.number.min()).to.throw();
  });

  // max

  it('reflect max', () => {
    expect(Types.number.max(12).maxValue).to.eql(12);
  });

  it('reflect max with isRequired first', () => {
    expect(Types.number.max(12).maxValue).to.eql(12);
  });

  it('reflect max with isRequired second', () => {
    expect(Types.number.max(12).isRequired.maxValue).to.eql(12);
  });

  it('reflect max with values first', () => {
    expect(Types.number.values([1, 2, 3]).max(12).isRequired.maxValue).to.eql(12);
  });

  it('reflect max with values last', () => {
    expect(Types.number.max(12).isRequired.values([1, 2, 3]).maxValue).to.eql(12);
  });

  it('reflect error if max missing argument', () => {
    expect(() => Types.number.maxValue()).to.throw();
  });

  // range

  it('reflect range max', () => {
    expect(Types.number.range(11, 12).maxValue).to.eql(12);
  });

  it('reflect range min', () => {
    expect(Types.number.range(11, 12).minValue).to.eql(11);
  });

  it('reflect error if range missing argument part 1', () => {
    expect(() => Types.number.range()).to.throw();
  });

  it('reflect error if range missing argument part 1', () => {
    expect(() => Types.number.range(1)).to.throw();
  });
};


describe('Types', tests);
