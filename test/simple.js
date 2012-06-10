var multipart     = require('../')
  , fs            = require('fs')
  , path          = require('path')
  , assert        = require('assert').ok
  , mp            = multipart.createMultipartStream()
  , mp2           = multipart.createMultipartStream()
  , file

// Comment for logging.
console.log       = function () {}

var PROJECTDIR    = path.resolve(path.join(__dirname, '..'))

var EXPECTED      = fs.readFileSync(
      PROJECTDIR + '/test/fixtures/simple-expected.txt'
    , 'utf8'
    )
var OUTPUTFILE    = PROJECTDIR + '/test/fixtures/simple.out'
var OUTPUTSTREAM  = fs.createWriteStream(OUTPUTFILE)

mp.pipe(OUTPUTSTREAM)

mp.writeForm(
  { data    :
    { key   : 'value'
    , test  : 'ing'
    }
  }
, function () {
    console.log('FORMWRITTEN')
  }
)

mp.write(
  { 'Content-Disposition' : 'form-data; name="files"'
  , 'Content-Type'        : mp2.contentType(mp)
  }
, mp2
, function () {
    console.log('FILESWRITTEN')
  }
)

mp2.writeFile({ filename : PROJECTDIR + '/test/fixtures/simple-file.txt' }, function () {
  console.log('FILEWRITTEN')
})

mp2.end(function () {
  console.log('DONE2')
})

mp.end(function () {
  console.log('DONE')
  // Assert the output is what we are expecting.
  var output  = fs.readFileSync(OUTPUTFILE, 'utf8')
  var error   = null

  try {
    assert(EXPECTED == output)
  } catch (err) {
    error = err
  }

  fs.unlink(OUTPUTFILE)

  if (error) {
    throw error
  }
})
