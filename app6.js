const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');
const db2 = new sqlite3.Database('test2.db');


let sql = `
select car.id, car.name, maker.name as name2
from car inner join maker
on car.maker_id=maker.id;
`

let sql2 = `
select streamer.id, streamer.name, office.name as name2
from streamer inner join office
on streamer.office_id=office.id;
`

db2.serialize( () => {
    db2.all( sql, (error, row) => {
        if(error) {
            console.log('Error: ', error );
            return;
        }
        for( let data of row ) {
            console.log( data.id + ' : ' + data.name + ' : ' + data.name2 );
        }
    });
});

db2.serialize( () => {
    db2.all( sql2, (error, row) => {
        if(error) {
            console.log('Error: ', error );
            return;
        }
        for( let data of row ) {
            console.log( data.id + ' : ' + data.name + ' : ' + data.name2 );
        }
    });
});


app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const message = "Hello world";
  res.render('show', {mes:message});
});

app.get("/db", (req, res) => {
    db.serialize( () => {
        db.all("select id, 都道府県, 人口 from example;", (error, row) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            res.render('select', {data:row});
        })
    })
})
app.get('/db/:id', (req,res) => {
    db.serialize( () => {
        db.all('select id, 都道府県, 人口, 大学 from example where id=' + req.params.id + ';', (error, row) => {
            if( error ) {
                res.render('show', {mes:'エラーです'});
            }
            res.render('db', {data:row});
        })
    })
})
app.get("/top", (req, res) => {
    //console.log(req.query.pop);    // ①
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select id, 都道府県, 人口 from example order by 人口" + desc + " limit " + req.query.pop + ";";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('select', {data:data});
        })
    })
})
app.get("/top2", (req, res) => {
    //console.log(req.query.pop);    // ①
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select id, 都道府県, 人口";
    //console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            //console.log(data);    // ③
            res.render('select', {data:data});
        })
    })
})

app.post('/insert', (req, res) => {
    let sql = `
    insert into example (都道府県,人口,大学) values ('` + req.body.name + `',` + req.body.jinko + `,` + req.body.daigaku + `);
    `
    console.log(sql);
    db.serialize( () => {
        db.run( sql, (error, row) => {
            console.log(error);
            if(error) {
                res.render('show', {mes:'エラーです'});
            }
            res.redirect('/db');
        });
    });
    console.log(req.body);
});

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
