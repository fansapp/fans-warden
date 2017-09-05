# fans-warden

A promise based 'React PropType' inspired JavaScript object validator.

## Getting started

```
npm install --save fans-warden
```

## Usage

Here is a cookie cutter example on how to use **fans-warden**:

```js
import Warden, { Types } from 'fans-warden';

const rules = {
  prop1: Types.string,
  prop2: Types.bool.isRequired,
  prop3: Types.shapeOf({
    prop4: Types.array,
    prop5: Types.number,
  }),
  prop6: Types.arrayOf(Types.number).isRequired,
  prop7: Types.arrayOf(Types.shapeOf({
    prop8: Types.string.isRequired,
    prop9: Types.number.isRequired,
  })),
  prop10: Types.shape,
};

const data = {...}; // the data you want to validate based on your rules

Warden(rules, data).then((r) => {
  console.log(`The ${r} object is valid :)`);
}).catch((e) => {
  console.log(`The validation failed for this reason: ${e}`);
});
```

## Types

The different **Types** available for use are the following:

- `Types.string`
- `Types.number`
- `Types.bool`
- `Types.array`
- `Types.shape`
- `Types.arrayOf()`
- `Types.shapeOf()`

By adding `.isRequired` at the end of the rule (ex: `Types.string.isRequired`), the validation will now fail if the property is not present in the object to validate.

### `Types.arrayOf()`

`Types.arrayOf()` takes an argument, which needs to be any possible `Type` (even `Types.arrayOf()`). The validation will fail if the array contains an element having a different type than the provided `Type`.

*see example above*

### `Types.shapeOf()`

`Types.shapeOf()` takes an argument, which needs to be an `object` (`{}`). This object can implement keys with additional rules that you want to apply, making a deep validation.

*see example above*
