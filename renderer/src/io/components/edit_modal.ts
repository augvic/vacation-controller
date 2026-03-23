import { Icon } from "./icon.js";
import { CreateVacation } from "../../tasks/create_vacation.js";
import { Notification } from "./notification.js";
import { VacationsTableBody } from "./vacations_table.js";
import { VacationsTableWrapper } from "./vacations_table.js";
import { Body } from "./users_table.js";

export class EditModal {
    
    element!: HTMLDivElement
    container!: Container
    
    constructor(id: string, user: string, admission: string, status: string, daysLeft: string) {
        this.createSelf();
        this.createComponents(id, user, admission, status, daysLeft);
        document.getElementById("app-body")!.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.id = "add-modal";
        this.element.className = "w-full h-full bg-black/70 flex justify-center items-center fixed z-50";
    }
    
    private createComponents(id: string, user: string, admission: string, status: string, daysLeft: string) {
        this.container = new Container(this.element, id, user, admission, status, daysLeft);
    }
    
}

class Container {
    
    element!: HTMLDivElement
    titleBar!: TitleBar
    body!: ContainerBody
    
    constructor(appendTo: HTMLElement, id: string, user: string, admission: string, status: string, daysLeft: string) {
        this.createSelf();
        this.createComponents(id, user, admission, status, daysLeft);
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-auto h-auto bg-white rounded-lg p-3 flex flex-col gap-y-2";
    }
    
    private createComponents(id: string, user: string, admission: string, status: string, daysLeft: string) {
        this.titleBar = new TitleBar(this.element);
        this.body = new ContainerBody(this.element, id, user, admission, status, daysLeft);
    }
    
}

class TitleBar {
    
    element!: HTMLDivElement
    button!: CloseButton
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-full h-auto flex justify-end items-center";
    }
    
    private createComponents() {
        this.button = new CloseButton(this.element);
    }
    
}

class CloseButton {
    
    element!: HTMLButtonElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.startListeners();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("button");
        this.element.innerText = "×";
        this.element.className = "w-auto h-auto bg-red-700 hover:bg-red-900 rounded-full text-white px-2 cursor-pointer transition-colors duration-300";
    }
    
    private startListeners() {
        this.element.addEventListener("click", () => {
            document.getElementById("add-modal")!.remove();
        });
    }
    
}

class ContainerBody {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, id: string, user: string, admission: string, status: string, daysLeft: string) {
        this.createSelf();
        this.createComponents(id, user, admission, status, daysLeft);
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-full h-auto flex flex-col justify-center items-center gap-y-2";
    }
    
    private createComponents(id: string, user: string, admission: string, status: string, daysLeft: string) {
        new Info(this.element, id, "user-id", true, "ID");
        new Info(this.element, user, "name", false, "Nome");
        new Info(this.element, admission, "admission", false, "Vence Em");
        new Info(this.element, status, "status", false, "Status");
        new Info(this.element, daysLeft, "days-left", false, "Dias Restantes");
        new Input(this.element, "Início do Período:", "begin", "date", "Início:");
        new Input(this.element, "Fim do Período:", "end", "date", "Fim:");
        new AddButton(this.element);
        new VacationsTableWrapper(this.element);
    }
    
}

class Info {
    
    element!: HTMLDivElement
    
    constructor(appendTo: HTMLElement, value: string, id: string, hidden: boolean, prefix: string) {
        this.createSelf(value, id, hidden, prefix);
        appendTo.appendChild(this.element);
    }
    
    private createSelf(value: string, id: string, hidden: boolean, prefix: string) {
        this.element = document.createElement("div");
        this.element.innerText = `${prefix}: ${value}`;
        if (id == "user-id") {
            this.element.innerText = `${value}`;
        }
        this.element.id = `edit-modal-${id}`;
        this.element.className = "w-auto h-auto cursor-default";
        if (hidden) {
            this.element.style.display = "none";
        }
    }
    
}

class Input {
    
    element!: HTMLInputElement
    div!: HTMLDivElement
    label!: HTMLLabelElement
    
    constructor(appendTo: HTMLElement, placeholder: string, id: string, type: string, label: string) {
        this.createSelf(placeholder, id, type, label);
        appendTo.appendChild(this.div);
    }
    
    private createSelf(placeholder: string, id: string, type: string, label: string) {
        this.div = document.createElement("div");
        this.div.className = "flex flex-col gap-y-1"
        this.label = document.createElement("label");
        this.label.innerText = label;
        this.element = document.createElement("input");
        this.element.placeholder = placeholder;
        this.element.id = `edit-modal-${id}`;
        this.element.type = type;
        this.element.className = "w-[300px] h-[30px] bg-white outline-none border border-gray-300 rounded-md p-2";
        this.div.appendChild(this.label);
        this.div.appendChild(this.element);
    }
    
}

class AddButton {
    
    element!: HTMLButtonElement
    icon!: Icon
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        this.startListeners();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("button");
        this.element.className = "w-auto h-auto p-1 bg-green-700 hover:bg-green-900 cursor-pointer rounded-md transition-colors duration-300";
    }
    
    private createComponents() {
        this.icon = new Icon("./storage/icons/plus.png", 5, this.element);
    }
    
    private startListeners() {
        this.element.addEventListener("click", async () => {
            const createVacationTask = new CreateVacation();
            const userId = document.getElementById("edit-modal-user-id")!.innerText;
            const user = (document.getElementById("edit-modal-name")! as HTMLDivElement).innerText;
            const begin = (document.getElementById("edit-modal-begin")! as HTMLInputElement).value;
            const end = (document.getElementById("edit-modal-end")! as HTMLInputElement).value;
            const response = await createVacationTask.execute({ userId: parseInt(userId), user: user, begin: begin, end: end });
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
