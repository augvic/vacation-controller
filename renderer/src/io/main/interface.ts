import { TitleBar } from "./title_bar.js";
import { Body } from "./body.js";

export class Interface {
    
    element!: HTMLDivElement
    titleBar!: TitleBar
    body!: Body
    
    constructor() {
        this.createSelf();
        this.createComponents();
        document.body.appendChild(this.element);
    }
    
    private createSelf() {
        this.element = document.createElement("div");
        this.element.className = "h-full w-full bg-white flex flex-col";
    }
    
    private createComponents() {
        this.titleBar = new TitleBar(this.element);
        this.body = new Body(this.element);
    }
    
}