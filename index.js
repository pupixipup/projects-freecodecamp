var express = require('express');
var cors = require('cors');
const multer  = require('multer');
require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const storage = multer.memoryStorage()

const uploadStorage = multer({ storage: storage })

app.post('/api/fileanalyse', uploadStorage.single("upfile"), (req,res) => {
  const { originalname, mimetype, size } = req.file
  res.json({name: originalname, type: mimetype, size })
})




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
