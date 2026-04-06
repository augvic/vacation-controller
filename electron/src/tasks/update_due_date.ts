import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class UpdateDueDate {
    
    db: DbHandler
    logSystem: LogSystem
    
    constructor() {
        this.db = new DbHandler();
        this.logSystem = new LogSystem();
    }
    
    execute(userId: number, dueDate: string): { success: boolean, message: string } {
        try {
            const [day, month, year] = dueDate.split("/").map(Number);
            const limit = new Date(year + 1, month - 2, day).toLocaleDateString("pt-BR");
            this.db.updateDueDate(userId, dueDate, limit);
            return { success: true, message: `✅ Data atualizada.` };
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (UpdateDueDate) task: ${error}.`);
            const err = new Error("❌ Erro interno ao adicionar funcionário. Contate o administrador.")
            err.name = "";
            throw err;
        }
    }
}