# Shortcuts4Web

S4W - Shortcuts For Web creates keyboard shortcuts to execute actions on your web, like click on a button, focus on a input text element, assign value to a input select element and even execute custom actions.

For example, you can assign the Ctrl + Shift + "B" key shortcut to click on a button with de following code:

```

S4W.addShortcut({ctrlKey:true, shiftKey: true, code:'KeyB'}, 'Click the button')
        .addClickHTMLElement(S4W.elementById('myButton'));
    S4W.setActive(true);

```

This library can show/hide the shortcuts on its elements by calling explicitly a JavaScript function or the user can do it by pressing Ctrl + Shift + K:

![Tooltip on button example](https://gitlab.com/forer/s4w_public_resources/-/raw/main/description_tooltip.png "Tooltip on button example")


The key combination Ctrl + Shift + K can be changed, it is configurable.
You can set the tooltip's style by changing CSS clasess, also you can set the tooltip's position of each tooltip by code.

The user can show/hide the list of defined shortcuts on the web page by pressing Ctrl + Shift + L.
Here, you can see a list of shortcuts for this example:

![Shortcut list](https://gitlab.com/forer/s4w_public_resources/-/raw/main/description_list.png "Shortcut list")


The style of this list is configurable by CSS classes and the key combination Ctrl + Shift + L is configurable. If you don't need show the list of shortcuts, you can disable it on your project.

The library comes with its documentation and examples

## Live demo

Here you can try a [live demo](https://forer.gitlab.io/shortcuts4weblivepreview/ "Live demo")

## Features

* There are not library dependencies
* Visual tooltips customizable by CSS classes and JavaScript
* Developed in TypeScript, generated Javascript file is also included
* Allows add and remove shortcuts in runtime
* You can enable/disable this library at convenience, default is disabled
* Allows show to the user the list of shortcuts on a popup, the styles are customizables by css classes
* Default language is English, but you can define your own text messages
* Well documented

## Requirements

This library uses functions available in all modern web Browsers, it was tested on Chrome, Firefox and Safari.
Does not require addicional libraries.
It was developed with TypeScript, you can choice what JS version to target (see in tsconfig.json the target attribute)

## Getting started

1. Download the library.

2. Add the S4W.js file:
```

<script src="src/S4W.js"></script>

```

3. Add the css classes:
```

<link rel="stylesheet" href="css/shortcuts4web.css">

```

4. Add a button with an id attribute (for example):

```
<button id="btnSayHello" onclick="alert('Hello!')">Say Hello</button>

```

5. Add the next JavaScript code to your project:

```

<script>
    window.onload = (()=>{
        subcribeEvents();
    })
    
    function subcribeEvents(){
        S4W.addShortcut({code:'KeyB', ctrlKey:true, shiftKey: true}, 'Click button Say Hello')
            .addClickHTMLElement(S4W.elementById('btnSayHello'));
        S4W.setActive(true);
    }
</script>

```

This simple example will bind the Ctrl + Shift + "B" shortcut to click on the button action.

The library is well documented on its wiki and has three examples that you can use to learn how to use it.

## Modify and recomplile the library

You may want to edit this library to adapt it to your projects, in which case you can make these changes:
* Change the behavior, modifying the s4w.js file directly, or better by modifying the s4w.ts file that when compiled using typescript (tsc command) will regenerate the s4w.js file. You can define which version of javascript to compile with the "target" parameter of tsconfig.json.
* Change how the tooltips and popup are displayed, there is a default definition in shortcuts4web.css that you can adapt to the style of your website.

You can see the detailed information about this library in its [wiki](https://github.com/fabrimontenegro/shortcuts4web/wiki/S4W-%E2%80%90-Shortcuts-For-Web)


## Why did I make this library?

I have been using computers for many years, I have used many desktop applications that make work much easier using shortcuts. This is missing on the web, there are shortcuts for the browser itself, but not for specific parts of the web.

There are websites that I use daily that I would like to have shortcuts for actions such as pressing a certain menu option, putting focus on a text box or opening a search engine within it. I've looked for libraries that do this but couldn't find any.

I hope this is useful for people who have to do repetitive tasks on websites they visit frequently.