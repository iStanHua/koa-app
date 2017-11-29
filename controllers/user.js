User = require('../models/').User

module.exports = {
  index(req, res) {
    User.findAll()
      .then(function (Users) {
        res.status(200).json(Users);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  show(req, res) {
    User.findById(req.params.id)
      .then(function (User) {
        res.status(200).json(User);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  create(req, res) {
    User.create(req.body)
      .then(function (newUser) {
        res.status(200).json(newUser);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  update(req, res) {
    User.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(function (updatedRecords) {
        res.status(200).json(updatedRecords);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  },

  delete(req, res) {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function (deletedRecords) {
        res.status(200).json(deletedRecords);
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  }
};