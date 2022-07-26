/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  element(value) {
    if (this.lpseudoElement || this.lpseudoClass || this.lattr || this.lclass || this.lid) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    if (this.lelement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    return { lelement: value, ...this };
  },

  id(value) {
    if (this.lpseudoElement || this.lpseudoClass || this.lattr || this.lclass) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    if (this.lid) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    return { lid: value, ...this };
  },

  class(value) {
    if (this.lpseudoElement || this.lpseudoClass || this.lattr) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    const res = { ...this };
    if (res.lclass) {
      res.lclass.push(value);
    } else res.lclass = [value];
    return res;
  },

  attr(value) {
    if (this.lpseudoClass || this.lpseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    return { lattr: value, ...this };
  },

  pseudoClass(value) {
    if (this.lpseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    const res = { ...this };
    if (res.lpseudoClass) {
      res.lpseudoClass.push(value);
    } else res.lpseudoClass = [value];
    return res;
  },

  pseudoElement(value) {
    if (this.lpseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    return { lpseudoElement: value, ...this };
  },

  combine(selector1, combinator, selector2) {
    return { values: [selector1, combinator, selector2], ...this };
  },
  stringify() {
    let res = '';
    if (this.values) {
      res += [...this.values].map((el) => ((typeof el === 'string') ? el : el.stringify())).join(' ');
    } else {
      if (this.lelement) res += this.lelement;
      if (this.lid) res += `#${this.lid}`;
      if (this.lclass) res += `${this.lclass.reduce((prev, cur) => prev.concat(`.${cur}`), '')}`;
      if (this.lattr) res += `[${this.lattr}]`;
      if (this.lpseudoClass) res += `${this.lpseudoClass.reduce((prev, cur) => prev.concat(`:${cur}`), '')}`;
      if (this.lpseudoElement) res += `::${this.lpseudoElement}`;
    }
    return res;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
