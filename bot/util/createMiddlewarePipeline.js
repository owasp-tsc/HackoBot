module.exports = createMiddlewarePipeline = (...fns) => (...args) => {
  const getNext = (i, b) => {
    if (i + 1 >= fns.length) return (arg1, arg2) => {};
    return () => fns[i + 1](...args, getNext(i + 1));
  };

  fns[0](...args, getNext(0));
};
