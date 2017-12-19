# Rosette

A jQuery translation plugin.

## Depencies

- [jQuery (v1.6+)](https://jquery.com)

## Quick start

Link the main CSS and JS files:
```html
<link rel="stylesheet" href="path-to-rosette/rosette.css" />
<script type="text/javascript" src="path-to-rosette/rosette.js"></script>
```

Initialize Rosette:
```javascript
$('target-selector').rosette();
//with settings
$('target-selector').rosette({
    //settings here
});
```

## Settings

Rosette can be initialized with a bunch of available settings.

### Example

```javascript
$('target-selector').rosette({
	languages: {
		1: 'FR', 
		2: 'EN', 
		3: 'RU'
	}
});
```

### Available settings

#### languages

Default: `{}`

The languages data. It must be an object with the languages IDs as keys and the languages names / texts as value.

Example:

```
{
	1: 'FR', 
	2: 'EN', 
	3: 'RU'
}
```

#### current

Default: `null`

The main language ID that will be displayed on the main input. The other languages will be displayed on the dropdown inputs.

## Questions

##### This plugin doesn't work!
Oh... Sorry about that! Please feel free to post issues on the [rosette repository](https://github.com/pitininja/rosette)! I'll do my best to fix what's broken.