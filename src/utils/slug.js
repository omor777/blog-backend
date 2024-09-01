const generateSlug = (str) => {
  return str.toLowerCase().replace(/[^\w-]+/g, "-");
};

export { generateSlug };
