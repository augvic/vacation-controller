import { Container } from "../components/container.js";

export class Body {
    
    element!: HTMLDivElement
    container!: BodyContainer
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.id = "app-body";
        this.element.className = "w-full flex";
        this.element.style.height = "calc(100% - 40px)";
    }
    
    private createComponents() {
        this.container = new BodyContainer(this.element);
    }
    
}

class BodyContainer {
    
    element!: HTMLDivElement
    container!: Container
    
    constructor(appendTo: HTMLElement) {
        this.createSelf();
        this.createComponents();
        appendTo.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "w-full h-auto flex flex-1 bg-gray-300 p-3";
    }
    
    private createComponents() {
        this.container = new Container(this.element);
    }
    
}