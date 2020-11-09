const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://Julia:92eqMJIDuktTc3tx@cluster0.atmea.mongodb.net/shop?retryWrites=true&w=majority', { useUnifiedTopology: true })
      .then(client => {
        console.log('Connected');
          _db = client.db();
        callback(client);
      })
      .catch( err => {
          console.log(err);
          throw err;
      });
};

const getDB = () => {
    if(_db){
        return _db;
    }
    throw 'No database found'
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;