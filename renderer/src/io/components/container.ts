import { Icon } from "./icon.js";
import { UsersTableWrapper } from "./users_table.js";
import { AddModal } from "./add_modal.js";
import { Body } from "./users_table.js";

export class Container {
    
    element!: HTMLDivElement
    titleBar!: TitleBar
    table!: UsersTableWrapper
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-full h-full flex flex-col bg-white rounded-lg p-3 gap-y-2";
    }
    
    private createComponents() {
        this.titleBar = new TitleBar(this.element);
        this.table = new UsersTableWrapper(this.element);
    }
    
}

class TitleBar {
    
    element!: HTMLDivElement
    searchInput!: SearchInput
    searchButton!: SearchButton
    addButton!: AddButton
    refreshButton!: RefreshButton
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-full h-auto flex gap-x-2";
    }
    
    private createComponents() {
        this.searchInput = new SearchInput(this.element);
        this.searchButton = new SearchButton(this.element);
        this.addButton = new AddButton(this.element);
        this.refreshButton = new RefreshButton(this.element);
    }
    
}

class SearchInput {
    
    element!: HTMLInputElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("input");
        this.element.id = "search-input";
        this.element.className = "w-[400px] h-full p-1 bg-white border border-gray-300 rounded-md outline-none";
        this.element.placeholder = "Pesquisar";
    }
    
}

class SearchButton {
    
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
        this.element.className = "w-auto h-auto p-1 bg-blue-700 hover:bg-blue-900 cursor-pointer rounded-md transition-colors duration-300";
    }
    
    private createComponents() {
        this.icon = new Icon("./storage/icons/magnifying_glass.png", 5, this.element);
    }
    
    private startListeners() {
        this.element.addEventListener("click", () => {
            const rows = document.querySelectorAll(".user-row");
            const toSearch = (document.getElementById("search-input") as HTMLInputElement)!.value;
            if (toSearch == "") {
                rows.forEach(element => {
                    const row = element as HTMLElement;
                    row.style.display = "flex";
                });
                return;
            }
            rows.forEach(element => {
                const row = element as HTMLElement;
                if (!row.id.includes(toSearch)) {
                    row.style.display = "none";
                } else {
                    row.style.display = "flex";
                }
            });
        });
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
        this.element.addEventListener("click", () => {
            new AddModal();
        });
    }
    
}

class RefreshButton {
    
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
        this.element.className = "w-auto h-auto p-1 bg-amber-700 hover:bg-amber-900 cursor-pointer rounded-md transition-colors duration-300";
    }
    
    private createComponents() {
        this.icon = new Icon("./storage/icons/refresh.png", 5, this.element);
    }
    
    private startListeners() {
        this.element.addEventListener("click", async () => {
            document.getElementById("users-table-body")!.remove();
            new Body(document.getElementById("users-table")!)
        });
    }
    
}