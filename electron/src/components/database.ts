import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import { join } from "path";
import { app } from "electron";

export class DbHandler {
    
    db: DatabaseType
    
    constructor() {
        try {
            let dbPath = "";
            if (app.isPackaged) {
                dbPath = join(process.resourcesPath, "database.db");
            } else {
                dbPath = join(__dirname, "..", "..", "storage", "database.db");
            }
            this.db = new Database(dbPath);
            this.db.prepare(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user TEXT NOT NULL,
                    admission TEXT NOT NULL,
                    status TEXT NOT NULL,
                    daysLeft TEXT NOT NULL
                )
            `).run();
            this.db.prepare(`
                CREATE TABLE IF NOT EXISTS vacations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userId INTEGER NOT NULL,
                    begin TEXT NOT NULL,
                    end TEXT NOT NULL
                )
            `).run();
        } catch(error) {
            const err = new Error(`Error in (Database) component in (constructor) method: ${error}.`);
            err.name = "";
            throw err;
        }
    }
    
    createUser(user: string, admission: string) {
        try {
            this.db.prepare("INSERT INTO users (user, admission, status, daysLeft) VALUES (?, ?, ?, ?)").run(user, admission, "Não Marcado", "30");
        } catch(error) {
            throw new Error(`Error in (Database) component in (createUser) method: ${error}.`);
        }
    }
    
    updateUser(id: number, daysLeft: number, status: string, dueDate: string | null) {
        try {
            if (dueDate != null) {
                this.db.prepare(`UPDATE users SET daysLeft = ${daysLeft}, status = '${status}', admission = '${dueDate}' WHERE id = ${id}`).run();
            } else {
                this.db.prepare(`UPDATE users SET daysLeft = ${daysLeft}, status = '${status}' WHERE id = ${id}`).run();
            }
        } catch(error) {
            throw new Error(`Error in (Database) component in (updateUser) method: ${error}.`);
        }
    }
    
    readUser(id: number) {
        try {
            return this.db.prepare(`SELECT * FROM users WHERE id = ${id}`).all() as [{ id: number; user: string; admission: string, status: string, daysLeft: string }];
        } catch(error) {
            throw new Error(`Error in (Database) component in (readUser) method: ${error}.`);
        }
    }
    
    readAllUsers() {
        try {
            return this.db.prepare("SELECT * FROM users").all() as [{ id: number; user: string; admission: string; status: string; daysLeft: string }];
        } catch(error) {
            throw new Error(`Error in (Database) component in (readAllUsers) method: ${error}.`);
        }
    }
    
    deleteUser(id: number) {
        try {
            this.db.prepare(`DELETE FROM users WHERE id = ${id}`).run();
        } catch(error) {
            throw new Error(`Error in (Database) component in (deleteUser) method: ${error}.`);
        }
    }
    
    createVacation(userId: number, begin: string, end: string) {
        try {
            this.db.prepare(`INSERT INTO vacations (userid, begin, end) VALUES (?, ?, ?)`).run(userId, begin, end);
        } catch(error) {
            throw new Error(`Error in (Database) component in (createVacation) method: ${error}.`);
        }
    }
    
    readAllVacations(userId: number) {
        try {
            return this.db.prepare(`SELECT * FROM vacations WHERE userid = ${userId}`).all() as [{ id: number; userId: string; begin: string; end: string }];
        } catch(error) {
            throw new Error(`Error in (Database) component in (readAllVacations) method: ${error}.`);
        }
    }
    
    readVacation(id: number) {
        try {
            return this.db.prepare(`SELECT * FROM vacations WHERE id = ${id}`).all() as [{ id: number; userId: string; begin: string; end: string }];
        } catch(error) {
            throw new Error(`Error in (Database) component in (readVacations) method: ${error}.`);
        }
    }
    
    deleteVacation(id: number) {
        try {
            this.db.prepare(`DELETE FROM vacations WHERE id = ${id}`).run();
        } catch(error) {
            throw new Error(`Error in (Database) component in (deleteVacation) method: ${error}.`);
        }
    }
    
    deleteAllVacations(userId: number) {
        try {
            this.db.prepare(`DELETE FROM vacations WHERE userid = ${userId}`).run();
        } catch(error) {
            throw new Error(`Error in (Database) component in (deleteAllVacations) method: ${error}.`);
        }
    }
    
}