import { IpcHandler } from "../components/ipc_handler.js";

export class GetVacations {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute(data: { userId: number }) {
        try {
            return await this.ipcHandler.getVacations(data);
        } catch(error) {
            console.error(`❌ Error on (GetVacations) task: ${error}.`);
            const err = new Error("❌ Erro interno ao coletar registros. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}