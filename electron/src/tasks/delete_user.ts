import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class DeleteUser {
    
    db: DbHandler
    logSystem: LogSystem
    
    constructor() {
        this.db = new DbHandler();
        this.logSystem = new LogSystem();
    }
    
    execute(id: number, user: string) {
        try {
            this.db.deleteUser(id);
            this.db.deleteAllVacations(id);
            return { success: true, message: `✅ Funcionário (${user}) excluído.` }
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (DeleteUser) task: ${error}.`);
            const err = new Error("❌ Erro interno ao remover funcionário. Contate o administrador.")
            err.name = "";
            throw err;
        }
    }
}