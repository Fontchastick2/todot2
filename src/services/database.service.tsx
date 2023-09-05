import * as SQLite from 'expo-sqlite'

export class Database {

    db: SQLite.SQLiteDatabase;

    constructor(db: SQLite.SQLiteDatabase){
        this.db = db;
        db.transaction(function (tx) { 
            // tx.executeSql('BEGIN TRANSACTION'); 
            // tx.executeSql('DROP TABLE IF EXISTS DAYS'); 
            // tx.executeSql('DROP TABLE TASKS'); 
            // tx.executeSql('DROP TABLE MISSIONS'); 

            tx.executeSql('CREATE TABLE IF NOT EXISTS DAYS (id unique, log)'); 
            tx.executeSql('CREATE TABLE IF NOT EXISTS MISSIONS (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, time TEXT, duration INTEGER, description TEXT, startAt TEXT, endAt TEXt, preparation TEXT, distraction TEXT, overcome TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS TASKS (taskId INTEGER PRIMARY KEY AUTOINCREMENT, dayId TEXT, missionId INTEGER, status TEXT, deleted INTEGER)'); 
            tx.executeSql('COMMIT'); 
         });
         
    }

    addTask(task: any) {
        this.db.transaction(function (tx) { 
            tx.executeSql(`INSERT INTO TASKS VALUES (${task.id}, ${task.title}, ${task.duration}, ${task.description}, 0, ${task.from}, ${task.to}, ${task.days})`); 
        });
    }

    getTask(taskId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) { 
                tx.executeSql('SELECT * FROM MISSIONS WHERE MISSIONS.id = ?',[taskId], (_, { rows }) =>{
                    resolve(rows._array[0]);
                }, (error) => {
                    reject(error);
                }); 
            });
        })
    }

    getTasks(day: string): Promise<any> {
        console.log(day)
        return new Promise((resolve, reject) => {
            this.db.transaction(function (tx) { 
                tx.executeSql('SELECT * FROM TASKS INNER JOIN MISSIONS ON MISSIONS.id = TASKS.missionId WHERE dayId = ? AND deleted = 0',[day], (_, { rows }) =>{
                    console.log(JSON.stringify(rows))
                    resolve(rows._array);
                }, (error) => {
                    reject(error);
                }); 
            });
        })
    }

    testTasks(){
        this.db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM MISSIONS',[], (_, { rows }) =>{
                console.log("Missions: "+ JSON.stringify(rows))
            }); 
            tx.executeSql('SELECT * FROM TASKS',[], (_, { rows }) =>{
                console.log("Tasks: "+ JSON.stringify(rows))
            }); 
        });
    }

    updateTaskStatut(taskId: number, statut: TaskStatut) {
        this.db.transaction(function (tx) { 
            tx.executeSql('UPDATE TASKS SET status = ? WHERE taskId = ?', [statut, taskId]); 
        });
        console.log(taskId, statut)
    }

    removeMission(taskId: any) {
        console.log(taskId)
        this.db.transaction(function (tx) { 
            tx.executeSql('UPDATE MISSIONS SET deleted = 1 WHERE id = ?', [taskId], ()=> {}, (error) => {console.log(error)} ); 
        });
    }

    removeTask(taskId: any) {
        console.log(taskId)
        this.db.transaction(function (tx) { 
            tx.executeSql('UPDATE TASKS SET deleted = 1 WHERE missionId = ?', [taskId], ()=> {}, (error) => {console.log(error)} ); 
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
        this.db.transaction(function (tx) { //    ?, ?  
            tx.executeSql('INSERT INTO MISSIONS (title, startAt, endAt, time, duration, description, preparation, distraction, overcome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [task.title, task.from.toString(), task.to.toString(),task.time?.toString()!, task.duration!, task.description!, task.distraction!, task.preparation!, task.overcome!],
                function (tx, event) {
                    let end = new Date(task.to)
                    if(event.insertId){
                        for(let start = new Date(task.from); start < end || start.toString() === end.toString() ; start = new Date(start.getTime() + 86400000)){
                            tx.executeSql('INSERT INTO TASKS (dayId, missionId, status, deleted) VALUES (?, ?, ?, 0)', [start.toDateString(), event.insertId, TaskStatut.PENDING],  ()=> {}, (error) => {console.log(error)} )
                        }
                    }
                }, (error) => {console.log(error)}
            );
        });
    }

    updateMission(task: Mission) {
        console.log(task)
        this.db.transaction(function (tx) { //  , 
            tx.executeSql('UPDATE SET MISSIONS title= ?, time= ?, duration= ?, description= ?, startAt= ?, endAt= ?, preparation= ?, distraction= ?, overcome= ? WHERE id = ?', [task.title, task.time?.toString()!, task.duration!, task.description!, task.from.toString(), task.to.toString(), task.preparation!, task.distraction!, task.overcome!, task.id], ()=> {}, (error) => {console.log(error)});
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
    time?: Date;
    duration?: number; 
    description?: string;
    from: Date =new Date(); 
    to: Date = new Date();
    days?: any[];
    status= TaskStatut.PENDING;
    preparation?: string;
    distraction?: string;
    overcome?: string;

    constructor(title: string, date?: string) {
        this.title= title;
        if(date){
            this.from =new Date(date); 
            this.to = new Date(date);
        }
    }
}

export enum TaskStatut {
    PENDING = "pending",
    DONE = "done",
    FAILED= "failed"
}