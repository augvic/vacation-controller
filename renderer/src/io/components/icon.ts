export class Icon {
    
    element!: HTMLImageElement
    
    constructor(src: string, size: number, appendTo: HTMLElement) {
        this.createSelf(src, size);
        appendTo.appendChild(this.element);
    }
    
    private createSelf(src: string, size: number) {
        this.element = document.createElement("img");
        this.element.src = src;
        if (size == 5){
            this.element.className = "size-5";
        } else{
            this.element.className = "size-3";
        }
    }
    
}
