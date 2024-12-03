const { Telegraf, Scenes, Markup, session } = require('telegraf');
const tokens = require("./base/tokens.json");
const tbot = new Telegraf(tokens.tgtoken);
const fs = require("fs"); 
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(640, 360);
const ctx = canvas.getContext('2d');

const FormData = require('form-data');

require('events').EventEmitter.defaultMaxListeners = 0;
 const mysql = require("mysql2");
const conn = mysql.createPool({
  connectionLimit: 2,
  host: "127.0.0.1",
  user: "root",
  database: "urlYourApp",
  password: "u pass"
});

const userTime = {};

tbot.use(async (message, next) => {
  try {
    const chatMember = await message.telegram.getChatMember(message.chat.id, message.botInfo.id);
    if (chatMember.status === 'member' || chatMember.status === 'administrator') {
      await next();
    }
  } catch (error) {}
});


const goWallet = new Scenes.WizardScene(
  'goWallet',
  (message) => {
      message.replyWithPhoto({ source: './base/img/jetton.jpg' }, {
      parse_mode: 'HTML',
      caption: `<b>Введи адрес TON кошелька</b>`,
      reply_markup: {
        inline_keyboard: [
          [{ text: `отменить`, callback_data: `stop` }]
        ],
        resize_keyboard: true
      }}).catch((error) => {return message.reply("попробуй позже").catch((error) => {});});
    return message.wizard.next();
  },
  (message) => {
    if(message.update == undefined) {message.reply('попробуй еще раз').catch((error) => {}); return message.scene.leave();}
    if(message.update.callback_query != undefined) {
      if(message.update.callback_query.data == 'stop'){
          let query4 = `SELECT * FROM users WHERE tg = '${message.from.id}'`;
          conn.query(query4, (err, result) =>{ if (err){ console.log(err); return message.reply("попробуй позже");}
          menuWallet(message, result);
        });
          return message.scene.leave();
        }
    }
    if(!message.update.message.text){
            return message.reply(`адрес кошелька указан неверно`);
        }
    if(message.update.message.text.length > 64){
            return message.reply(`адрес кошелька указан неверно`);
    }
    let invalidChars = ['@', '$', '*', '#', '{', '}', '(', ')', '\\', '\"', '[', ']', '<', '>', '&', '\''];
      for (let char of invalidChars) {
        if (message.update.message.text.includes(char)) {
            return message.reply(`адрес кошелька указан неверно`);
    }
  }
  let query3 = `UPDATE users SET wallet = "${message.update.message.text}" WHERE tg=${message.from.id}`;
  conn.query(query3, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
  return message.replyWithMarkdown(`*кошелек привязан*`);
  });
return message.scene.leave();
  }
);

const goWalletEn = new Scenes.WizardScene(
  'goWalletEn',
  (message) => {
      message.replyWithPhoto({ source: './base/img/jetton.jpg' }, {
      parse_mode: 'HTML',
      caption: `<b>Enter TON wallet address</b>`,
      reply_markup: {
        inline_keyboard: [
          [{ text: `cancel`, callback_data: `stop` }]
        ],
        resize_keyboard: true
      }}).catch((error) => {return message.reply("try again").catch((error) => {});});
    return message.wizard.next();
  },
  (message) => {
    if(message.update == undefined) {message.reply('try again').catch((error) => {}); return message.scene.leave();}
    if(message.update.callback_query != undefined) {
      if(message.update.callback_query.data == 'stop'){
          let query4 = `SELECT * FROM users WHERE tg = '${message.from.id}'`;
          conn.query(query4, (err, result) =>{ if (err){ console.log(err); return message.reply("try again");}
          menuWallet(message, result);
        });
          return message.scene.leave();
        }
    }
    if(!message.update.message.text){
            return message.reply(`The wallet address is incorrect`);
        }
    if(message.update.message.text.length > 64){
            return message.reply(`The wallet address is incorrect`);
    }
    let invalidChars = ['@', '$', '*', '#', '{', '}', '(', ')', '\\', '\"', '[', ']', '<', '>', '&', '\''];
      for (let char of invalidChars) {
        if (message.update.message.text.includes(char)) {
            return message.reply(`The wallet address is incorrect`);
    }
  }
  let query3 = `UPDATE users SET wallet = "${message.update.message.text}" WHERE tg=${message.from.id}`;
  conn.query(query3, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
  return message.replyWithMarkdown(`*wallet successfully linked*`);
  });
return message.scene.leave();
  }
);

const goNews = new Scenes.WizardScene(
  'goNews',
  (message) => {
    let msg1;
      message.replyWithMarkdown(`*Напишите сообщение для рассылки*`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: `отменить`, callback_data: `stop` }]
            ],
            resize_keyboard: true
          },
          disable_web_page_preview: true
        });
    return message.wizard.next();
  },
  (message) => {
    if(message.message == undefined || message.message.text == undefined){
      message.replyWithMarkdown(`*Сообщение не указано или указано не верно*`);
return message.scene.leave();
    }
    message.scene.session.msg3 = message.message.text;
      message.replyWithMarkdown(`*📍 Прикрепите фото для рассылки*`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: `отменить`, callback_data: `stop` }]
            ],
            resize_keyboard: true
          },
          disable_web_page_preview: true
        });
    return message.wizard.next();
  },
  (message) => {
    if(message.update == undefined) {message.reply('попробуй еще раз').catch((error) => {}); return message.scene.leave();}
    if(message.update.callback_query != undefined) {
      if(message.update.callback_query.data == 'stop'){
          let query4 = `SELECT * FROM users WHERE tg = '${message.from.id}'`;
          message.reply('отменено');
          return message.scene.leave();
        }
    }
    let msg3 = message.scene.session.msg3;
    if (message.message.photo != undefined) {
      try {
        const photo = message.message.photo.pop();
        const fileId = photo.file_id;



        const query4 = `SELECT tg FROM users`;
        conn.query(query4, (err, result) => {
          if (err) {
            console.log(err);
            return ctx.reply("попробуй позже");
          }
          result.forEach((row) => {
            const userId = row.tg;
            tbot.telegram.sendPhoto(userId, fileId, { caption: msg3,
              reply_markup: {
                inline_keyboard: [
                  [{text: 'play', web_app: {url: 'https://urlYourApp'}}]
                ],
                  resize_keyboard: true
                },
                parse_mode: 'Markdown'
            })
              .catch((error) => {});
          });
          message.reply('Сообщение отправлено');
        });
      } catch (err) {
        console.log('ошибка при рассылке:', err);
        message.reply('Произошла ошибка при отправке, попробуй позже');
      }
    }else{
      message.replyWithMarkdown(`*фото не загружено*`);
    }
return message.scene.leave();
  }
);

const stage = new Scenes.Stage([goWallet, goWalletEn, goNews]);
  tbot.use(session());
  tbot.use(stage.middleware());

function checkntg(message) {
  return new Promise((resolve) => {
  if(message.from.username == ''|message.from.username == undefined){
    let query35 = `UPDATE users SET ntg = NULL WHERE tg=${message.from.id}`;
    conn.query(query35, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      resolve(result);
    });
  }else{
  let query33 = `SELECT * FROM users WHERE ntg = '${message.from.username}'`;
  conn.query(query33, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
    if(result.length > 0){
      let query34 = `UPDATE users SET ntg = NULL WHERE ntg = '${message.from.username}'`;
      conn.query(query34, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      let query35 = `UPDATE users SET ntg = '${message.from.username}' WHERE tg=${message.from.id}`;
      conn.query(query35, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
        resolve(result);
      });
      });
        }else{
          let query35 = `UPDATE users SET ntg = '${message.from.username}' WHERE tg=${message.from.id}`;
          conn.query(query35, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
            resolve(result);
          });
        }
  });
}
});
}
function dltstart(message, whatcmd) {
  return new Promise((resolve) => {
    if(message.chat.type != "private") {
      message.reply('работает только в ЛС\nworks only in PM').catch((error) => {});
      return resolve("error");
    }
    if (userTime[message.chat.id] == 1||userTime[message.chat.id] == 3){
      setTimeout(() => { tbot.telegram.sendMessage(message.chat.id, `используй команды не так быстро\nuse commands less quickly`).catch((error) => {}); return resolve("error");}, 200);
      userTime[message.chat.id] = 2;
      return;
    }
    if (userTime[message.chat.id] == 2){
  return resolve("error");
}
    if(whatcmd){
      if(whatcmd == 1){
        userTime[message.chat.id] = 3;
        setTimeout(() => {
      delete userTime[message.chat.id];
     }, 2000);
    }
    if(whatcmd == 2){
        userTime[message.chat.id] = 3;
        setTimeout(() => {
      delete userTime[message.chat.id];
     }, 3000);
    }
  }
  if(!userTime[message.chat.id]){
  userTime[message.chat.id] = 1;
  setTimeout(() => {
    delete userTime[message.chat.id];
  }, 650);
}
    let query = `SELECT * FROM users WHERE tg=${message.from.id}`;
    conn.query(query, (err, result) => { if (err) {
            tbot.telegram.sendMessage(message.chat.id, `try later😕`).catch((error) => {});
            return resolve("error");
             }
      if (err) {
        console.log(err);
        tbot.telegram.sendMessage(message.chat.id, `try later😕`).catch((error) => {});
        return resolve("error");
      }else{
        let user = result;
        if (user.length === 0) {
          tbot.telegram.sendMessage(message.chat.id, `для начала используй «/start»\nto start use «/start»`).catch((error) => {});
          return resolve("error");
        }else{
          if(user[0].lang == null){
            if(!(message.match[0] == 'lang 0'||message.match[0] == 'lang 1')){
              message.replyWithMarkdown('Привет! Выбери язык для продолжения\nHello! Select a language to continue', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇷🇺Русский', callback_data: 'lang 0' },
          { text: '🇬🇧English', callback_data: 'lang 1' }
        ]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  }).catch((error) => {});
              return resolve("error");
            }
            }
            message.telegram.getChatMember('@urlYourApp', message.from.id).then((response) => {
              if(user[0].balance > 0){
    if (!(response.status == 'member' || response.status == 'administrator' || response.status == 'creator')) {
      if(user[0].lang == 0){
          message.replyWithMarkdown('*для продолжения подпишись на новостной канал: @urlYourApp*').catch((error) => {});
        }else{
          message.replyWithMarkdown('*to continue, subscribe to the news channel: @urlYourApp*').catch((error) => {});
        }
        return resolve("error");
}
}
          if(message.from.username !== user[0].ntg) {
            checkntg(message).then(() => {
            let query1 = `SELECT * FROM users WHERE tg=${message.from.id}`;
            conn.query(query1, (err, result) => {
            if (err) {
            tbot.telegram.sendMessage(message.chat.id, `try later😕`).catch((error) => {});
            return resolve("error");
             } else {
            let user = result;
            if (user.length === 0) {
            tbot.telegram.sendMessage(message.chat.id, `для начала используй «/start»\nto start use «/start»`).catch((error) => {});
            return resolve("error");
            } else {
          resolve(user);
        }
      }
    });
    }).catch(error => {
    tbot.telegram.sendMessage(message.chat.id, `try later😕`).catch((error) => {});
    return resolve("error");
  });
          }else{
          resolve(user);
        }
        }).catch(error => {});
        }
      }
    });
  });
}


tbot.start((message) => {
  if (userTime[message.chat.id]) return message.reply("используй команды не так быстро\nuse commands less quickly");
  userTime[message.chat.id] = 1;
  setTimeout(() => {
    delete userTime[message.chat.id];
  }, 800);
  if(message.chat.type != "private") return  message.reply('работает только в ЛС\nworks only in PM');
  let query7 = `SELECT * FROM users WHERE tg=${message.from.id}`;
      conn.query(query7, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      let usertg = result;
      if(usertg.length > 0){
        if(usertg[0].lang == 0){
          return message.reply("у тебя уже есть аккаунт\nиспользуй: /menu");
        }else{
          return message.reply("you already have an account\nuse: /menu");
        }
      }
    if(message.startPayload.includes('video')){
    let skamer = message.startPayload.replace(/(video)/i, '');
    let queryref = `SELECT * FROM users WHERE tg=${skamer}`;
      conn.query(queryref, (err, result) =>{
      if (err){ console.log(err); return message.reply("try later😕");}
      let ownref = result;
      if(ownref.length == 0) return;
      let kref = 1;
      if(ownref[0].ref != null) kref = ownref[0].ref + 1;
      ////
      //let kref2 = 1;
      //if(ownref[0].ref2 != null) kref2 = ownref[0].ref2 + 1;
      ////
      var rand = Math.floor(Math.random() * 4) + 5;
      let queryref2 = `UPDATE users SET balance = balance + 100, ref = ${kref} WHERE tg=${skamer}`;
      conn.query(queryref2, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");} });
      let query1 = `INSERT INTO users(tg, balance, stats, b1, b2, b3, time, toinvited, invited) VALUES(${message.from.id}, 0, '00000', 1, 1, 1, 0, 0, ${skamer})`;
    conn.query(query1, (err, result) =>{ if (err){ console.log(err); return  message.reply("try later😕");}
    checkntg(message);
    message.replyWithMarkdown('Привет! Выбери язык для продолжения\nHello! Select a language to continue', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇷🇺Русский', callback_data: 'lang 0' },
          { text: '🇬🇧English', callback_data: 'lang 1' }
        ]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  });
      });
      if(ownref[0].lang == 0){
          tbot.telegram.sendMessage(skamer, `${message.from.first_name} перешёл по твоей реф. ссылке\n+100 $METRO`).catch((error) => {});
        }else{
          tbot.telegram.sendMessage(skamer, `${message.from.first_name} followed your ref. link\n+100 $METRO`).catch((error) => {});
        }
      });
    }else{
      let query1 = `INSERT INTO users(tg, balance, stats, b1, b2, b3, time, toinvited) VALUES(${message.from.id}, 0, '00000', 1, 1, 1, 0, 0)`;
    conn.query(query1, (err, result) =>{ if (err){ console.log(err); return  message.reply("try later😕");}
    checkntg(message);
    message.replyWithMarkdown('Привет! Выбери язык для продолжения\nHello! Select a language to continue', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇷🇺Русский', callback_data: 'lang 0' },
          { text: '🇬🇧English', callback_data: 'lang 1' }
        ]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  });
      });
    }
});
});

tbot.action(/^(?:lang)\s(.*)$/i, (message) => {
 dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    let query1 = `UPDATE users SET lang = ${message.match[1]} WHERE tg=${message.from.id}`;
    conn.query(query1, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
    message.deleteMessage(message.callbackQuery.message.message_id).catch((error) => {});
    if(message.match[1] == 0) return message.sendAnimation({ source: './base/img/holes.gif' }, {
    parse_mode: 'HTML',
    caption: `🚇<b>METRO COIN AIRDROP</b>\n\nполучай по 100 $METRO за приведенного друга и ожидай новых активностей для получения дропа🔥\n12% всех токенов $METRO выделено на аирдроп\n📰следи за новостями: @urlYourApp\n\n<b>используй кнопки ниже для навигации</b>👇`,
    reply_markup: {
      keyboard: [
    ['miniApp'],
    ['меню', 'реф. ссылка', 'новости'],
    ['баланс', 'language', 'кошелек'],
      ],
      resize_keyboard: true
    }
  }).catch((error) => {return message.reply("попробуй позже😕").catch((error) => {});});


    if(message.match[1] == 1) return message.sendAnimation({ source: './base/img/holes.gif' }, {
    parse_mode: 'HTML',
    caption: `🚇<b>METRO COIN AIRDROP</b>\n\nget 100 $METRO for referring a friend and look forward to new activities to receive drops🔥\n12% of all $METRO tokens are allocated for airdrop\n📰follow the news: @urlYourApp\n\n<b>use the buttons below to navigate</b>👇`,
    reply_markup: {
      keyboard: [
    ['miniApp'],
    ['menu', 'ref. link', 'news'],
    ['balance', 'language', 'wallet'],
      ],
      resize_keyboard: true
    }
  }).catch((error) => {return message.reply("try later😕").catch((error) => {});});
});
});
});

tbot.hears(/^(?:\/language|language)$/i, (message) => {
 dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    message.replyWithMarkdown('Выбери язык для продолжения\nSelect a language to continue', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🇷🇺Русский', callback_data: 'lang 0' },
          { text: '🇬🇧English', callback_data: 'lang 1' }
        ]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  });
});
});

tbot.hears(/^(?:\/menu|меню|menu)$/i, (message) => {
 dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;

    if(user[0].lang == 0){
          return message.sendAnimation({ source: './base/img/holes.gif' }, {
    parse_mode: 'HTML',
    caption: `🚇<b>METRO COIN AIRDROP</b>\n\nполучай по 100 $METRO за приведенного друга и 10% от их прибыли за отправку🔥\n12% всех токенов $METRO выделено на аирдроп\n📰следи за новостями: @urlYourApp\n\n<b>используй кнопки ниже для навигации</b>👇`,
    reply_markup: {
      keyboard: [
    ['miniApp'],
    ['меню', 'реф. ссылка', 'новости'],
    ['баланс', 'language', 'кошелек'],
      ],
      resize_keyboard: true
    }
  }).catch((error) => {return message.reply("попробуй позже😕").catch((error) => {});});
        }else{
          return message.sendAnimation({ source: './base/img/holes.gif' }, {
    parse_mode: 'HTML',
    caption: `🚇<b>METRO COIN AIRDROP</b>\n\nget 100 $METRO for referring a friend and 10% of their profit for sending🔥\n12% of all $METRO tokens are allocated for airdrop\n📰follow the news: @urlYourApp\n\n<b>use the buttons below to navigate</b>👇`,
    reply_markup: {
      keyboard: [
    ['miniApp'],
    ['menu', 'ref. link', 'news'],
    ['balance', 'language', 'wallet'],
      ],
      resize_keyboard: true
    }
  }).catch((error) => {return message.reply("try later😕").catch((error) => {});});
        }
});
});

tbot.hears(/^(?:реф\. ссылка|ref\. link)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    if(user[0].ref == null) user[0].ref = 0;
    if(user[0].lang == 0){
          return message.replyWithMarkdown(`*твоя реф. ссылка:*\n\`t.me/metro_coin_bot?start=video${message.from.id}\`\n📃переходов по ссылке: ${user[0].ref}\n💰за каждого приглашенного друга ты получишь 100 $METRO и 10% от их прибыли за отправку\n\n*нажми на ссылку чтобы скопировать*`);
        }else{
          return message.replyWithMarkdown(`*your ref. link:*\n\`t.me/metro_coin_bot?start=video${message.from.id}\`\n📃link clicks: ${user[0].ref}\n💰for each friend you invite you will receive 100 $METRO and 10% of their profit for sending\n\n*click on the link to copy*`);
        }
});
});

tbot.hears(/^(?:баланс|balance)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    if(user[0].lang == 0){
          return message.replyWithMarkdown(`*твой баланс: ${user[0].balance} $METRO*\n$METRO будут отправлены на твой кошелек после окончания аирдропа`);
        }else{
          return message.replyWithMarkdown(`*your balance: ${user[0].balance} $METRO*\n$METRO will be sent to your wallet after the end of the airdrop`);
        }
});
});

tbot.hears(/^(?:новости|news)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    if(user[0].lang == 0){
          return message.replyWithHTML('новостной канал👇', Markup.inlineKeyboard([
                  [Markup.button.url('перейти', 'https://t.me/urlYourApp')]
             ]));
        }else{
          return message.replyWithHTML('news channel👇', Markup.inlineKeyboard([
                  [Markup.button.url('follow', 'https://t.me/urlYourApp')]
             ]));
        }
});
});

tbot.hears(/^(?:miniApp)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    return message.reply(`miniApp👇`, {
    reply_markup: {
      inline_keyboard: [
        [{text: 'Press me ', web_app: {url: 'https://urlYourApp'}}]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  });
});
});

tbot.hears(/^(?:кошелек|wallet)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    menuWallet(message, user);
});
});

function menuWallet(message, user) {
    if(user == "error") return;
    if (typeof user !== "object") return message.reply(user);
    if (user[0].stats[2] == 2) return;
    if(user[0].wallet == null){
      if(user[0].lang == 0){
          return message.replyWithMarkdown(`*к твоему аккаунту еще не привязан кошелек*\n\nдля привязки используй некастодиальный кошелек (например tonkeeper)`, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔗привязать', callback_data: 'newwallet' }
                ]
              ],
              resize_keyboard: true
            },
            disable_web_page_preview: true
          });
        }else{
          return message.replyWithMarkdown(`*there is no wallet linked to your account yet*\n\nuse a non-custodial wallet (for example tonkeeper)`, {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔗link', callback_data: 'newwallet' }
                ]
              ],
              resize_keyboard: true
            },
            disable_web_page_preview: true
          });
        }
    }else{
      if(user[0].lang == 0){
          return message.reply(`кошелек, привязанный к твоему аккаунту:\n${user[0].wallet}\n\n$METRO будут отправлены после окончания аирдропа`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔗привязать другой', callback_data: 'newwallet' }
        ]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  });
        }else{
          return message.reply(`wallet linked to your account:\n${user[0].wallet}\n\n$METRO will be sent after the end of the airdrop`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔗link another', callback_data: 'newwallet' }
        ]
      ],
      resize_keyboard: true
    },
    disable_web_page_preview: true
  });
        }
    }
};

  tbot.action('newwallet', (message) => {
    dltstart(message).then((user) => {
      if(user == "error") return;
      if (typeof user !== "object") return message.reply(user);
      message.deleteMessage(message.callbackQuery.message.message_id).catch((error) => {});
      if(user[0].lang == 0){
        return message.scene.enter('goWallet').catch((error) => {});
      }else{
        return message.scene.enter('goWalletEn').catch((error) => {});
      }
  });
  });

tbot.hears(/^(?:all)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return;
    if (user[0].stats[2] == 2) return;
    if(user[0].stats[0] < 1) return;
    let query1 = `SELECT SUM(balance + (burn * 2)) AS total FROM users`;
    conn.query(query1, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      let sum = result[0].total;
    let query2 = `SELECT COUNT(*) AS total_rows FROM users`;
    conn.query(query2, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      let kolvo = result[0].total_rows;
    return message.replyWithMarkdown(`${sum}/2520000\nосталось: ${2520000 - sum}\nвсего юзеров: ${kolvo}\n\nсоженные учитываются как x2`);
});
});
});
});

tbot.hears(/^(?:all)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return;
    if (user[0].stats[2] == 2) return;
    if(user[0].stats[0] < 1) return;
    let query1 = `SELECT SUM(balance + (burn * 2)) AS total FROM users`;
    conn.query(query1, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      let sum = result[0].total;
    let query2 = `SELECT COUNT(*) AS total_rows FROM users`;
    conn.query(query2, (err, result) =>{ if (err){ console.log(err); return message.reply("try later😕");}
      let kolvo = result[0].total_rows;
    return message.replyWithMarkdown(`${sum}/2520000\nосталось: ${2520000 - sum}\nвсего юзеров: ${kolvo}\n\nсоженные учитываются как x2`);
});
});
});
});

tbot.hears(/^(?:createnews)$/i, (message) => {
  dltstart(message).then((user) => {
    if(user == "error") return;
    if (typeof user !== "object") return;
    if (user[0].stats[2] == 2) return;
    if(user[0].stats[0] < 1) return;
    return message.scene.enter('goNews').catch((error) => {});
});
});

tbot.catch((error) => {
  console.log('error:', error);
});

tbot.launch()
console.log('Version 2.1\nTG');

///////////////server///////////////
///////////////server///////////////
///////////////server///////////////

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

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
    if(results[0].balance < kolvo || kolvo <= 0){
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
  if(results[0][numb] == null || numb == 'q3'){
  if(numb == 'q1') {
    try {
      tbot.telegram.getChatMember('@urlYourApp', name).then((response) => {
        if (response.status === 'member' || response.status === 'administrator' || response.status === 'creator') {
          conn.query(`UPDATE users SET balance = balance + 500, q1 = 1 WHERE tg = ?`, [name], (err, results) => {
            if (err) {
              res.status(500).send('Ошибка сервера');
              return;
            }
            res.json(results);
          });
        } else {
          res.json('missionhack');
        }
      }).catch(error => {
        res.status(500).send('Ошибка сервера');
      });
    } catch (error) {
      res.status(500).send('Ошибка сервера');
    }

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

//   if(numb == 'q4') {
//     if(results[0].ref2 >= 3){
//       conn.query(`UPDATE users SET balance = balance + 500, q4 = 1 WHERE tg = ?`, [name], (err, results) => {
//     if (err) {
//       res.status(500).send('Ошибка сервера');
//       return;
//     }
//     res.json(results);
// });
//     }
//   }

  if(numb == 'q3') {
    let timenow = Math.floor(Date.now() / 1000);
    if((timenow >= (results[0].q3 + 72000)) || (results[0].q3 == null)){
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
