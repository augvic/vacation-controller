import { GetUsers } from "../../tasks/get_users.js";
import { Notification } from "./notification.js";
import { Icon } from "./icon.js";
import { EditModal } from "./edit_modal.js";
import { DeleteUser } from "../../tasks/delete_user.js";

export class UsersTableWrapper {
    
    element!: HTMLDivElement
    table!: UsersTable
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-full h-full flex overflow-auto";
    }
    
    private createComponents() {
        this.table = new UsersTable(this.element);
    }
    
}

class UsersTable {
    
    element!: HTMLDivElement
    header!: Header
    body!: Body
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.id = "users-table";
        this.element.className = "w-auto h-auto flex flex-col text-black cursor-default";
    }
    
    private createComponents() {
        this.header = new Header(this.element);
        this.body = new Body(this.element);
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
        new HeaderCell(this.element, "Nome", 1);
        new HeaderCell(this.element, "Vence Em", 2);
        new HeaderCell(this.element, "Status", 3);
        new HeaderCell(this.element, "Dias Restantes", 4);
        new HeaderCell(this.element, "", 5);
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
        this.element.id = `header-${position}`;
    }
    
}

export class Body {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.id = "users-table-body";
        this.element.className = "w-auto h-auto flex flex-col";
    }
    
    private async createComponents() {
        try {
            const getUsersTask = new GetUsers();
            const response = await getUsersTask.execute();
            if (!response.success) {
                new Notification(response.message, "red");
            }
            const users = response.data;
            let userCells: HTMLElement[] = [];
            let admissionCells: HTMLElement[] = [];
            let statusCells: HTMLElement[] = [];
            let daysLeftCells: HTMLElement[] = [];
            users.forEach(user => {
                new BodyRow(this.element, userCells, admissionCells, statusCells, daysLeftCells, user.id, user.user, user.admission, user.status, user.daysLeft);
            });
        } catch(error) {
            new Notification(`${error}`, "red");
        }
    }
    
}

class BodyRow {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, userCells: HTMLElement[], admissionCells: HTMLElement[], statusCells: HTMLElement[], daysLeftCells: HTMLElement[], id: number, user: string, admission: string, status: string, daysLeft: string) {
        this.createSelf(user);
        this.createComponents(userCells, admissionCells, statusCells, daysLeftCells, id, user, admission, status, daysLeft);
        appendTo.appendChild(this.element);
    }
    
    private createSelf(user: string) {
        this.element = document.createElement("div");
        this.element.id = user;
        this.element.className = "h-auto w-auto flex user-row";
    }
    
    private createComponents(userCells: HTMLElement[], admissionCells: HTMLElement[], statusCells: HTMLElement[], daysLeftCells: HTMLElement[], id:number, user: string, admission: string, status: string, daysLeft: string) {
        setTimeout(() => {
            new BodyRowIdCell(this.element, id);
            new BodyRowCell(this.element, userCells, user, 1);
            new BodyRowCell(this.element, admissionCells, admission, 2);
            new BodyRowCell(this.element, statusCells, status, 3);
            new BodyRowCell(this.element, daysLeftCells, daysLeft, 4);
            new BodyRowButtonsCell(this.element, id, user, admission, status, daysLeft);
        }, 500);
    }
    
}

class BodyRowCell {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, cells: HTMLElement[], text: string, position: number) {
        this.createSelf(text);
        appendTo.appendChild(this.element);
        cells.push(this.element);
        let headerElement = document.getElementById(`header-${position}`)!;
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
    icon!: Icon
    deleteIcon!: Icon
    
    constructor(appendTo: HTMLElement, id: number, user: string, admission: string, status: string, daysLeft: string) {
        this.createSelf();
        this.startListeners(id, user, admission, status, daysLeft);
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "h-auto w-auto p-2 flex items-center justify-center whitespace-nowrap gap-x-2";
        this.button = document.createElement("button");
        this.button.className = "w-auto h-auto p-1 bg-gray-900 hover:bg-black cursor-pointer rounded-md transition-colors duration-300"
        this.icon = new Icon("./storage/icons/vacation.png", 5, this.button);
        this.element.appendChild(this.button);
        this.deleteButton = document.createElement("button");
        this.deleteButton.className = "w-auto h-auto p-1 bg-red-700 hover:bg-red-900 cursor-pointer rounded-md transition-colors duration-300";
        this.deleteIcon = new Icon("./storage/icons/delete.png", 5, this.deleteButton);
        this.element.appendChild(this.deleteButton);
    }
    
    private startListeners(id: number, user: string, admission: string, status: string, daysLeft: string) {
        this.button.addEventListener("click", () => {
            new EditModal(String(id), user, admission, status, daysLeft);
        });
        this.deleteButton.addEventListener("click", async () => {
            const deleteUserTask = new DeleteUser();
            const response = await deleteUserTask.execute({ id: id, user: user });
            if (response.success) {
                new Notification(response.message, "green");
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