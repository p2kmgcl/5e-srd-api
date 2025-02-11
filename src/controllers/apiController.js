import Collection from '../models/collection/index.js';

export const index = async (req, res, next) => {
  try {
    const data = await Collection.find({})
      .select({ index: 1, _id: 0 })
      .sort({ index: 'asc' })
      .exec();

    const apiIndex = {};
    data.forEach(item => {
      if (item.index === 'levels') return;

      apiIndex[item.index] = `/api/${item.index}`;
    });

    return res.status(200).json(apiIndex);
  } catch (err) {
    next(err);
  }
};
