import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { CreateUser } from "../tasks/create_user";
import { GetUsers } from "../tasks/get_users";
import { DeleteUser } from "../tasks/delete_user";
import { CreateVacation } from "../tasks/create_vacation";
import { GetVacations } from "../tasks/get_vacations";
import { DeleteVacation } from "../tasks/delete_vacation";

export class App {
    
    createUserTask: CreateUser
    getUsersTask: GetUsers
    deleteUserTask: DeleteUser
    createVacationTask: CreateVacation
    getVacationsTask: GetVacations
    deleteVacationTask: DeleteVacation

    
    constructor() {
        app.whenReady().then(() => { 
            this.createElectronWindow();
        });
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        this.createUserTask = new CreateUser();
        this.getUsersTask = new GetUsers()
        this.deleteUserTask = new DeleteUser();
        this.createVacationTask = new CreateVacation();
        this.getVacationsTask = new GetVacations();
        this.deleteVacationTask = new DeleteVacation();
    }
    
    private startIpcHandler(win: any) {
        ipcMain.on("window-minimize", () => win.minimize());
        ipcMain.on("window-maximize", () => {
            if (win.isMaximized()) {
                win.unmaximize();
            } else {
                win.maximize();
            }
        });
        ipcMain.on("window-close", () => win.close());
        ipcMain.handle("user:create", (event, data: { user: string, admission: string }) => {
            try {
                return this.createUserTask.execute(data.user, data.admission);
            } catch(error) {
                return { success: false, message: error }
            }
        });
        ipcMain.handle("user:get", (event) => {
            try {
                return this.getUsersTask.execute();
            } catch(error) {
                return { success: false, message: error }
            }
        });
        ipcMain.handle("user:delete", (event, data) => {
            try {
                return this.deleteUserTask.execute(data.id, data.user);
            } catch(error) {
                return { success: false, message: error }
            }
        });
        ipcMain.handle("vacation:create", (event, data) => {
            try {
                return this.createVacationTask.execute(data.userId, data.user, data.begin, data.end);
            } catch(error) {
                return { success: false, message: error }
            }
        });
        ipcMain.handle("vacation:get", (event, data) => {
            try {
                return this.getVacationsTask.execute(data.userId);
            } catch(error) {
                return { success: false, message: error }
            }
        });
        ipcMain.handle("vacation:delete", (event, data) => {
            try {
                return this.deleteVacationTask.execute(data.id);
            } catch(error) {
                return { success: false, message: error }
            }
        });
    }
    
    private renderMainHtml(win: any) {
        win.loadFile(join(__dirname, "..", "..", "storage", ".renderer", "main.html"));
    }
    
    private instantiateBrowser() {
        return new BrowserWindow({
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720,
            frame: false,
            icon: join(__dirname, "..", "..", "icon.png"),
            webPreferences: {
                preload: join(__dirname, "preload.js"),
                contextIsolation: true,
            }
        });
    }
    
    private createElectronWindow() {
        const win = this.instantiateBrowser();
        this.renderMainHtml(win);
        this.startIpcHandler(win);
    };
    
}
