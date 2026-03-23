import { IpcHandler } from "../components/ipc_handler.js";

export class DeleteUser {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute(data: { id: number, user: string }) {
        try {
            return await this.ipcHandler.deleteUser(data);
        } catch(error) {
            console.error(`❌ Error on (DeleteUser) task: ${error}.`);
            const err = new Error("❌ Erro interno ao deletar usuário. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}