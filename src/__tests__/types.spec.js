import { expect } from 'chai';
import { Types } from '../index';

const tests = () => {
  it('reflect string type', () => {
    expect(Types.string().type).to.eql('string');
  });

  it('reflect number type', () => {
    expect(Types.number().type).to.eql('number');
  });

  it('reflect boolean type', () => {
    expect(Types.bool().type).to.eql('boolean');
  });

  it('reflect array type', () => {
    expect(Types.array().type).to.eql('object');
  });

  it('reflect shape type', () => {
    expect(Types.shape().type).to.eql('object');
  });


  it('reflect non required state', () => {
    expect(Types.string().required).to.eql(false);
  });

  it('reflect non required state', () => {
    expect(Types.string().isRequired().required).to.eql(true);
  });


};


describe('Types', tests);
