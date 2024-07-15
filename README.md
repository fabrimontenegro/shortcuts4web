# Shortcuts4Web

S4W - Shortcuts For Web creates keyboard shortcuts to execute actions on your web, like click on a button, focus on a input text element, assign value to a input select element and even execute custom actions.

For example, you can assign the Ctrl + Shift + "B" key shortcut to click on a button with de following code:

```

S4W.addShortcut({ctrlKey:true, shiftKey: true, code:'KeyB'}, 'Click the button')
        .addClickHTMLElement(S4W.elementById('myButton'));
    S4W.setActive(true);

```

This library can show/hide the shortcuts on its elements by calling explicitly a JavaScript function or the user can do it by pressing Ctrl + Shift + K:

![Tooltip on button example](https://private-user-images.githubusercontent.com/38241054/348706694-ea8dd81d-3ef1-4ad8-8a47-91a28913c69a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjEwNDczMDgsIm5iZiI6MTcyMTA0NzAwOCwicGF0aCI6Ii8zODI0MTA1NC8zNDg3MDY2OTQtZWE4ZGQ4MWQtM2VmMS00YWQ4LThhNDctOTFhMjg5MTNjNjlhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MTUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzE1VDEyMzY0OFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTljYzNkYmQwMzg2NWMxZDBkZmYwY2Q0ZDRjOTJmYmZhMTAyNjhkMDk1ZjA4NTU3NGU4MTI4MjVlZTQwY2I4MDkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.fkMygS25WjR_wDjxvmfy0NrD0KavM00ACEz6yGWsPVI "Tooltip on button example")


The key combination Ctrl + Shift + K can be changed, it is configurable.
You can set the tooltip's style by changing CSS clasess, also you can set the tooltip's position of each tooltip by code.

The user can show/hide the list of defined shortcuts on the web page by pressing Ctrl + Shift + L.
Here, you can see a list of shortcuts for this example:

![Shortcut list](https://private-user-images.githubusercontent.com/38241054/348706702-9bf8255e-70e3-4747-b8f6-36dc1a4053d0.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MjEwNDczMDgsIm5iZiI6MTcyMTA0NzAwOCwicGF0aCI6Ii8zODI0MTA1NC8zNDg3MDY3MDItOWJmODI1NWUtNzBlMy00NzQ3LWI4ZjYtMzZkYzFhNDA1M2QwLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA3MTUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNzE1VDEyMzY0OFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTRmYTg0M2QyNGQzMmFhMzJiMDZlNzgxNTgwOGQ1ZTRkYzA5ZTc0ZmQ0MjAyMDhhMjY4NmU0ZTA2NTAzNjYwOGMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.tY6DSMCUxlXfryMlkQbSl95bw_24h0AtrBymFn0Eqks "Shortcut list")


The style of this list is configurable by CSS classes and the key combination Ctrl + Shift + L is configurable. If you don't need show the list of shortcuts, you can disable it on your project.

The library comes with its documentation and examples

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

Add the S4W.js file:
```

<script src="src/S4W.js"></script>

```

Add the css classes:
```

<link rel="stylesheet" href="css/shortcuts4web.css">

```

This simple example will bind the Ctrl + Shift + "H" shortcut to a button click action.
Add a button with an id attribute:

```
<button id="btnSayHello" onclick="alert('Hello!')">Say Hello</button>

```


Add the next JavaScript code to your project:

```

<script>
    window.onload = (()=>{
        subcribeEvents();
    })
    
    function subcribeEvents(){
        S4W.addShortcut({code:'KeyH', ctrlKey:true, shiftKey: true}, 'Click button Say Hello')
            .addClickHTMLElement(S4W.elementById('btnSayHello'));
        S4W.setActive(true);
    }
</script>

```

The library is well documented and has three examples that you can use to learn how to use it.

## Modify and recomplile the library

You may want to edit this library to adapt it to your projects, in which case you can make these changes:
* Change the behavior, modifying the s4w.js file directly, or better by modifying the s4w.ts file that when compiled using typescript (tsc command) will regenerate the s4w.js file. You can define which version of javascript to compile with the "target" parameter of tsconfig.json.
* Change how the tooltips and popup are displayed, there is a default definition in shortcuts4web.css that you can adapt to the style of your website.

You can see the detailed information about this library in its [wiki](https://github.com/fabrimontenegro/shortcuts4web/wiki/S4W-%E2%80%90-Shortcuts-For-Web)

