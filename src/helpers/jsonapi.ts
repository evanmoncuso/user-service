type ID = string | number | null

interface JSONAPIShell {
  data?: JSONAPIElement[] | JSONAPIElement;
  errors?: object;
  meta?: object;
}

interface JSONAPIElement {
  type: string;
  id: ID;
  attributes: object;
}

function decodeElement<T>(element: JSONAPIElement): T {
  if (!element.id) element.id = null;

  const output = {
    id: element.id || null,
    ...element.attributes,
  }

  return output;
}

/**
 * decode takes a JSONAPI payload and transforms it into a normal JS object
 * @param {object} payload - JSONAPI object
 * @returns {object | object[]} - corresponding object or array of objects
 */
export function decode<T>(payload: JSONAPIShell): T | T[] {
  // ignore "type" for now
  if (!payload.data) {
    throw new Error('No "data" property on object to decode');
  }

  if (Array.isArray(payload.data)) {
    return payload.data.map((element) => decodeElement<T>(element));
  }

  return decodeElement<T>(payload.data);
}




function encodeElement(element: { [ key: string ]: any }, type: string, userUUID?: boolean): JSONAPIElement {
  const output = {
    id: userUUID ? element.uuid : element.id,
    type,
    attributes: {},
  }

  delete element.id;

  if (userUUID) delete element.uuid;

  output.attributes = { ...element, }

  return output;
}

interface EncodingOptions {
  meta?: object;
  useUUID?: boolean;
}

/**
 * encode takes a normal object or list of objects and converts it into simple JSONAPI format
 * @param
 */
export function encode(source: object | object[], type: string, { meta, useUUID, }: EncodingOptions): JSONAPIShell {
  const output: JSONAPIShell = {}

  if (Array.isArray(source)) {
    output.data = source.map((e) => encodeElement(e, type), useUUID);
  } else {
    output.data = encodeElement(source, type, useUUID);
  }

  if (meta) {
    output.meta = meta;
  }

  return output;
}