module.exports = createMiddlewarePipeline = (...fns) => (...args) => {
  const getNext = (i) => {
    if (i + 1 >= fns.length) return () => {};
    return () => fns[i + 1](...args, getNext(i + 1));
  };

  fns[0](...args, getNext(0));
};
