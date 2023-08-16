import * as SQLite from 'expo-sqlite'


const db = SQLite.openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024) // returns Database object

export class Database {

    constructor(){
        db.transaction(function (tx) { 
            tx.executeSql('CREATE TABLE IF NOT EXISTS DAYS (id unique, log)'); 
            tx.executeSql('CREATE TABLE IF NOT EXISTS TASKS (id PRIMARY KEY, title VARCHAR, duration INTEGER, description VARCHAR, status ENUM, from CHAR 12, to CHAR 12, days SET)'); 
            console.log("initialised")
         });
        
    }

    addTask(task: any) {
        db.transaction(function (tx) { 
            tx.executeSql(`INSERT INTO TASKS VALUES (${task.id}, ${task.title}, ${task.duration}, ${task.description}, 0, ${task.from}, ${task.to}, ${task.days})`); 
        });
    }

    addDay(day: Day) {
        db.transaction(function (tx) { 
            tx.executeSql(`INSERT INTO DAYS (id, result) VALUES (${day.id}, ${day.result})`); 
        });
    }

    getDay(id: string) {
        db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM DAYS WHERE id='+ id,[], (_, { rows }) =>{
                console.log(JSON.stringify(rows))

                return rows;
            }
          ); 
        });
    }

    getDays() {
        db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM DAYS',[], (_, { rows }) =>{
                return rows;
            }
          ); 
        });
    }
  
    // transaction() {
    //   db.transaction(function (tx) { 
    //     tx.executeSql('SELECT * FROM LOGS',[], (_, { rows }) =>
    //     console.log(JSON.stringify(rows))
    //   ); 
    //   });
    // }
  
}

export class Day{
    id: string;
    result: string;

    constructor(id: string, result: string) {
        this.id = id;
        this.result = result;
    }
}