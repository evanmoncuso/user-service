type ID = string | number

interface JSONAPIShell {
  data?: JSONAPIElement[] | JSONAPIElement,
  errors?: object,
  meta?: object,
}

interface JSONAPIElement {
  type: string,
  id: ID
  attributes: object,
}

function decodeElement(element: JSONAPIElement): object {
  const output = {
    id: element.id,
    ...element.attributes,
  }

  return output;
}

/**
 * decode takes a JSONAPI payload and transforms it into a normal JS object
 * @param {object} payload - JSONAPI object
 * @returns {object | object[]} - corresponding object or array of objects
 */
export function decode(payload: JSONAPIShell): object | object[] {
  // ignore "type" for now

  if (Array.isArray(payload.data)) {
    return payload.data.map((element) => decodeElement(element));
  }

  return decodeElement(payload.data);
}

function encodeElement(element: { [ key: string ]: any }, type: string): JSONAPIElement {
  const output = {
    id: element.id,
    type,
    attributes: {}
  }

  delete element.id

  output.attributes = { ...element }

  return output;
}

/**
 * encode takes a normal object or list of objects and converts it into simple JSONAPI format
 * @param
 */
export function encode(source: object | object[], type: string, meta?: object): JSONAPIShell {
  const output: JSONAPIShell = {}

  if (Array.isArray(source)) {
    output.data = source.map((e) => encodeElement(e, type));
  } else {
    output.data = encodeElement(source, type);
  }

  if (meta) {
    output.meta = meta;
  }

  return output;
}