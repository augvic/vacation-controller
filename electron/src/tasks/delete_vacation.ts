import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class DeleteVacation {
    
    db: DbHandler
    logSystem: LogSystem
    
    constructor() {
        this.db = new DbHandler();
        this.logSystem = new LogSystem();
    }
    
    private diffDays(begin: string, end: string): number {
        const [dayBegin, monthBegin, yearBegin] = begin.split("/").map(Number);
        const [dayEnd, monthEnd, yearEnd] = end.split("/").map(Number);
        const dateBegin = new Date(yearBegin, monthBegin - 1, dayBegin);
        const dateEnd = new Date(yearEnd, monthEnd - 1, dayEnd);
        const diffMs = dateEnd.getTime() - dateBegin.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.round(diffDays) + 1;
    }
    
    execute(id: number) {
        try {
            const vacation = this.db.readVacation(id)[0]; 
            const userId = vacation.userId;
            const vacationBegin = vacation.begin;
            const vacationEnd = vacation.end;
            const vacationDays = this.diffDays(vacationBegin, vacationEnd);
            const userCurrentDays = parseInt(this.db.readUser(parseInt(userId))[0].daysLeft);
            const userNewDaysLeft = vacationDays + userCurrentDays;
            this.db.deleteVacation(id);
            let status = "";
            if (userNewDaysLeft == 30) {
                status = "Não Marcado";
            } else {
                status = "Marcado Parcial";
            }
            this.db.updateUser(parseInt(userId), userNewDaysLeft, status, null);
            return { success: true, message: `✅ Registro excluído.`, data: { status: status, daysLeft: String(userNewDaysLeft) } };
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (DeleteVacation) task: ${error}.`);
            const err = new Error("❌ Erro interno ao remover registro. Contate o administrador.")
            err.name = "";
            throw err;
        }
    }
}