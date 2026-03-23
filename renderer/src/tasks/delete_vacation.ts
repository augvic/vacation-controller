import { IpcHandler } from "../components/ipc_handler.js";

export class DeleteVacation {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute(data: { id: number }) {
        try {
            return await this.ipcHandler.deleteVacation(data);
        } catch(error) {
            console.error(`❌ Error on (DeleteVacation) task: ${error}.`);
            const err = new Error("❌ Erro interno ao deletar registro. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}