import { Icon } from "../components/icon.js"

export class TitleBar {
    
    element!: HTMLDivElement
    minimizeButton!: MinimizeButton
    maximizeButton!: MaximizeButton
    closeButton!: CloseButton
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "h-[40px] w-full bg-gray-950 flex justify-end app-region-drag";
    }
    
    private createComponents() {
        this.minimizeButton = new MinimizeButton(this.element);
        this.maximizeButton = new MaximizeButton(this.element);
        this.closeButton = new CloseButton(this.element);
    }
    
}

class MinimizeButton {
    
    element!: HTMLButtonElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.startListeners();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("button");
        this.element.className = "bg-gray-950 text-white h-full w-10 hover:bg-gray-700 app-region-no-drag cursor-default transition-colors duration-300 flex items-center justify-center";
        new Icon("./storage/icons/minimize.png", 3, this.element);
    }
    
    private startListeners() {
        this.element.addEventListener("click", () => {
            window.api.minimize();
        });
    }
    
}

class MaximizeButton {
    
    element!: HTMLButtonElement
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.startListeners();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("button");
        this.element.className = "bg-gray-950 text-white h-full w-10 hover:bg-gray-700 app-region-no-drag cursor-default transition-colors duration-300 flex items-center justify-center";
        new Icon("./storage/icons/maximize.png", 3, this.element);

    }
    
    private startListeners() {
        this.element.addEventListener("click", () => {
            window.api.maximize();
        });
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
        this.element.className = "bg-gray-950 text-white h-full w-10 hover:bg-red-500 app-region-no-drag cursor-default transition-colors duration-300 flex items-center justify-center";
        new Icon("./storage/icons/close.png", 3, this.element);
    }
    
    private startListeners() {
        this.element.addEventListener("click", () => {
            window.api.close();
        });
    }
    
}
