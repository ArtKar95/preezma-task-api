const { Router } = require('express');
const router = Router();
const Client = require('../schemas.js/clientSchema');
const { check, validationResult } = require('express-validator');

router.post(
  '/client',
  [
    check('email', 'Not valid email').isEmail(),
    check('name', 'Name can not be less than 3 simbols').isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Not valid data',
        });
      }

      const { name, email, phone, providers } = req.body;

      const condidate = await Client.findOne({ email });

      if (condidate) {
        return res
          .status(400)
          .json({ message: 'User with email address already exist' });
      }

      const client = new Client({ name, email, phone, providers });
      await client.save();
      res.status(200).json({ message: 'Client created', client });
    } catch (e) {
      res.status(500).json({ message: 'Something wrong, try later.' });
    }
  }
);

router.get(
  '/clients',

  async (req, res) => {
    try {
      const clients = await Client.find({});
      res.status(200).json(clients);
    } catch (e) {
      res.status(500).json({ message: 'Something wrong, try later.' });
    }
  }
);

router.get(
  '/client/:id',

  async (req, res) => {
    const { id } = req.params;

    try {
      const client = await Client.findById({ _id: id });
      if (client !== null) {
        await client.save();
        res.status(200).json(client);
      }
      return res
        .status(404)
        .json({ message: 'User with email address already exist' });
    } catch (e) {
      res.status(500).json({ message: 'Something wrong, try later.' });
    }
  }
);

router.put(
  '/client/:id',
  [
    check('email', 'Not valid email').isEmail(),
    check('name', 'Name can not be less than 3 simbols').isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Not valid data',
        });
      }

      const client = await Client.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
        }
      );

      client.save();
      res.status(200).json({ message: 'Client edited', client });
    } catch (e) {
      res.status(404).json({ message: 'Client not found' });
    }
  }
);

router.delete('/client/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndRemove({ _id: req.params.id });

    client.save();
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: 'Something wrong, try later.' });
  }
});

module.exports = router;
