const express = require('express')
const app = express()
const Sequelize = require('sequelize')
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})

const port = 4000
app.listen(port, () => `Listening on port ${port}`)

const House = sequelize.define('house', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    size: Sequelize.INTEGER,
    price: Sequelize.INTEGER
  }, {
    tableName: 'houses'
  })
  
  House.sync() // this creates the houses table in your database when your app starts

  app.get('/houses', function (req, res, next) {
    House.findAll()
      .then(houses => {
        res.json({ houses: houses })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
  })

  app.get('/houses/:id', function (req, res, next) {
    const id = req.params.id
    House.findById(id)
      .then(house => {
        res.json({ house: house })
      })
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
  })

  const bodyParser = require('body-parser')
    app.use(bodyParser.json())
  app.post('/houses', function (req, res) {
      console.log(req.body)
    House
    
      .create(req.body)
      .then(house => 
        res.status(201).json({
            house,
            message: 'House added'
        }))
      .catch(err => {
        res.status(500).json({
          message: 'Something went wrong',
          error: err
        })
      })
  })

  app.put('/houses/:id', function (req, res) {
    const id = req.params.id
    House
        .findById(id)
        .then(house => {
            if (!house){
                return res.status(404).send({
                    message: 'House Not Found',
                })      
            }
            return house
                .update({
                    title: req.body.title,
                    description: req.body.description,
                    size: req.body.size,
                    price: req.body.price
                })
                .then(() => res.status(200).send(house))  // Send back the updated house.
                .catch((error) => res.status(400).send(error))
        })
        .catch(err => {
            res.status(500).json({
            message: 'Something went wrong',
            error: err
            })
        })
  })

  app.delete('/houses/:id', function (req, res) {
    const id = req.params.id
    House
        .findById(id)
        .then(house => {
            if (!house){
                return res.status(404).send({
                    message: 'House Not Found',
                })      
            }
            return house
                .destroy()
                .then(() => res.status(204).send())
                .catch((error) => res.status(400).send(error))
        })
        .catch(err => {
            res.status(500).json({
            message: 'Something went wrong',
            error: err
            })
        })
  })