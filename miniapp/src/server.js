const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


require('events').EventEmitter.defaultMaxListeners = 0;
const mysql = require("mysql2");
const conn = mysql.createPool({
  connectionLimit: 2,
  host: "localhost",
  user: "root",
  database: "urlYourApp",
  password: "pass"
});

app.get('/users', (req, res) => {
  const name = req.query.name;
  conn.query('SELECT * FROM users WHERE tg = ?', [name], (err, results) => {
    if (err) {
      console.error('Ошибка при выполнении запроса');
      res.status(500).send('Ошибка сервера');
      return;
    }
    res.json(results);
  });
});

app.get('/burn', (req, res) => {
  const name = req.query.name;
  const kolvo = req.query.amount;
  if (isNaN(kolvo)) {
    res.json('must be a number');
    return;
  }
  conn.query('SELECT * FROM users WHERE tg = ?', [name], (err, results) => {
    if (err) {
      console.error('Ошибка при выполнении запроса');
      res.status(500).send('Ошибка сервера');
      return;
    }
    if (results.length == 0) {
      res.status(404).send('Пользователь не найден');
      return;
    }
    if(results[0].balance < kolvo){
      res.json('NO ENOUGH $METRO');
      return;
    }else{
      conn.query(`UPDATE users SET balance = balance - ${kolvo}, burn = burn + ${kolvo} WHERE tg = ?`, [name], (err, results) => {
        if (err) {
          console.error('Ошибка при обновлении баланса');
          res.status(500).send('Ошибка сервера при обновлении баланса');
          return;
        }
        res.json('$METRO BURNED!');
      });
    }
  });
});

app.get('/refusers', (req, res) => {
  const name = req.query.name;
  //conn.query('SELECT *, UNIX_TIMESTAMP() as timenow FROM users WHERE tg = ?', [name], (err, results) => {
  conn.query('SELECT * FROM users WHERE invited = ?', [name], (err, results) => {
    if (err) {
      console.error('Ошибка при выполнении запроса');
      res.status(500).send('Ошибка сервера');
      return;
    }

    res.json(results);
  });
});

app.get('/time', (req, res) => {
  const name = req.query.name;

  conn.query('SELECT time, b1, b2, b3, invited FROM users WHERE tg = ?', [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
  if(Math.floor(Date.now() / 1000) - results[0].time >= ((9 - results[0].b3) * 3600)) {
    let claim = 50 * results[0].b1;
    conn.query(`UPDATE users SET time = ${Math.floor(Date.now() / 1000)}, balance = balance + ${claim}, toinvited = toinvited + ${claim/10} WHERE tg = ?`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
    res.json(results);
  });
    if(!(results[0].invited == null)){
      conn.query(`UPDATE users SET balance = balance + ${claim/10} WHERE tg = ${results[0].invited}`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
  });
    }
  }else{
    res.json('timehack');
  }
});
});

app.get('/buyboost', (req, res) => {
  const name = req.query.name;
  const numb = 'b' + req.query.numb;
  conn.query(`SELECT ${numb}, balance FROM users WHERE tg = ?`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
  if(results[0][numb] < 8){
  if((results[0][numb])**2*50 <= results[0].balance) {
    conn.query(`UPDATE users SET balance = balance - ${(results[0][numb])**2*50}, ${numb} = ${results[0][numb]} + 1 WHERE tg = ?`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
    res.json(results);
  });
  }else{
    res.json('balancehack');
  }
}
});
});

app.get('/mission', (req, res) => {
  const name = req.query.name;
  const numb = 'q' + req.query.numb;
  conn.query(`SELECT ${numb}, ref FROM users WHERE tg = ?`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
  if(results[0][numb] == null){
  if(numb == 'q1') {
    message.telegram.getChatMember('@metro_coin_news', name).then((response) => {
    if(response.status == 'member' || response.status == 'administrator' || response.status == 'creator') {

      conn.query(`UPDATE users SET balance = balance + 500, q1 = 1 WHERE tg = ?`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
    res.json(results);
});

}else{
  res.json('missionhack');
}
        }).catch(error => {});

  }

  if(numb == 'q2') {
    if(results[0].ref >= 5){
      conn.query(`UPDATE users SET balance = balance + 500, q2 = 1 WHERE tg = ?`, [name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
    res.json(results);
});
    }
  }

  if(numb == 'q3') {
    let timenow = Math.floor(Date.now() / 1000);
    if((results[0].q3 >= (timenow + 72000)) || (results[0].q3 == null)){
      conn.query(`UPDATE users SET balance = balance + 100, q3 = ? WHERE tg = ?`, [timenow, name], (err, results) => {
    if (err) {
      res.status(500).send('Ошибка сервера');
      return;
    }
    res.json(results);
});
    }
  }

}
});
});
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});
