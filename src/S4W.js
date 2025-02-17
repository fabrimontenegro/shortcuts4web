var _a;
const DEFAULT_KEY_COMBINATION_FOR_TOOLTIPS = { ctrlKey: true, altKey: false, shiftKey: true, metaKey: false, code: 'KeyK' };
const DEFAULT_KEY_COMBINATION_FOR_LIST_SHORTCUTS = { ctrlKey: true, altKey: false, shiftKey: true, metaKey: false, code: 'KeyL' };
export var S4WToolTipPosition;
(function (S4WToolTipPosition) {
    S4WToolTipPosition[S4WToolTipPosition["Top"] = 1] = "Top";
    S4WToolTipPosition[S4WToolTipPosition["Right"] = 2] = "Right";
    S4WToolTipPosition[S4WToolTipPosition["Bottom"] = 3] = "Bottom";
    S4WToolTipPosition[S4WToolTipPosition["Left"] = 4] = "Left";
})(S4WToolTipPosition || (S4WToolTipPosition = {}));
var HTMLElementReferenceType;
(function (HTMLElementReferenceType) {
    HTMLElementReferenceType[HTMLElementReferenceType["Element"] = 1] = "Element";
    HTMLElementReferenceType[HTMLElementReferenceType["Id"] = 2] = "Id";
    HTMLElementReferenceType[HTMLElementReferenceType["QuerySelector"] = 3] = "QuerySelector";
    HTMLElementReferenceType[HTMLElementReferenceType["TextEquals"] = 4] = "TextEquals";
    HTMLElementReferenceType[HTMLElementReferenceType["TextContains"] = 5] = "TextContains";
})(HTMLElementReferenceType || (HTMLElementReferenceType = {}));
class HTMLElementReference {
    constructor(referenceType, referenceStr, doc, element, indexQuerySelector) {
        this.referenceType = referenceType;
        this.referenceStr = referenceStr;
        this.doc = doc;
        this.element = element;
        this.indexQuerySelector = indexQuerySelector;
        this.tooltipPosition = S4WToolTipPosition.Bottom;
        this.tooltipOffsetX = 0;
        this.tooltipOffsetY = 0;
        if (this.doc == null) {
            this.doc = document;
        }
    }
    static createByHtmlElement(element) {
        return new HTMLElementReference(HTMLElementReferenceType.Element, '', null, element, 0);
    }
    static createById(idHtmlElement, doc) {
        if (doc == null) {
            doc = document;
        }
        return new HTMLElementReference(HTMLElementReferenceType.Id, idHtmlElement, doc, null, 0);
    }
    static createByQuerySelector(strQuerySelector, doc, index) {
        if (doc == null) {
            doc = document;
        }
        if (index == null) {
            index = 0;
        }
        return new HTMLElementReference(HTMLElementReferenceType.QuerySelector, strQuerySelector, doc, null, index);
    }
    static createByTextEquals(strTextEquals, doc) {
        return new HTMLElementReference(HTMLElementReferenceType.TextEquals, strTextEquals, doc, null, 0);
    }
    static createByTextContains(strTextContains, doc) {
        return new HTMLElementReference(HTMLElementReferenceType.TextContains, strTextContains, doc, null, 0);
    }
    static getXPathClean(str) {
        return str.replace(/\"/g, '\"');
    }
    static getListPossiblesReferencesToHtmlElement(ele) {
        // reference by id
        const referenceList = [];
        if (ele.id) {
            const ref = this.createById(ele.id, ele.ownerDocument);
            referenceList.push(ref);
        }
        // reference by text
        const innerText = ele.innerText;
        if (innerText.trim() > "") {
            var xpath = `//*[text()=\'${this.getXPathClean(innerText)}\']`;
            var node = ele.ownerDocument.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (node == ele) {
                const ref = this.createByTextEquals(innerText, ele.ownerDocument);
                referenceList.push(ref);
            }
        }
        // reference by classes names
        const classList = ele.classList;
        if (classList.length > 0) {
            const arrClassList = [];
            let strQuerySelector = "";
            for (const className of classList) {
                strQuerySelector += "." + className;
            }
            // Look for element's index in document
            const queryList = ele.ownerDocument.querySelectorAll(strQuerySelector);
            let i = 0;
            while (queryList.item(i) != ele && i < queryList.length) {
                i++;
            }
            if (queryList.item(i) == ele) {
                const ref = this.createByQuerySelector(strQuerySelector, ele.ownerDocument, i);
                referenceList.push(ref);
            }
        }
        // reference by tag name
        const elementListByTagName = ele.ownerDocument.querySelectorAll(ele.tagName);
        let i = 0;
        while (elementListByTagName.item(i) != ele && i < elementListByTagName.length) {
            i++;
        }
        if (elementListByTagName.item(i) == ele) {
            const ref = this.createByQuerySelector(ele.tagName, ele.ownerDocument, i);
            referenceList.push(ref);
        }
        return referenceList;
    }
    getHTMLElement() {
        var ele;
        switch (this.referenceType) {
            case HTMLElementReferenceType.Element:
                ele = this.element;
                if (ele == null) {
                    console.warn(`Shortcuts4Web: no found HTMLElement object`);
                }
                break;
            case HTMLElementReferenceType.Id:
                ele = document.getElementById(this.referenceStr);
                if (ele == null) {
                    console.warn(`Shortcuts4Web: no found HTMLElement by id: ${this.referenceStr}`);
                }
                break;
            case HTMLElementReferenceType.QuerySelector:
                var nodeEle = document.querySelectorAll(this.referenceStr)[this.indexQuerySelector];
                if (nodeEle instanceof HTMLElement) {
                    ele = node;
                }
                if (ele == null) {
                    console.warn(`Shortcuts4Web: no found HTMLElement by querySelector: ${this.referenceStr}`);
                }
                break;
            case HTMLElementReferenceType.TextEquals:
                // TODO: this was the previous: var xpath = `//*[text()="${this.referenceStr.replace("'", "\\'")}"]`;
                var xpath = `//*[text()=\'${HTMLElementReference.getXPathClean(this.referenceStr)}\']`;
                var node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (node instanceof HTMLElement) {
                    ele = node;
                }
                if (ele == null) {
                    console.warn(`Shortcuts4Web: no found HTMLElement by text equals: ${this.referenceStr}`);
                }
                break;
            case HTMLElementReferenceType.TextContains:
                // TODO: this was de previous var xpath = `//*[text()[contains(.,'${this.referenceStr.replace("'", "\\'")}')]]`;
                var xpath = `//*[text()[contains(.,\'${HTMLElementReference.getXPathClean(this.referenceStr)}\')]]`;
                var node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (node instanceof HTMLElement) {
                    ele = node;
                }
                if (ele == null) {
                    console.warn(`Shortcuts4Web: no found HTMLElement by text contains: ${this.referenceStr}`);
                }
                break;
        }
        return ele;
    }
    tooltipOptions(tooltipPosition, tooltipOffsetX = 0, tooltipOffsetY = 0) {
        this.tooltipPosition = tooltipPosition;
        this.tooltipOffsetX = tooltipOffsetX;
        this.tooltipOffsetY = tooltipOffsetY;
        return this;
    }
    getTooltipPosition() {
        return this.tooltipPosition;
    }
    getTooltipOffsetX() {
        return this.tooltipOffsetX;
    }
    getTooltipOffsetY() {
        return this.tooltipOffsetY;
    }
}
class ClickHTMLElementAction {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    getHTMLReference() {
        return this.elementRef;
    }
    execute() {
        return new Promise((resolve, reject) => {
            var element = this.elementRef.getHTMLElement();
            if (element) {
                element.click();
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
class FocusHTMLElementAction {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    getHTMLReference() {
        return this.elementRef;
    }
    execute() {
        return new Promise((resolve, reject) => {
            var element = this.elementRef.getHTMLElement();
            if (element) {
                element.focus();
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
class SetAttributeHTMLElementAction {
    constructor(elementRef, qualifiedName, value) {
        this.elementRef = elementRef;
        this.qualifiedName = qualifiedName;
        this.value = value;
    }
    getHTMLReference() {
        return this.elementRef;
    }
    execute() {
        return new Promise((resolve, reject) => {
            var element = this.elementRef.getHTMLElement();
            if (element) {
                element.setAttribute(this.qualifiedName, this.value);
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
class SetValueHTMLElementAction {
    constructor(elementRef, value) {
        this.elementRef = elementRef;
        this.value = value;
    }
    getHTMLReference() {
        return this.elementRef;
    }
    execute() {
        return new Promise((resolve, reject) => {
            var element = this.elementRef.getHTMLElement();
            if (element) {
                element.value = this.value;
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
class SetInnerTextElementAction {
    constructor(elementRef, innerText) {
        this.elementRef = elementRef;
        this.innerText = innerText;
    }
    getHTMLReference() {
        return this.elementRef;
    }
    execute() {
        return new Promise((resolve, reject) => {
            var element = this.elementRef.getHTMLElement();
            if (element) {
                element.innerText = this.innerText;
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
class SleepAction {
    constructor(delayMs) {
        this.delayMs = delayMs;
    }
    getHTMLReference() {
        return null;
    }
    execute() {
        return new Promise(resolve => setTimeout(resolve, this.delayMs));
    }
}
class CustomActionOnElement {
    constructor(elementRef, fnOnElement) {
        this.elementRef = elementRef;
        this.fnOnElement = fnOnElement;
    }
    getHTMLReference() {
        return this.elementRef;
    }
    execute() {
        return new Promise((resolve, reject) => {
            var element = this.elementRef.getHTMLElement();
            if (element) {
                this.fnOnElement(element);
                resolve();
            }
            else {
                reject();
            }
        });
    }
}
class CustomAction {
    constructor(fn) {
        this.fn = fn;
    }
    getHTMLReference() {
        return null;
    }
    execute() {
        return new Promise((resolve, reject) => {
            this.fn();
            resolve();
        });
    }
}
class S4WShortcutListRenderer {
    constructor(shortcutList, lang, onClose) {
        this.shortcutList = shortcutList;
        this.lang = lang;
        this.onClose = onClose;
        this.showList = () => {
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
            closeButton.addEventListener("click", (e) => {
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
            for (var shortcut of this.shortcutList) {
                var li = this.createLiElement(S4W.getKeyCombinationText(shortcut.keyCombination), shortcut.name);
                ul.appendChild(li);
            }
            // Add to DOM:
            document.body.appendChild(this.createdHTMLElement);
        };
        this.removeList = () => {
            if (this.createdHTMLElement) {
                this.createdHTMLElement.remove();
            }
        };
    }
    createLiElement(keyCombinationText, name) {
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
}
class S4WTooltipsRenderer {
    constructor(shortcutList, lang, onCloseAllLabels) {
        this.shortcutList = shortcutList;
        this.lang = lang;
        this.onCloseAllLabels = onCloseAllLabels;
        this.showTooltips = () => {
            for (var shortcut of this.shortcutList) {
                this.renderTooltipsOfSubscription(shortcut);
            }
        };
        this.removeTooltips = () => {
            for (var element of this.createdHTMLElements) {
                element.parentElement.removeChild(element);
            }
        };
        this.renderTooltipsOfSubscription = (shortcut) => {
            var isFirstElement = true;
            var i = 0;
            while (isFirstElement && i < shortcut.actionList.length) {
                var act = shortcut.actionList[i];
                var elementRef = act.getHTMLReference();
                if (elementRef != null) {
                    var element = elementRef.getHTMLElement();
                    var tooltipPosition = elementRef.getTooltipPosition();
                    var tooltipOffsetX = elementRef.getTooltipOffsetX();
                    var tooltipOffsetY = elementRef.getTooltipOffsetY();
                    if (element)
                        this.renderTooltipHTMLElement(shortcut.keyCombination, element, tooltipPosition, tooltipOffsetX, tooltipOffsetY, act);
                    isFirstElement = false;
                }
                i++;
            }
        };
        this.renderTooltipHTMLElement = (keyCombination, element, tooltipPosition, tooltipOffsetX, tooltipOffsetY, action) => {
            var divLabel = document.createElement("div");
            divLabel.className = "s4w-tooltip-label";
            var keyCombinationText = S4W.getKeyCombinationText(keyCombination);
            var actionText = S4W.getActionText(action);
            divLabel.innerText = keyCombinationText + ((actionText > '') ? (': ' + actionText) : '');
            var rect = element.getBoundingClientRect();
            switch (tooltipPosition) {
                case S4WToolTipPosition.Top:
                    divLabel.style.bottom = (window.innerHeight - (rect.top + window.scrollY + S4W.defaultTooltipsOffsetY + tooltipOffsetY)) + "px";
                    divLabel.style.left = (rect.left + window.scrollX + S4W.defaultTooltipsOffsetX + tooltipOffsetX) + "px";
                    break;
                case S4WToolTipPosition.Right:
                    divLabel.style.top = (rect.top + window.scrollY + S4W.defaultTooltipsOffsetY + tooltipOffsetY) + "px";
                    divLabel.style.left = (rect.left + window.scrollX + rect.width + S4W.defaultTooltipsOffsetX + tooltipOffsetX) + "px";
                    break;
                case S4WToolTipPosition.Left:
                    divLabel.style.top = (rect.top + window.scrollY + S4W.defaultTooltipsOffsetY + tooltipOffsetY) + "px";
                    divLabel.style.right = (window.innerWidth - (rect.left + window.scrollX + S4W.defaultTooltipsOffsetX + tooltipOffsetX)) + "px";
                    break;
                case S4WToolTipPosition.Bottom:
                default:
                    divLabel.style.top = (rect.top + window.scrollY + rect.height + S4W.defaultTooltipsOffsetY + tooltipOffsetY) + "px";
                    divLabel.style.left = (rect.left + window.scrollX + S4W.defaultTooltipsOffsetX + tooltipOffsetX) + "px";
                    break;
            }
            var divClose = document.createElement("div");
            divClose.className = "s4w-tooltip-label-close";
            divClose.innerText = "x";
            divClose.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                divLabel.style.display = "none";
                this.qOpenLabels--;
                if (this.qOpenLabels == 0 && this.onCloseAllLabels) {
                    this.onCloseAllLabels();
                }
            });
            divLabel.appendChild(divClose);
            document.body.appendChild(divLabel);
            this.qOpenLabels++;
            this.createdHTMLElements.push(divLabel);
        };
        this.createdHTMLElements = [];
        this.qOpenLabels = 0;
    }
}
const DEFAULT_LANG = {
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
};
class S4WShortcut {
    constructor(keyCombination, name) {
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
    addClickHTMLElement(elementRef) {
        var act = new ClickHTMLElementAction(elementRef);
        this.actionList.push(act);
        return this;
    }
    addFocusHTMLElement(elementRef) {
        var act = new FocusHTMLElementAction(elementRef);
        this.actionList.push(act);
        return this;
    }
    addSetAttributeHTMLElement(elementRef, qualifiedName, value) {
        var act = new SetAttributeHTMLElementAction(elementRef, qualifiedName, value);
        this.actionList.push(act);
        return this;
    }
    addSetValueHTMLElement(elementRef, value) {
        var act = new SetValueHTMLElementAction(elementRef, value);
        this.actionList.push(act);
        return this;
    }
    addSetInnerTextElement(elementRef, innerText) {
        var act = new SetInnerTextElementAction(elementRef, innerText);
        this.actionList.push(act);
        return this;
    }
    addSleep(delayMs) {
        var act = new SleepAction(delayMs);
        this.actionList.push(act);
        return this;
    }
    addCustomActionOnElement(elementRef, fnOnElement) {
        var act = new CustomActionOnElement(elementRef, fnOnElement);
        this.actionList.push(act);
        return this;
    }
    addCustomAction(fn) {
        var act = new CustomAction(fn);
        this.actionList.push(act);
        return this;
    }
}
class S4W {
    static addShortcut(keyCombination, name) {
        var shortcut = new S4WShortcut(keyCombination, name);
        this.shortcutsList.push(shortcut);
        return shortcut;
    }
    static removeShortcut(shortcut) {
        var index = null;
        var i = 0;
        while (index === null && i < this.shortcutsList.length) {
            var s = this.shortcutsList[i];
            if (this.checkKeyCombinationsAreEquals(s.keyCombination, shortcut.keyCombination)) {
                index = i;
            }
            i++;
        }
        if (index === null) {
            console.warn(`Shortcuts4Web: shortcut not found to remove`, shortcut);
        }
        else {
            this.shortcutsList.splice(index, 1);
        }
    }
    static removeAllShortcuts() {
        var i = 0;
        for (var i = this.shortcutsList.length; i >= 0; i--) {
            this.shortcutsList.splice(i, 1);
        }
    }
    static setKeyCombinationForTooltips(keyCombination) {
        this.keyCombinationForTooltips = {
            code: keyCombination.code,
            ctrlKey: !!keyCombination.ctrlKey,
            altKey: !!keyCombination.altKey,
            shiftKey: !!keyCombination.shiftKey,
            metaKey: !!keyCombination.metaKey
        };
    }
    static getKeyCombinationForTooltips() {
        return this.keyCombinationForTooltips;
    }
    static setKeyCombinationForListShortcuts(keyCombination) {
        this.keyCombinationForListShortcuts = {
            code: keyCombination.code,
            ctrlKey: !!keyCombination.ctrlKey,
            altKey: !!keyCombination.altKey,
            shiftKey: !!keyCombination.shiftKey,
            metaKey: !!keyCombination.metaKey
        };
    }
    static getKeyCombinationForListShortcuts() {
        return this.keyCombinationForListShortcuts;
    }
    static unsubscribeBodyKeyDown() {
        window.removeEventListener("keydown", this.handleEvent);
    }
    static checkKeyCombinationsAreEquals(a, b) {
        return (a.ctrlKey == b.ctrlKey && a.altKey == b.altKey && a.shiftKey == b.shiftKey && a.metaKey == b.metaKey && a.code == b.code);
    }
    static showTooltips() {
        if (!this.tooltips) {
            this.tooltips = new S4WTooltipsRenderer(this.shortcutsList, this.lang, this.onCloseAllTooltipsLabels);
            this.tooltips.showTooltips();
        }
    }
    static removeTooltips() {
        if (this.tooltips) {
            this.tooltips.removeTooltips();
            this.tooltips = null;
        }
    }
    static setEnableShowShortcutList(value) {
        this.enableShowShortcutList = !!value;
    }
    static showShortcutList() {
        if (this.enableShowShortcutList && !this.shortcutListRenderer) {
            this.shortcutListRenderer = new S4WShortcutListRenderer(this.shortcutsList, this.lang, this.onCloseShortcutList);
            this.shortcutListRenderer.showList();
        }
    }
    static removeShortcutList() {
        if (this.shortcutListRenderer) {
            this.shortcutListRenderer.removeList();
            this.shortcutListRenderer = null;
        }
    }
    static getKeyCombinationText(keyCombination) {
        var strKeys = [];
        if (keyCombination.metaKey) {
            strKeys.push(this.lang.txMetaKey);
        }
        if (keyCombination.ctrlKey) {
            strKeys.push(this.lang.txCtrlKey);
        }
        if (keyCombination.altKey) {
            strKeys.push(this.lang.txAltKey);
        }
        if (keyCombination.shiftKey) {
            strKeys.push(this.lang.txShiftKey);
        }
        if (keyCombination.code) {
            var code = '[' + keyCombination.code + ']';
            strKeys.push(code);
        }
        return strKeys.join(" + ");
    }
    static elementByObject(element) {
        return HTMLElementReference.createByHtmlElement(element);
    }
    static elementById(idHtmlElement, doc) {
        if (doc == null) {
            doc = document;
        }
        return HTMLElementReference.createById(idHtmlElement, doc);
    }
    static elementByQuerySelector(strQuerySelector, doc) {
        if (doc == null) {
            doc = document;
        }
        return HTMLElementReference.createByQuerySelector(strQuerySelector, doc);
    }
    static elementByTextEquals(strTextEquals, doc) {
        return HTMLElementReference.createByTextEquals(strTextEquals, doc);
    }
    static elementByTextContains(strTextContains, doc = null) {
        return HTMLElementReference.createByTextContains(strTextContains, doc);
    }
    static getActionText(action) {
        var text = '';
        if (action instanceof ClickHTMLElementAction) {
            text = this.lang.txClickAction;
        }
        else if (action instanceof FocusHTMLElementAction) {
            text = this.lang.txFocusAction;
        }
        else if (action instanceof SetInnerTextElementAction) {
            text = this.lang.txSetInnerTextElementAction + ' ' + action.innerText;
        }
        else if (action instanceof SetAttributeHTMLElementAction) {
            text = this.lang.txSetAttributeHTMLElementAction + ' ' + action.qualifiedName + " = " + action.value;
        }
        else if (action instanceof SetValueHTMLElementAction) {
            text = this.lang.txSetValueHTMLElementAction + ' = ' + action.value;
        }
        else if (action instanceof SleepAction) {
            text = this.lang.txSleepAction + ' ' + action.delayMs;
        }
        else if (action instanceof CustomActionOnElement) {
            text = this.lang.txCustomActionOnElement;
        }
        else if (action instanceof CustomAction) {
            text = this.lang.txCustomAction;
        }
        return text;
    }
    static getShortcutsAsArray() {
        var arr = [];
        for (var shortcut of this.shortcutsList) {
            var keyCombinationText = this.getKeyCombinationText(shortcut.keyCombination);
            arr.push({ name: shortcut.name, keyCombinationText: keyCombinationText, actions: shortcut.actionList });
        }
        return arr;
    }
}
_a = S4W;
S4W.shortcutsList = [];
S4W.active = false;
S4W.keyCombinationForTooltips = DEFAULT_KEY_COMBINATION_FOR_TOOLTIPS;
S4W.keyCombinationForListShortcuts = DEFAULT_KEY_COMBINATION_FOR_LIST_SHORTCUTS;
S4W.lang = DEFAULT_LANG;
S4W.enableShowShortcutList = true;
S4W.defaultTooltipsOffsetX = 0;
S4W.defaultTooltipsOffsetY = 0;
S4W.setActive = (active) => {
    var prevActive = _a.active;
    _a.active = active;
    if (_a.active != prevActive) {
        if (_a.active) {
            _a.subscribeBodyKeyDown();
        }
        else {
            _a.unsubscribeBodyKeyDown();
        }
    }
};
S4W.getActive = () => {
    return _a.active;
};
S4W.subscribeBodyKeyDown = () => {
    window.addEventListener("keydown", _a.handleEvent);
};
S4W.handleEvent = (e) => {
    if (_a.active) {
        var eAsKeyCombination = { ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey, code: e.code };
        if (_a.checkKeyCombinationsAreEquals(_a.keyCombinationForTooltips, eAsKeyCombination)) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            _a.processKeyCombinationForTooltips();
        }
        if (_a.checkKeyCombinationsAreEquals(_a.keyCombinationForListShortcuts, eAsKeyCombination)) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            _a.processKeyCombinationForListShortcuts();
        }
        for (var shortcut of _a.shortcutsList) {
            if (_a.checkKeyCombinationsAreEquals(shortcut.keyCombination, eAsKeyCombination)) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
                _a.executeActionList(shortcut.actionList);
            }
        }
        ;
    }
};
S4W.executeActionList = async (actionList) => {
    for (var act of actionList) {
        await act.execute();
    }
    ;
};
S4W.processKeyCombinationForTooltips = () => {
    if (_a.tooltips) {
        _a.removeTooltips();
    }
    else {
        _a.showTooltips();
    }
};
S4W.processKeyCombinationForListShortcuts = () => {
    if (_a.shortcutListRenderer) {
        _a.removeShortcutList();
    }
    else {
        _a.showShortcutList();
    }
};
S4W.onCloseAllTooltipsLabels = () => {
    _a.removeTooltips();
};
S4W.onCloseShortcutList = () => {
    _a.removeShortcutList();
};
S4W.setLang = (lang) => {
    // Only assign not empty translations
    var keys = Object.keys(lang);
    for (var k of keys) {
        if (k in _a.lang) {
            var text = lang[k];
            if (text > '') {
                _a.lang[k] = text;
            }
        }
    }
};
export default S4W;
