exports.asyncForEach = async (array, callback) => {
  try {
    for (let idx = 0; idx < array.length; idx++) {
      await callback(array[idx], idx, array);
    }
  } catch (err) {
    console.error("Error during async iteration:", err?.message);
  }
};
