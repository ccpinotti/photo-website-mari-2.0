console.log('May the node be with you')

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

const app = express();

var db

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
    }
  )
});
app.put('/quotes', (req, res) => {
  //fetch
  db.collection('quotes')
  //query
  .findOneAndUpdate({name: 'Yoda'}, {
    // update
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    // options
    sort: {_id: -1},
    upsert: true
    //callback
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.post('/quotes', (req, res) => {
  console.log(db)
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A Darth Vader got deleted'})
  })
})

MongoClient.connect('mongodb://cpinotti:Yankees1886@ds137206.mlab.com:37206/photo-mari-2', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});
