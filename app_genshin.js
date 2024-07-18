const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('genshin.db');

    let sql1 = `
    select character.id, character.name,character.gender,character.birthday,character.voice_actor,weapon.name as weapon,country.name as country,element.name as element
    from character inner join weapon
    on character.weapon_type=weapon.id
    inner join country
    on character.country_id=country.id
    inner join element
    on character.element_id=element.id;
    `
        let sql2 = `
    select character.id, character.name,character.gender,weapon.name as weapon,element.name as element
    from character inner join weapon
    on character.weapon_type=weapon.id
    inner join element
    on character.element_id=element.id;
    `
app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.serialize( () => {

 db.all( sql1, (error, row) => {

  if(error) {

   console.log('Error: ', error );
   return;

  }

  for( let data of row ) {

   console.log( data.id + ' : ' + data.name + ' : ' + data.gender + ' : ' + data.birthday + ' : ' + data.voice_actor + ' : ' + data.weapon + ' : ' + data.country + ' : ' + data.element );
  }

 });

});

app.get("/", (req, res) => {
  const message = "Hello world";
  res.render('show2', {mes:message});
});

app.get("/db", (req, res) => {
    db.serialize( () => {
        db.all(sql1,(error,row) => {
            if( error ) {
                res.render('show2', {mes:"エラーです"});
            }
            console.log('row =>' + row);
            res.render('genshin_db', {data:row});
            
        })
    })
})
app.get("/top", (req, res) => {
    console.log(req.query.pop);
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = sql2 + "from example order by id" + desc + " limit " + req.query.pop + ";";
    console.log(sql);
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show2', {mes:"エラーです"});
            }
            console.log("data  =>" + data);    // ③
            res.render('genshin', {data:data});
        })
    })
})
app.get("/db/:id", (req, res) => {
    db.serialize(() => {
        db.all( sql1 + 'from example where id=' + req.params.id + ';', (error, row) => {
            if (error) {
           
                res.render('show2', {mes:'エラーです'});
            }
            console.log(req.params.id);
            res.render('genshin_db1', {data:req.params.id});
        })
    })
});
app.get("/element", (req, res) => {
    db.serialize( () => {
        db.all(sql2 + 'from example where element_id=' + req.params.element_id + ';',(error,row) => {
            if( error ) {
                res.render('show2', {mes:"エラーです"});
            }
            console.log('row =>' + row);
            res.render('genshin', {data:row});
            
        })
    })
})
app.get("/weapon", (req, res) => {
    db.serialize( () => {
        db.all(sql2 + 'from example where weapon_type=' + req.params.weapon_type + ';',(error,row) => {
            if( error ) {
                res.render('show2', {mes:"エラーです"});
            }
            console.log('row =>' + row);
            res.render('genshin', {data:row});
            
        })
    })
})
app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
