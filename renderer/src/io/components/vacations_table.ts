import { Icon } from "./icon.js";
import { GetVacations } from "../../tasks/get_vacations.js";
import { DeleteVacation } from "../../tasks/delete_vacation.js";
import { Notification } from "./notification.js";
import { Body } from "./users_table.js";

export class VacationsTableWrapper {
    
    element!: HTMLDivElement
    table!: VacationsTable
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-[300px] h-[200px] flex justify-center overflow-auto";
    }
    
    private createComponents() {
        this.table = new VacationsTable(this.element);
    }
    
}

class VacationsTable {
    
    element!: HTMLDivElement
    header!: Header
    body!: VacationsTableBody
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.id = "vacations-table";
        this.element.className = "w-auto h-auto flex flex-col text-black cursor-default";
    }
    
    private createComponents() {
        this.header = new Header(this.element);
        this.body = new VacationsTableBody(this.element);
    }
    
}

class Header {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-auto h-auto flex bg-gray-300 rounded-t-lg sticky top-0";
    }
    
    private createComponents() {
        new HeaderCell(this.element, "Início", 1);
        new HeaderCell(this.element, "Fim", 2);
        new HeaderCell(this.element, "", 3);
    }
    
}

class HeaderCell {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, text: string, position: number) {
        this.createSelf(text, position);
        appendTo.appendChild(this.element);
    }
    
    private createSelf(text: string, position: number) {
        this.element = document.createElement("div");
        this.element.className = "h-auto w-auto p-2 flex items-center justify-center whitespace-nowrap";
        this.element.innerText = text;
        this.element.id = `vacations-header-${position}`;
    }
    
}

export class VacationsTableBody {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        appendTo.appendChild(this.element);
        this.createComponents();
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.id = "vacations-table-body";
        this.element.className = "w-auto h-auto flex flex-col";
    }
    
    private async createComponents() {
        try {
            const getVacationsTask = new GetVacations();
            setTimeout(async () => {
                const userId = document.getElementById("edit-modal-user-id")!.innerText[0];
                const response = await getVacationsTask.execute({ userId: parseInt(userId) });
                if (!response.success) {
                    new Notification(response.message, "red");
                }
                const vacations = response.data;
                let beginCells: HTMLElement[] = [];
                let endCells: HTMLElement[] = [];
                vacations.forEach(vacation => {
                    new BodyRow(this.element, beginCells, endCells, vacation.id, vacation.begin, vacation.end);
                });
            }, 500);
        } catch(error) {
            new Notification(`${error}`, "red");
        }
    }
    
}

class BodyRow {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, beginCells: HTMLElement[], endCells: HTMLElement[], id: number, begin: string, end: string) {
        this.createSelf();
        appendTo.appendChild(this.element);
        this.createComponents(beginCells, endCells, id, begin, end);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "h-auto w-auto flex";
    }
    
    private createComponents(beginCells: HTMLElement[], endCells: HTMLElement[], id: number, begin: string, end: string) {
        new BodyRowIdCell(this.element, id);
        new BodyRowCell(this.element, beginCells, begin, 1);
        new BodyRowCell(this.element, endCells, end, 2);
        new BodyRowButtonsCell(this.element, id);
    }
    
}

class BodyRowCell {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, cells: HTMLElement[], text: string, position: number) {
        this.createSelf(text);
        appendTo.appendChild(this.element);
        cells.push(this.element);
        let headerElement = document.getElementById(`vacations-header-${position}`)!;
        let width = headerElement.offsetWidth;
        cells.forEach(cell => {
            if (cell.offsetWidth > width) {
                width = cell.offsetWidth;
            }
        });
        cells.forEach(cell => {
            cell.style.width = width + "px";
        });
        headerElement.style.width = width + "px";
    }
    
    private createSelf(text: string) {
        this.element = document.createElement("div");
        this.element.className = "h-auto w-auto p-2 flex items-center justify-center whitespace-nowrap";
        this.element.innerText = text;
    }
    
}

class BodyRowButtonsCell {
    
    element!: HTMLDivElement
    button!: HTMLButtonElement
    deleteButton!: HTMLButtonElement
    deleteIcon!: Icon
    
    constructor(appendTo: HTMLElement, id: number) {
        this.createSelf();
        this.startListeners(id);
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "h-auto w-auto p-2 flex items-center justify-center whitespace-nowrap";
        this.deleteButton = document.createElement("button");
        this.deleteButton.className = "w-auto h-auto p-1 bg-red-700 hover:bg-red-900 cursor-pointer rounded-md transition-colors duration-300";
        this.deleteIcon = new Icon("./storage/icons/delete.png", 5, this.deleteButton);
        this.element.appendChild(this.deleteButton);
    }
    
    private startListeners(id: number) {
        this.deleteButton.addEventListener("click", async () => {
            const deleteVacationTask = new DeleteVacation();
            const response = await deleteVacationTask.execute({ id: id });
            if (response.success) {
                new Notification(response.message, "green");
                document.getElementById("vacations-table-body")!.remove();
                new VacationsTableBody(document.getElementById("vacations-table")!);
                document.getElementById("edit-modal-days-left")!.innerText = `Dias Restantes: ${response.data.daysLeft}`;
                document.getElementById("edit-modal-status")!.innerText = `Status: ${response.data.status}`;
                document.getElementById("users-table-body")!.remove();
                new Body(document.getElementById("users-table")!);
            } else {
                new Notification(response.message, "red");
            }
        });
    }
    
}

class BodyRowIdCell {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, text: number) {
        this.createSelf(text);
        appendTo.appendChild(this.element);
    }
    
    private createSelf(text: number) {
        this.element = document.createElement("div");
        this.element.className = "hidden";
        this.element.innerText = String(text);
    }
    
}