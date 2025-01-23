module.exports = new Proxy(
  {},
  {
    get: function getter(target, key) {
      // Return the property name as a string if it exists
      // This way importing .scss files will work with CSS modules
      return key;
    },
  },
);
