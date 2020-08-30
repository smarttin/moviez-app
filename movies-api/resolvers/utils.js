const jwt = require('jsonwebtoken');
const APP_SECRET = 'my_App_SECRET';

function getUserId(context) {
  const authorization = context.req.headers['authorization'];
  try {
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const user = jwt.verify(token, APP_SECRET);
      return user.id;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

const mapAttributes = (model, { fieldNodes }) => {
  // get the fields of the Model (columns of the table)
  const columns = new Set(Object.keys(model.rawAttributes));
  // get nested attributes for each selection set
  const nested_attributes = selectionSet =>
    (selectionSet &&
      selectionSet.selections &&
      selectionSet.selections.reduce(
        (acc, { name: { value }, selectionSet }) =>
          new Set([...acc, value, ...nested_attributes(selectionSet)]),
        new Set()
      )) ||
    [];
  const requested_attributes = nested_attributes(fieldNodes[0].selectionSet);
  // filter the attributes against the columns
  return [...requested_attributes].filter(attribute => columns.has(attribute));
};

module.exports = {
  getUserId,
  APP_SECRET,
  mapAttributes
};
