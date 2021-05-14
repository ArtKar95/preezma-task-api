const { Router } = require('express');
const router = Router();
const Provider = require('../schemas/providerSchema');
const { check, validationResult } = require('express-validator');

router.post(
  '/provider',
  [check('name', 'Name can not be less than 3 simbols').isLength({ min: 3 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Not valid Name',
        });
      }

      const { name } = req.body;

      const isExistname = await Provider.findOne({ name });

      if (isExistname) {
        return res
          .status(400)
          .json({ message: 'Provider with that name already exist' });
      }

      const provider = new Provider({ name });
      await provider.save();
      res
        .status(200)
        .json({ message: 'Provider created successfully', provider });
    } catch (e) {
      res.status(500).json({ message: 'Something wrong, try later.' });
    }
  }
);

router.get(
  '/providers',

  async (req, res) => {
    try {
      const providers = await Provider.find({});
      res.status(200).json(providers);
    } catch (e) {
      res.status(500).json({ message: 'Something wrong, try later.' });
    }
  }
);

router.get(
  '/provider/:id',

  async (req, res) => {
    const { id } = req.params;

    try {
      const provider = await Provider.findById({ _id: id });

      await provider.save();
      res.status(200).json(provider);
    } catch (e) {
      res.status(500).json({ message: 'Something wrong, try later.' });
    }
  }
);

router.put(
  '/provider/:id',
  [check('name', 'Name can not be less than 3 simbols').isLength({ min: 3 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Not valid name',
        });
      }

      const provider = await Provider.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );

      provider.save();
      res.status(200).json({ message: 'Provider edited', provider });
    } catch (e) {
      res.status(404).json({ message: 'Provider not found' });
    }
  }
);

router.delete('/provider/:id', async (req, res) => {
  try {
    const provider = await Provider.findByIdAndRemove({ _id: req.params.id });

    provider.save();
    res.status(200).json({ message: 'Deleted successfully', provider });
  } catch (e) {
    res.status(500).json({ message: 'Something wrong, try later.' });
  }
});

module.exports = router;
