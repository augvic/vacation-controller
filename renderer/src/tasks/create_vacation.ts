import { IpcHandler } from "../components/ipc_handler.js";

export class CreateVacation {
    
    ipcHandler: IpcHandler
    
    constructor() {
        this.ipcHandler = new IpcHandler();
    }
    
    async execute(data: { userId: number, user: string, begin: string, end: string }) {
        try {
            if (data.begin) {
                const [year, month, day] = data.begin.split("-");
                data.begin = `${day}/${month}/${year}`;
            }
            if (data.end) {
                const [year, month, day] = data.end.split("-");
                data.end = `${day}/${month}/${year}`;
            }
            return await this.ipcHandler.createVacation(data);
        } catch(error) {
            console.error(`❌ Error on (CreateVacation) task: ${error}.`);
            const err = new Error("❌ Erro interno ao criar registro de férias. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}