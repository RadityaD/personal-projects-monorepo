const db = require('./index.ts')

console.log('DB USERRR', process.env['DB_USER']);

// check connection
db.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
});

// app.get('/:id', (req, res, next) => {
//   db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, result) => {
//     if (err) {
//       return next(err)
//     }
//     res.send(result.rows[0])
//   })
// })
// ... many other routes in this file