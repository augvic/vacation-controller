import { IpcHandler } from "../components/ipc_handler.js";

export class GetUsers {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute() {
        try {
            return await this.ipcHandler.getUsers();
        } catch(error) {
            console.error(`❌ Error on (GetUsers) task: ${error}.`);
            const err = new Error("❌ Erro interno ao coletar usuários. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}