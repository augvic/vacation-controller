import { IpcHandler } from "../components/ipc_handler.js";

export class CreateUser {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute(data: { user: string, admission: string }) {
        try {
            if (data.admission) {
                const [year, month, day] = data.admission.split("-");
                data.admission = `${day}/${month}/${year}`;
            }
            return await this.ipcHandler.createUser(data);
        } catch(error) {
            console.error(`❌ Error on (CreateUser) task: ${error}.`);
            const err = new Error("❌ Erro interno ao criar usuário. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}