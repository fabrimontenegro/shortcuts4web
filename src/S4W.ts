const DEFAULT_KEY_COMBINATION_FOR_TOOLTIPS: IKeyCombination = {ctrlKey: true, altKey: false, shiftKey: true, metaKey: false, code: 'KeyK'};
const DEFAULT_KEY_COMBINATION_FOR_LIST_SHORTCUTS: IKeyCombination = {ctrlKey: true, altKey: false, shiftKey: true, metaKey: false, code: 'KeyL'};

const S4W_TOOLTIP_TOP = 1;
const S4W_TOOLTIP_RIGHT = 2;
const S4W_TOOLTIP_BOTTOM = 3;
const S4W_TOOLTIP_LEFT = 4;

enum HTMLElementReferenceType {Element = 1, Id = 2, QuerySelector = 3, TextEquals = 4, TextContains = 5}

class HTMLElementReference{        
    private tooltipPosition: number = S4W_TOOLTIP_BOTTOM;
    private tooltipOffsetX: number = 0;
    private tooltipOffsetY: number = 0;

    private constructor(private referenceType: HTMLElementReferenceType, private referenceStr: string, private doc: Document, private element: HTMLElement, private indexQuerySelector: number)
    {        
        if (this.doc == null){
            this.doc = document;
        }
    }

    public static createByHtmlElement(element: HTMLElement){       
        return new HTMLElementReference(HTMLElementReferenceType.Element, '', null, element, 0);
    }

    public static createById(idHtmlElement: string, doc?: Document){
        if (doc == null){
            doc = document;
        }
        return new HTMLElementReference(HTMLElementReferenceType.Id, idHtmlElement, doc, null, 0);
    }

    public static createByQuerySelector(strQuerySelector: string, doc?: Document, index?: number){
        if (doc == null){
            doc = document;
        }
        if (index == null){
            index = 0;
        }
        return new HTMLElementReference(HTMLElementReferenceType.QuerySelector, strQuerySelector, doc, null, index);
    }

    public static createByTextEquals(strTextEquals: string, doc?: Document){
        return new HTMLElementReference(HTMLElementReferenceType.TextEquals, strTextEquals, doc, null, 0);
    }

    public static createByTextContains(strTextContains: string, doc?: Document){
        return new HTMLElementReference(HTMLElementReferenceType.TextContains, strTextContains, doc, null, 0)
    }

    public static getXPathClean(str: string): string{
        return str.replace(/\"/g, '\"');
    }

    public static getListPossiblesReferencesToHtmlElement(ele: HTMLElement): HTMLElementReference[]{
        // reference by id
        const referenceList: HTMLElementReference[] = [];
        if (ele.id){
            const ref = this.createById(ele.id, ele.ownerDocument);
            referenceList.push(ref)
        }

        // reference by text
        const innerText = ele.innerText;
        if (innerText.trim() > ""){
            var xpath = `//*[text()=\'${this.getXPathClean(innerText)}\']`;
            var node = ele.ownerDocument.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (node == ele){
                const ref = this.createByTextEquals(innerText, ele.ownerDocument);
                referenceList.push(ref);
            }
        }

        // reference by classes names
        const classList = ele.classList;
        if (classList.length > 0){
            const arrClassList: string[] = [];
            let strQuerySelector = "";
            for(const className of classList){
                strQuerySelector += "." + className;
            }
            // Look for element's index in document
            const queryList = ele.ownerDocument.querySelectorAll(strQuerySelector);
            
            let i = 0
            while (queryList.item(i) != ele && i < queryList.length){
                i++;
            }
            if (queryList.item(i) == ele){
                const ref = this.createByQuerySelector(strQuerySelector, ele.ownerDocument, i);
                referenceList.push(ref);
            }
        }
        
        // reference by tag name
        const elementListByTagName = ele.ownerDocument.querySelectorAll(ele.tagName);
        let i = 0;
        while(elementListByTagName.item(i) != ele && i < elementListByTagName.length){
            i++;
        }
        if (elementListByTagName.item(i) == ele){
            const ref = this.createByQuerySelector(ele.tagName, ele.ownerDocument, i);
            referenceList.push(ref);
        }        
        return referenceList;
    }

    public getHTMLElement(): HTMLElement{
        var ele: HTMLElement;
        switch (this.referenceType){
            case HTMLElementReferenceType.Element:
                ele = this.element;
                if (ele == null){
                    console.warn(`Shortcuts4Web: no found HTMLElement object`);
                }
                break;
            case HTMLElementReferenceType.Id:
                ele = document.getElementById(this.referenceStr);
                if (ele == null){
                    console.warn(`Shortcuts4Web: no found HTMLElement by id: ${this.referenceStr}`);
                }
                break;
            case HTMLElementReferenceType.QuerySelector:                
                var nodeEle = document.querySelectorAll(this.referenceStr)[this.indexQuerySelector];
                if (nodeEle instanceof HTMLElement){
                    ele = <HTMLElement>node;
                }
                if (ele == null){
                    console.warn(`Shortcuts4Web: no found HTMLElement by querySelector: ${this.referenceStr}`);
                }
                break;
            case HTMLElementReferenceType.TextEquals:
                // TODO: this was the previous: var xpath = `//*[text()="${this.referenceStr.replace("'", "\\'")}"]`;
                var xpath = `//*[text()=\'${HTMLElementReference.getXPathClean(this.referenceStr)}\']`;
                var node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (node instanceof HTMLElement){
                    ele = <HTMLElement>node;
                }
                if (ele == null){
                    console.warn(`Shortcuts4Web: no found HTMLElement by text equals: ${this.referenceStr}`);
                }
                break;
            case HTMLElementReferenceType.TextContains:                
                // TODO: this was de previous var xpath = `//*[text()[contains(.,'${this.referenceStr.replace("'", "\\'")}')]]`;
                var xpath = `//*[text()[contains(.,\'${HTMLElementReference.getXPathClean(this.referenceStr)}\')]]`;
                var node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;                
                if (node instanceof HTMLElement){
                    ele = <HTMLElement>node;
                }
                if (ele == null){
                    console.warn(`Shortcuts4Web: no found HTMLElement by text contains: ${this.referenceStr}`);
                }
                break;

        }
        return ele;
    }

    public tooltipOptions(tooltipPosition: number, tooltipOffsetX: number = 0, tooltipOffsetY: number = 0){
        this.tooltipPosition = tooltipPosition;
        this.tooltipOffsetX = tooltipOffsetX;
        this.tooltipOffsetY = tooltipOffsetY;
        return this;
    }
    
    public getTooltipPosition(){
        return this.tooltipPosition;
    }
    
    public getTooltipOffsetX(){
        return this.tooltipOffsetX;
    }
    
    public getTooltipOffsetY(){
        return this.tooltipOffsetY;
    }

}

interface IShortcuts4WebAction{
    execute(): Promise<void>;
    getHTMLReference():HTMLElementReference;
}

class ClickHTMLElementAction implements IShortcuts4WebAction{
    public constructor(private elementRef: HTMLElementReference){

    }
    public getHTMLReference(): HTMLElementReference {
        return this.elementRef;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
                var element: HTMLElement = this.elementRef.getHTMLElement();
                if (element){
                    element.click();
                    resolve();
                }else{
                    reject();
                }
            }        
        );
    }
}

class FocusHTMLElementAction implements IShortcuts4WebAction{
    public constructor(private elementRef: HTMLElementReference){

    }
    public getHTMLReference(): HTMLElementReference {
        return this.elementRef;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
            var element: HTMLElement = this.elementRef.getHTMLElement();
            if (element){
                element.focus();
                resolve();
            }else{
                reject();
            }
        });
    }
}


class SetAttributeHTMLElementAction implements IShortcuts4WebAction{
    public constructor(private elementRef: HTMLElementReference, public qualifiedName: string, public value: string){

    }
    public getHTMLReference(): HTMLElementReference {
        return this.elementRef;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
            var element: HTMLElement = this.elementRef.getHTMLElement();
            if (element){
                element.setAttribute(this.qualifiedName, this.value);
                resolve();
            }else{
                reject();
            }
        });
    }
}

class SetValueHTMLElementAction implements IShortcuts4WebAction{
    public constructor(private elementRef: HTMLElementReference, public value: string){

    }
    public getHTMLReference(): HTMLElementReference {
        return this.elementRef;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
            var element: any = this.elementRef.getHTMLElement();
            if (element){                          
                element.value = this.value;                
                resolve();                
            }else{
                reject();
            }
        });
    }
}

class SetInnerTextElementAction implements IShortcuts4WebAction{
    public constructor(private elementRef: HTMLElementReference, public innerText: string){

    }
    public getHTMLReference(): HTMLElementReference {
        return this.elementRef;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
            var element: HTMLElement = this.elementRef.getHTMLElement();
            if (element){
                element.innerText = this.innerText;
                resolve();
            }else{
                reject();
            }
        });
    }
}

class SleepAction implements IShortcuts4WebAction{
    public constructor(public delayMs: number){

    } 

    public getHTMLReference(): HTMLElementReference {
        return null;
    }

    public execute(): Promise<void>{
        return new Promise(resolve => setTimeout(resolve, this.delayMs));
    }
}

class CustomActionOnElement implements IShortcuts4WebAction{
    public constructor(private elementRef: HTMLElementReference, private fnOnElement: Function){

    }
    public getHTMLReference(): HTMLElementReference {
        return this.elementRef;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
            var element: HTMLElement = this.elementRef.getHTMLElement();
            if (element){
                this.fnOnElement(element);
                resolve();
            }else{
                reject();
            }
        });
    }
}

class CustomAction implements IShortcuts4WebAction{
    public constructor(private fn: Function){

    }
    public getHTMLReference(): HTMLElementReference {
        return null;
    }
    public execute(): Promise<void>{
        return new Promise((resolve, reject) => {
            this.fn();
            resolve();
        });
    }
}


interface IKeyCombination{
    code: string;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
}

class S4WShortcutListRenderer{
    private createdHTMLElement: HTMLElement;

    constructor(private shortcutList: S4WShortcut[], private lang: ILang, private onClose: Function){        
    }
    
    showList = () =>{
        this.removeList();
        this.createdHTMLElement = document.createElement("div");
        this.createdHTMLElement.className = "s4w-shortcut-list-base";

        // Title Bar
        var titleBar = document.createElement("div");
        titleBar.className = "s4w-shortcut-list-title-bar";
        var spanTitleText = document.createElement("span");
        spanTitleText.innerText = this.lang.txShortcutListTitle;
        titleBar.appendChild(spanTitleText);
        var closeButton = document.createElement("div");
        closeButton.className = "s4w-shortcut-list-close";
        closeButton.innerText = "X";
        closeButton.addEventListener("click", (e) =>{ 
            this.onClose();
        });
        titleBar.appendChild(closeButton);
        this.createdHTMLElement.appendChild(titleBar);

        // Container
        var container = document.createElement("div");
        container.className = "s4w-shortcut-list-content";
        var ul = document.createElement("ul");
        container.appendChild(ul);
        this.createdHTMLElement.appendChild(container);

        // Add shortcut for shortcut list
        var li = this.createLiElement(S4W.getKeyCombinationText(S4W.getKeyCombinationForListShortcuts()), this.lang.txShortcutListShowHide);
        ul.appendChild(li);

        // Add shortcut for tooltips
        var li = this.createLiElement(S4W.getKeyCombinationText(S4W.getKeyCombinationForTooltips()), this.lang.txShortcutShowTooltips);
        ul.appendChild(li);        
        
        // Add shortcuts
        for(var shortcut of this.shortcutList){
            var li = this.createLiElement(S4W.getKeyCombinationText(shortcut.keyCombination), shortcut.name);            
            ul.appendChild(li);
        }

        // Add to DOM:
        document.body.appendChild(this.createdHTMLElement);
    }

    private createLiElement(keyCombinationText: string, name: string){
        var li = document.createElement("li");
        li.className = "s4w-shortcut-list-item";
        var spanKeys = document.createElement("span");
        spanKeys.className = "s4w-shortcut-list-item-keys";
        spanKeys.innerText = keyCombinationText + ": ";
        li.appendChild(spanKeys);
        var spanName = document.createElement("span");
        spanName.innerText = name;
        li.appendChild(spanName);
        return li;
    }

    removeList = () =>{
        if (this.createdHTMLElement){
            this.createdHTMLElement.remove();
        }
    }
}


class S4WTooltipsRenderer{
    private createdHTMLElements: HTMLElement[];    
    private qOpenLabels: number;
    constructor(private shortcutList: S4WShortcut[], private lang: ILang, private onCloseAllLabels: Function){
        this.createdHTMLElements = [];        
        this.qOpenLabels = 0;
    }

    showTooltips = () => {
        for(var shortcut of this.shortcutList){
            this.renderTooltipsOfSubscription(shortcut);            
        }
    }
    removeTooltips = () => {
        for(var element of this.createdHTMLElements){
            element.parentElement.removeChild(element);
        }        
    }

    private renderTooltipsOfSubscription = (shortcut: S4WShortcut) => {
        var isFirstElement = true;        
        var i = 0; 
        while (isFirstElement && i < shortcut.actionList.length){
            var act = shortcut.actionList[i];
            var elementRef = act.getHTMLReference();
            if (elementRef != null){                    
                var element = elementRef.getHTMLElement();
                var tooltipPosition = elementRef.getTooltipPosition();
                var tooltipOffsetX = elementRef.getTooltipOffsetX();
                var tooltipOffsetY = elementRef.getTooltipOffsetY();
                if (element) this.renderTooltipHTMLElement(shortcut.keyCombination, element, tooltipPosition, tooltipOffsetX, tooltipOffsetY, act);
                isFirstElement = false;                
            }
            i++;
        }
    }

    private renderTooltipHTMLElement = (keyCombination: IKeyCombination, element: HTMLElement, tooltipPosition, tooltipOffsetX, tooltipOffsetY, action: IShortcuts4WebAction) =>{
        var divLabel = document.createElement("div");
        divLabel.className = "s4w-tooltip-label";       
        var keyCombinationText = S4W.getKeyCombinationText(keyCombination);
        var actionText = S4W.getActionText(action);        
        divLabel.innerText = keyCombinationText + ((actionText > '')? (': ' + actionText): '');       
        var rect = element.getBoundingClientRect();        
        switch(tooltipPosition){
            case S4W_TOOLTIP_TOP:
                divLabel.style.bottom = (window.innerHeight - (rect.top + window.scrollY + S4W.defaultTooltipsOffsetY + tooltipOffsetY)) + "px";
                divLabel.style.left = (rect.left + window.scrollX + S4W.defaultTooltipsOffsetX + tooltipOffsetX) + "px";
                break;
            case S4W_TOOLTIP_RIGHT:
                divLabel.style.top = (rect.top + window.scrollY + S4W.defaultTooltipsOffsetY + tooltipOffsetY) + "px";
                divLabel.style.left = (rect.left + window.scrollX + rect.width + S4W.defaultTooltipsOffsetX + tooltipOffsetX) + "px";
                break;
            case S4W_TOOLTIP_LEFT:
                divLabel.style.top = (rect.top + window.scrollY + S4W.defaultTooltipsOffsetY + tooltipOffsetY) + "px";
                divLabel.style.right = (window.innerWidth - (rect.left + window.scrollX + S4W.defaultTooltipsOffsetX + tooltipOffsetX)) + "px";
                break;
            case S4W_TOOLTIP_BOTTOM:
            default:
                divLabel.style.top = (rect.top + window.scrollY + rect.height + S4W.defaultTooltipsOffsetY + tooltipOffsetY) + "px";
                divLabel.style.left = (rect.left + window.scrollX + S4W.defaultTooltipsOffsetX + tooltipOffsetX) + "px";
                break;

        }
        var divClose = document.createElement("div");        
        divClose.className = "s4w-tooltip-label-close";        
        divClose.innerText = "x";
        divClose.addEventListener("click", (e) =>{
            e.stopImmediatePropagation();
            e.stopPropagation();                
            e.preventDefault();
            divLabel.style.display = "none";   
            this.qOpenLabels--;
            if (this.qOpenLabels == 0 && this.onCloseAllLabels){
                this.onCloseAllLabels();
            }            
        });    
        divLabel.appendChild(divClose);
        document.body.appendChild(divLabel);        
        this.qOpenLabels++;
        this.createdHTMLElements.push(divLabel);        
    }

}

interface ILang{    
    txCtrlKey: string;
    txAltKey: string;
    txShiftKey: string;
    txMetaKey: string;
    txClickAction: string;
    txFocusAction: string;
    txSetInnerTextElementAction: string;
    txSetAttributeHTMLElementAction: string;
    txSetValueHTMLElementAction: string;    
    txSleepAction: string;
    txCustomActionOnElement: string;
    txCustomAction: string;
    txShortcutListTitle: string;    
    txShortcutShowTooltips: string;
    txShortcutListShowHide: string;
}

const DEFAULT_LANG: ILang = {    
    txCtrlKey: "Ctrl",
    txAltKey: "Alt",
    txShiftKey: "Shift",
    txMetaKey: "Meta",
    txClickAction: "Click",
    txFocusAction: "Focus",
    txSetInnerTextElementAction: "Set text",
    txSetAttributeHTMLElementAction: "Set",
    txSetValueHTMLElementAction: "Set value",
    txSleepAction: "Sleep miliseconds: ",
    txCustomActionOnElement: "Custom action on element",
    txCustomAction: "Custom action",
    txShortcutListTitle: "Shortcut List",    
    txShortcutShowTooltips: "Shot/hide shortcut tooltips on web elements",
    txShortcutListShowHide: "Show/hide this shortcut list",
}

class S4WShortcut{
    keyCombination: IKeyCombination;
    name: string;
    actionList: IShortcuts4WebAction[];    
    
    constructor(keyCombination, name){
        this.keyCombination = {
            code: keyCombination.code,
            ctrlKey: !!keyCombination.ctrlKey,
            altKey: !!keyCombination.altKey,
            shiftKey: !!keyCombination.shiftKey,
            metaKey: !!keyCombination.metaKey
        };
        this.name = name;
        this.actionList = [];                
    }
    
    public addClickHTMLElement(elementRef: HTMLElementReference){
        var act = new ClickHTMLElementAction(elementRef);
        this.actionList.push(act);
        return this;
    }
    
    public addFocusHTMLElement(elementRef: HTMLElementReference){
        var act = new FocusHTMLElementAction(elementRef);
        this.actionList.push(act);
        return this;
    }

    public addSetAttributeHTMLElement(elementRef: HTMLElementReference, qualifiedName, value){
        var act = new SetAttributeHTMLElementAction(elementRef, qualifiedName, value);
        this.actionList.push(act);
        return this;
    }
    
    public addSetValueHTMLElement(elementRef: HTMLElementReference, value){
        var act = new SetValueHTMLElementAction(elementRef, value);
        this.actionList.push(act);
        return this;
    }

    public addSetInnerTextElement(elementRef: HTMLElementReference, innerText: string){
        var act = new SetInnerTextElementAction(elementRef, innerText);
        this.actionList.push(act);
        return this;
    }

    public addSleep(delayMs: number){
        var act = new SleepAction(delayMs);
        this.actionList.push(act);
        return this;
    }

    public addCustomActionOnElement(elementRef: HTMLElementReference, fnOnElement: Function){
        var act = new CustomActionOnElement(elementRef, fnOnElement);
        this.actionList.push(act);
        return this;
    }

    public addCustomAction(fn: Function){
        var act = new CustomAction(fn);
        this.actionList.push(act);
        return this;
    }
}

abstract class S4W {
    private static shortcutsList: S4WShortcut[] = [];
    private static active: boolean = false;
    private static keyCombinationForTooltips = DEFAULT_KEY_COMBINATION_FOR_TOOLTIPS;
    private static keyCombinationForListShortcuts = DEFAULT_KEY_COMBINATION_FOR_LIST_SHORTCUTS;
    private static lang = DEFAULT_LANG;
    private static tooltips: S4WTooltipsRenderer;
    private static enableShowShortcutList: boolean = true;
    private static shortcutListRenderer: S4WShortcutListRenderer;
    public static defaultTooltipsOffsetX = 0; 
    public static defaultTooltipsOffsetY = 0;

    public static addShortcut(keyCombination: IKeyCombination, name: string): S4WShortcut{
        var shortcut = new S4WShortcut(keyCombination, name);
        this.shortcutsList.push(shortcut);
        return shortcut;
    }

    public static removeShortcut(shortcut: S4WShortcut){
        var index = null;
        var i = 0;
        while (index === null && i < this.shortcutsList.length){
            var s = this.shortcutsList[i];
            if (this.checkKeyCombinationsAreEquals(s.keyCombination, shortcut.keyCombination)){
                index = i;
            }
            i++;
        }
        if (index === null){
            console.warn(`Shortcuts4Web: shortcut not found to remove`, shortcut);
        }else{
            this.shortcutsList.splice(index, 1);
        }
    }

    public static removeAllShortcuts(){        
        var i = 0;
        for (var i = this.shortcutsList.length; i >= 0; i--){
            this.shortcutsList.splice(i, 1);
        }        
    }

    public static setActive = (active: boolean) =>{
        var prevActive: boolean = this.active;
        this.active = active;
        if (this.active != prevActive){
            if(this.active){
                this.subscribeBodyKeyDown();
            }else{
                this.unsubscribeBodyKeyDown();
            }
        }
    }

    public static getActive = ():boolean => {
        return this.active;
    }

    public static setKeyCombinationForTooltips(keyCombination:IKeyCombination){
        this.keyCombinationForTooltips = {
            code: keyCombination.code,
            ctrlKey: !!keyCombination.ctrlKey,
            altKey: !!keyCombination.altKey,
            shiftKey: !!keyCombination.shiftKey,
            metaKey: !!keyCombination.metaKey
        };
    }

    public static getKeyCombinationForTooltips(){
        return this.keyCombinationForTooltips;
    }

    public static setKeyCombinationForListShortcuts(keyCombination:IKeyCombination){
        this.keyCombinationForListShortcuts = {
            code: keyCombination.code,
            ctrlKey: !!keyCombination.ctrlKey,
            altKey: !!keyCombination.altKey,
            shiftKey: !!keyCombination.shiftKey,
            metaKey: !!keyCombination.metaKey
        };
    }

    public static getKeyCombinationForListShortcuts(){
        return this.keyCombinationForListShortcuts;
    }

    private static subscribeBodyKeyDown = () => {        
        window.addEventListener("keydown", this.handleEvent);
    }

    private static unsubscribeBodyKeyDown(){
        window.removeEventListener("keydown", this.handleEvent);
    }

    public static handleEvent = (e: KeyboardEvent) =>{
        if (this.active){
            var eAsKeyCombination: IKeyCombination = {ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey, code: e.code};            
            if(this.checkKeyCombinationsAreEquals(this.keyCombinationForTooltips, eAsKeyCombination)){
                e.stopImmediatePropagation();
                e.stopPropagation();                
                e.preventDefault();
                this.processKeyCombinationForTooltips();                
            }
            if(this.checkKeyCombinationsAreEquals(this.keyCombinationForListShortcuts, eAsKeyCombination)){
                e.stopImmediatePropagation();
                e.stopPropagation();                
                e.preventDefault();
                this.processKeyCombinationForListShortcuts();                
            }
            for(var shortcut of this.shortcutsList){                
                if(this.checkKeyCombinationsAreEquals(shortcut.keyCombination, eAsKeyCombination)){
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.executeActionList(shortcut.actionList);                    
                }
            };       
        }        
    }

    private static checkKeyCombinationsAreEquals(a: IKeyCombination, b: IKeyCombination){
        return (a.ctrlKey == b.ctrlKey && a.altKey == b.altKey && a.shiftKey == b.shiftKey && a.metaKey == b.metaKey && a.code == b.code);
    }

    private static executeActionList = async(actionList: IShortcuts4WebAction[]) => {        
        for(var act of actionList){            
            await act.execute();
        };
    }

    private static processKeyCombinationForTooltips = () =>{
        if (this.tooltips){
            this.removeTooltips();
        }else{
            this.showTooltips();
        }
    }      

    private static processKeyCombinationForListShortcuts = () => {
        if (this.shortcutListRenderer){
            this.removeShortcutList();
        }else{
            this.showShortcutList();
        }
    }

    public static showTooltips(){
        if(! this.tooltips){
            this.tooltips = new S4WTooltipsRenderer(this.shortcutsList, this.lang, this.onCloseAllTooltipsLabels);
            this.tooltips.showTooltips();
        }

    } 

    public static removeTooltips(){
        if (this.tooltips){
            this.tooltips.removeTooltips();
            this.tooltips = null;
        }    
    }
    private static onCloseAllTooltipsLabels = ()=>{
        this.removeTooltips();
    }

    public static setEnableShowShortcutList(value: boolean){
        this.enableShowShortcutList = !!value;
    }
    
    public static showShortcutList(){
        if (this.enableShowShortcutList && ! this.shortcutListRenderer){
            this.shortcutListRenderer = new S4WShortcutListRenderer(this.shortcutsList, this.lang, this.onCloseShortcutList);
            this.shortcutListRenderer.showList();
        }
    }

    public static removeShortcutList(){
        if (this.shortcutListRenderer){
            this.shortcutListRenderer.removeList();
            this.shortcutListRenderer = null;
        }
    }

    private static onCloseShortcutList = () => {
        this.removeShortcutList();
    }

    public static setLang = (lang: ILang) => {
        // Only assign not empty translations
        var keys = Object.keys(lang);
        for(var k of keys){
            if (k in this.lang){
                var text = lang[k];
                if (text > ''){
                    this.lang[k] = text;
                }
            }
        }
        
    }

    public static getKeyCombinationText(keyCombination: IKeyCombination){        
        var strKeys: string[] = [];
        if(keyCombination.metaKey){
            strKeys.push(this.lang.txMetaKey);
        }
        if (keyCombination.ctrlKey){
            strKeys.push(this.lang.txCtrlKey);
        }
        if (keyCombination.altKey){
            strKeys.push(this.lang.txAltKey);
        }
        if(keyCombination.shiftKey){
            strKeys.push(this.lang.txShiftKey)
        }
        if(keyCombination.code){                        
            var code = '[' + keyCombination.code + ']';
            strKeys.push(code);
        }
        return strKeys.join(" + ");
    }   

    public static elementByObject(element: HTMLElement): HTMLElementReference{        
        return HTMLElementReference.createByHtmlElement(element);
    }

    public static elementById(idHtmlElement: string, doc?: Document): HTMLElementReference{
        if (doc == null){
            doc = document;
        }
        return HTMLElementReference.createById(idHtmlElement, doc);
    }

    public static elementByQuerySelector(strQuerySelector: string, doc?: Document): HTMLElementReference{
        if (doc == null){
            doc = document;
        }
        return HTMLElementReference.createByQuerySelector(strQuerySelector, doc);
    }

    public static elementByTextEquals(strTextEquals: string, doc?: Document): HTMLElementReference{
        return HTMLElementReference.createByTextEquals( strTextEquals, doc);
    }

    public static elementByTextContains(strTextContains: string, doc: Document = null): HTMLElementReference{
        return HTMLElementReference.createByTextContains(strTextContains, doc);
    }

    public static getActionText(action: IShortcuts4WebAction){
        var text = '';
        if(action instanceof ClickHTMLElementAction){
            text = this.lang.txClickAction;
        }else if(action instanceof FocusHTMLElementAction){
            text = this.lang.txFocusAction;
        }else if(action instanceof SetInnerTextElementAction){
            text = this.lang.txSetInnerTextElementAction + ' ' + (action as SetInnerTextElementAction).innerText;
        }else if (action instanceof SetAttributeHTMLElementAction){            
            text = this.lang.txSetAttributeHTMLElementAction + ' ' + (action as SetAttributeHTMLElementAction).qualifiedName + " = " + (action as SetAttributeHTMLElementAction).value;
        }else if (action instanceof SetValueHTMLElementAction){
            text = this.lang.txSetValueHTMLElementAction + ' = ' + (action as SetValueHTMLElementAction).value;
        }else if(action instanceof SleepAction){
            text = this.lang.txSleepAction + ' ' + (action as SleepAction).delayMs;
        }else if (action instanceof CustomActionOnElement){
            text = this.lang.txCustomActionOnElement;
        }else if (action instanceof CustomAction){
            text = this.lang.txCustomAction;
        }
        return text;
    }
    
    public static getShortcutsAsArray(){
        var arr: any[] = [];
        for(var shortcut of this.shortcutsList){
            var keyCombinationText = this.getKeyCombinationText(shortcut.keyCombination);                        
            arr.push({name: shortcut.name, keyCombinationText: keyCombinationText, actions: shortcut.actionList});
        }
        return arr;
    }
    
}

