type ID = string | number

interface JSONAPIShell {
  data: JSONAPIElement[] | JSONAPIElement,
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
    ...element.attributes 
  }

  return output;
}

/**
 * decode takes a JSONAPI payload and transforms it into a normal JS object
 * @param {object} payload - JSONAPI object
 * @returns {object | object[]} - corresponding object or array of objects
 */
export function decode(payload: JSONAPIShell): object | object[] {
  // discard "type" for now

  if (Array.isArray(payload.data)) {
    return payload.data.map((element) => decodeElement(element));
  }

  return decodeElement(payload.data);
}

export function encode(): string {
  return 'encode';
}