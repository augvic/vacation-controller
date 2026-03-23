import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class CreateUser {
    
    db: DbHandler
    logSystem: LogSystem
    
    constructor() {
        this.db = new DbHandler();
        this.logSystem = new LogSystem();
    }
    
    execute(user: string, admission: string): { success: boolean, message: string } {
        try {
            if (!user || !admission) {
                this.logSystem.write_text(`❌ Preencha todos os campos.`);
                return { success: false, message: `❌ Preencha todos os campos.` };    
            }
            const currentYear = new Date(Date.now()).getFullYear();
            const today = new Date(Date.now()).getTime();
            const [day, month, year] = admission.split("/").map(Number);
            const dueDate = new Date(currentYear, month - 1, day).getTime();
            let date;
            if (today < dueDate) {
                date = new Date(currentYear, month - 1, day).toLocaleDateString("pt-BR");
            } else {
                date = new Date(currentYear + 1, month - 1, day).toLocaleDateString("pt-BR");
            }
            this.db.createUser(user, date);
            this.logSystem.write_text(`✅ Funcionário (${user}) adicionado.`);
            return { success: true, message: `✅ Funcionário (${user}) adicionado.` };
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (CreateUser) task: ${error}.`);
            const err = new Error("❌ Erro interno ao adicionar funcionário. Contate o administrador.")
            err.name = "";
            throw err;
        }
    }
}