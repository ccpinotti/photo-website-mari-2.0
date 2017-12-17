console.log('May the node be with you');

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const multer  = require('multer');
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs-extra');

const app = express();
const upload = multer({ limits: { fileSize: 2000000 }, dest: __dirname + '/uploads/' })

let db;

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

app.get('/photos', (req, res) => {
  db.collection('photos').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('photos.ejs', {quotes: result})
    }
  )
});

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

app.delete('/quotes', (req, res) => {
  console.log("delete")
  db.collection('quotes').findOneAndDelete({_id: new ObjectId(req.body.id)},
  (err, result) => {
    if (err) return res.send(500, err)
    console.log(err, result)
    res.send({message: 'A Darth Vader got deleted'})
  })
})


// Form POST action handler
app.post('/uploadpicture', upload.single('picture'), function (req, res){
  if (req.file == null) {
    // If Submit was accidentally clicked with no file selected...
    res.render('index', { title:'Please select a picture file to submit!' });
  } else {
    // read the img file from tmp in-memory location
    var newImg = fs.readFileSync(req.file.path);
    // encode the file as a base64 string.
    var encImg = newImg.toString('base64');
    // define your new document
    var newItem = {
      description: req.body.description,
      contentType: req.file.mimetype,
      size: req.file.size,
      img: Buffer(encImg, 'base64')
    };

    db.collection('photos')
      .insert(newItem, function(err, result){
        if (err) { console.log(err); };
        var newoid = new ObjectId(result.ops[0]._id);
        fs.remove(req.file.path, function(err) {
          if (err) { console.log(err) };
          res.render('photos.ejs', { flash: 'Thanks for the Picture!' });
          });
      });
    }
  });

MongoClient.connect('mongodb://cpinotti:Yankees1886@ds137206.mlab.com:37206/photo-mari-2', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
});
