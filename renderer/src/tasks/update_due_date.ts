import { IpcHandler } from "../components/ipc_handler.js";

export class UpdateDueDate {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute(userId: number, dueDate: string) {
        try {
            return await this.ipcHandler.updateDueDate(userId, dueDate);
        } catch(error) {
            console.error(`❌ Error on (SendAdmission) task: ${error}.`);
            const err = new Error("❌ Erro interno ao enviar data. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}