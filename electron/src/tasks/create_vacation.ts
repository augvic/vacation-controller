import { DbHandler } from "../components/database";
import { LogSystem } from "../components/log_system";

export class CreateVacation {
    
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
    
    execute(userId: number, user: string, begin: string, end: string): { success: boolean, message: string, data: { status: string, daysLeft: string } } {
        try {
            if (!begin || !end) {
                this.logSystem.write_text(`❌ Preencha todos os campos.`);
                return { success: false, message: `❌ Preencha todos os campos.`, data: { status: "", daysLeft: "" } };
            }
            const [dayBegin, monthBegin, yearBegin] = begin.split("/").map(Number);
            const [dayEnd, monthEnd, yearEnd] = end.split("/").map(Number);
            const dateBegin = new Date(yearBegin, monthBegin - 1, dayBegin).getTime();
            const dateEnd = new Date(yearEnd, monthEnd - 1, dayEnd).getTime();
            const user = this.db.readUser(userId)[0];
            if (dateEnd < dateBegin) {
                return { success: false, message: `❌ Início do período não pode ser depois do fim.`, data: { status: "", daysLeft: "" } };
            }
            const [day, month, year] = user.admission.split("/").map(Number);
            const dueDateBegin = new Date(year - 1, month - 1, day).getTime();
            const dueDateEnd = new Date(year, month - 1, day).getTime();
            if (dateBegin < dueDateBegin || dateEnd < dueDateBegin || dateBegin > dueDateEnd || dateEnd > dueDateEnd) {
                return { success: false, message: `❌ Registro de férias não se enquadrou no período vigente.`, data: { status: "", daysLeft: "" } };    
            }
            const diffDays = this.diffDays(begin, end);
            const userCurrentDaysLeft = parseInt(user.daysLeft);
            const newDaysLeft = userCurrentDaysLeft - diffDays;
            if (diffDays > userCurrentDaysLeft) {
                return { success: false, message: `❌ Período do registro ultrapassa quantidade de dias disponíveis.`, data: { status: "", daysLeft: "" } };    
            }
            this.db.createVacation(userId, begin, end);
            let status = "";
            if (newDaysLeft != 0) {
                status = "Marcado Parcial";
            } else {
                status = "Marcado Completamente";
            }
            this.db.updateUser(userId, newDaysLeft, status, null);
            this.logSystem.write_text(`✅ Registro de férias adicionado.`);
            return { success: true, message: `✅ Registro de férias adicionado.`, data: { status: status, daysLeft: String(newDaysLeft) } };
        } catch(error) {
            this.logSystem.write_error(`❌ Error in (CreateVacation) task: ${error}.`);
            const err = new Error("❌ Erro interno ao adicionar registro de férias. Contate o administrador.")
            err.name = "";
            throw err;
        }
    }
    
}