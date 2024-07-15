const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('genshin.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const message = "Hello world";
  res.render('show2', {mes:message});
});

app.get("/db", (req, res) => {
    db.serialize( () => {
        db.all("select id, name, gender, birthday, weapon_type, element_id, country_id from example;",(error, row) => {
            if( error ) {
                res.render('show2', {mes:"エラーです"});
            }
            res.render('genshin', {data:row});
        })
    })
})
app.get("/top", (req, res) => {
    let sql1 = `
    select character.id, character.name,weapon.name as weapon
    from character inner join weapon
    on character.weapon_type=weapon.id;
    `
    let sql2 = `
    select character.id, character.name,country.name as weapon
    from character inner join country
    on character.country_id=country.id;
    `
    let sql3 = `
    select character.id, character.name,element.name as weapon
    from character inner join element
    on character.element_id=element.id;
    `
    console.log(req.query.pop);
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select character.id, character.name, character.gender, character.weapon, character.element from example order by id" + desc + " limit " + req.query.pop + ";";
    console.log(sql);
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show2', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('genshin', {data:data});
        })
    })
})
app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
