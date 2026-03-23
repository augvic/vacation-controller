import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class GetVacations {
    
    db: DbHandler
    logSystem: LogSystem
    
    constructor() {
        this.db = new DbHandler();
        this.logSystem = new LogSystem();
    }
    
    execute(userId: number) {
        try {
            const vacations = this.db.readAllVacations(userId);
            this.logSystem.write_text(`✅ Registros coletados.`);
            return { success: true, message: "✅ Registros coletados.", data: vacations };
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (GetVacations) task: ${error}.`);
            const err = new Error("❌ Erro interno ao coletar registros. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}