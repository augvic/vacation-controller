import { app } from "electron";
import { join } from "path";
import { existsSync, mkdirSync, appendFileSync } from "fs";

export class LogSystem {
    
    logPath: string
    
    constructor() {
        this.logPath = "";
        if (app.isPackaged) {
            this.logPath = join(process.resourcesPath, "logs");
        } else {
            this.logPath = join(__dirname, "..", "..", "storage", "logs");
        }
        if (!existsSync(this.logPath)) {
            mkdirSync(this.logPath);
        }
    }
    
    write_error(text: string) {
        appendFileSync(`${this.logPath}/errors.txt`, `⌚ ${new Date(Date.now()).toLocaleString("pt-BR")}\n` + text + "\n\n");
    }
    
    write_text(text: string) {
        appendFileSync(`${this.logPath}/runtime.txt`, `⌚ ${new Date(Date.now()).toLocaleString("pt-BR")}\n` + text + "\n\n");
    }
    
}