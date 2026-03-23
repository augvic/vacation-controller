import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class GetUsers {
    
    db: DbHandler
    logSystem: LogSystem
    
    constructor() {
        this.db = new DbHandler();
        this.logSystem = new LogSystem();
    }
    
    execute() {
        try {
            const users = this.db.readAllUsers();
            const today = new Date(Date.now()).getTime();
            users.forEach(user => {
                const [day, month, year] = user.admission.split("/").map(Number);
                const dueDate = new Date(year, month - 1, day).getTime();
                if (today >= dueDate) {
                    const newDueDate = new Date(year + 1, month - 1, day).toLocaleDateString("pt-BR");
                    this.db.deleteAllVacations(user.id);
                    this.db.updateUser(user.id, 30, "Não Marcado", newDueDate);
                }
            });
            this.logSystem.write_text(`✅ Funcionários coletados.`);
            return { success: true, message: "✅ Funcionários coletados.", data: users };
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (GetUsers) task: ${error}.`);
            const err = new Error("❌ Erro interno ao coletar funcionários. Contate o administrador.");
            err.name = "";
            throw err;
        }
    }
}