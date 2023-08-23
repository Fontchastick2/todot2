import * as SQLite from 'expo-sqlite'

export class Database {

    db: SQLite.SQLiteDatabase;

    constructor(db: SQLite.SQLiteDatabase){
        this.db = db;
        db.transaction(function (tx) { 
            tx.executeSql('BEGIN TRANSACTION'); 
            // tx.executeSql('DROP TABLE IF EXISTS DAYS'); 
            // tx.executeSql('DROP TABLE TASKS'); 
            // tx.executeSql('DROP TABLE MISSIONS'); 

            tx.executeSql('CREATE TABLE IF NOT EXISTS DAYS (id unique, log)'); 
            tx.executeSql('CREATE TABLE IF NOT EXISTS MISSIONS (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, time TEXT, duration INTEGER, description TEXT, startAt TEXT, endAt TEXt, deleted INTEGER)');//from CHAR 12, to CHAR 12)'); 
            tx.executeSql('CREATE TABLE IF NOT EXISTS TASKS (taskId INTEGER PRIMARY KEY AUTOINCREMENT, dayId TEXT, missionId INTEGER, status TEXT)'); 
            tx.executeSql('COMMIT'); 
         });
         
    }

    addTask(task: any) {
        this.db.transaction(function (tx) { 
            tx.executeSql(`INSERT INTO TASKS VALUES (${task.id}, ${task.title}, ${task.duration}, ${task.description}, 0, ${task.from}, ${task.to}, ${task.days})`); 
        });
    }

    getTasks(day: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) { 
                tx.executeSql('SELECT * FROM TASKS INNER JOIN MISSIONS ON MISSIONS.id = TASKS.missionId WHERE dayId = ? AND deleted = 0',[day], (_, { rows }) =>{
                    console.log(JSON.stringify(rows))
                    resolve(rows);
                }, (error) => {
                    reject(error);
                }); 
            });
        })
    }

    updateTaskStatut(taskId: number, statut: TaskStatut) {
        this.db.transaction(function (tx) { 
            tx.executeSql('UPDATE TASKS SET status = ? WHERE taskId = ?', [statut, taskId]); 
        });
        console.log(taskId, statut)
    }

    removeMission(missionId: any) {
        this.db.transaction(function (tx) { 
            tx.executeSql('UPDATE MISSIONS SET deleted = 0 WHERE id = ?', [missionId] ); 
        });
    }

    addDay(day: Day) {
        this.db.transaction(function (tx) { 
            tx.executeSql('INSERT INTO DAYS VALUES (?, ?)', [day.id, day.result]); 
        });
    }

    getDay(id: string) {
        this.db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM DAYS WHERE id='+ id,[], (_, { rows }) =>{
                console.log(JSON.stringify(rows))
                return rows;
            }); 
        });
    }

    getDays() {
        this.db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM DAYS',[], (_, { rows }) =>{
                console.log(JSON.stringify(rows))

                return rows;
            }
          ); 
        });
    }

    addMission(task: Mission) {
        console.log(task)
        this.db.transaction(function (tx) { 
            tx.executeSql('INSERT INTO MISSIONS (title, time, duration, description, startAt, endAt, deleted) VALUES (?, ?, ?, ?, ?, 0)', [task.title, task.time!, task.duration!, task.description!, task.from.toDateString(), task.to.toDateString()],
                function (tx, event) {
                    let end = new Date(task.to)
                    if(event.insertId){
                        for(let start = new Date(task.from); start < end || start.toDateString() === end.toDateString() ; start = new Date(start.getTime() + 86400000)){
                            console.log(start)
                            tx.executeSql('INSERT INTO TASKS (dayId, missionId, status) VALUES (?, ?, ?)', [start.toDateString(), event.insertId, TaskStatut.PENDING])
                        }
                    }
                }
            );
        });
    }

    getMissions() {
        this.db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM MISSIONS',[], (_, { rows }) =>{
                console.log(JSON.stringify(rows))
                return rows;
            }); 
        });
    }
  
}

export class Day{
    id: string;
    result: string;

    constructor(id: string, result: string) {
        this.id = id;
        this.result = result;
    }
}

export class Mission{
    id: string = "";
    taskId: number = 0;
    title: string;
    time?: string;
    duration?: number; 
    description?: string;
    from: Date =new Date(); 
    to: Date = new Date();
    days?: any[];
    status= TaskStatut.PENDING;

    constructor(title: string) {
        this.title= title;
    }
}

export enum TaskStatut {
    PENDING = "pending",
    DONE = "done",
    FAILED= "failed"
}