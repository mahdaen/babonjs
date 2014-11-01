# **BabonJS**
***
**BabonJS** is just another Javascript Library. It's help you with some useful functions, **`Automators`** and **`Generators`**.

## **Requirements**
**BabonJS** need these library to works.
- **`jQuery`**
- **`Enquire`**

## **Contents**
Let's get started to find out whats the **BabonJS** have.

### **Native**
**BabonJS** creates some useful functions to extend native functions.

#### **Object Type**
> Determine the type of objects.

- **`isString(OBJECT)`** - Return `true` if `OBJECT` is string. Otherwise return false.
- **`isObject(OBJECT)`** - Return `true` if `OBJECT` is object and not an array.
- **`isArray(OBJECT)`** - Return `true` if `OBJECT` is array.
- **`isFunction(OBJECT)`** - Return `true` if `OBJECT` is function.
- **`isNumber(OBJECT)`** - Return `true` if `OBJECT` is number.
- **`isBoolean(OBJECT)`** - Return `true` if `OBJECT` is boolean.

- **`isJQuery(OBJECT)`** - Return `true` if `OBJECT` is jQuery object.
- **`isHTML(OBJECT)`** - Return `true` if `OBJECT` is HTML element.

- **`isColor(OBJECT)`**
- **`isURL(OBJECT)`**
- **`isEmail(OBJECT)`**
- **`isDate(OBJECT)`**

#### **Foreach Loop**
Can be used to loop object, array, number or string. Hope it's useful. ;)

**`foreach(OBJECT, HANDLER)`**
> `OBJECT` can be object, array, number or string. `HANDLER` is function that handle each item.
> If `object`, looper give arguments `key` and `value`.
> If `array`, looper give arguments `value` and `index`.
> If `number`, looper give arguments `number` in the current count.
> If `string`, looper give arguments `string` in the current count.

***`Sample`***
```js
var obj = { a: 1, b: 1 };
foreach(obj, function(key, value) {
	console.log(key + ' is ' + value);
});
// Log: a is 1
// Log: b is 2

var obj = [a, b];
foreach(obj, function(value, idx) {
	console.log(value + ' is in index ' + idx);
});
// Log: a is in index 0
// Log: b is in index 1

var obj = 2;
foreach(obj, function(current) {
	console.log(current);
});
// Log: 1
// Log: 2

var obj = 'One';
foreach(obj, function(char) {
	console.log(char);
});
// Log: 'O'
// Log: 'n'
// Log: 'e'
```

### **jQuery Plugin**
**BabonJS** creates some `jQuery` plugin.

#### **Has Attribute**
> **`$.fn.hasAttr(STR_ATTR)`** - Determine whether element has attribute or not.

***`Sample`***
```html
<div class="test" default></div>
```
```js
$('.test').hasAttr('default'); // Return true.
$('.test').hasAttr('required'); // Return false.
```

#### **Has Data Attribute**
> **`$.fn.hasData(STR_DATA_ATTR)`** - Determine whether element has data attribute or not.

***`Sample`***
```html
<div class="profile" data-profile="name: 'John Smith', age: 48"></div>
```
```js
$('.profile').hasData('profile'); // Return true
$('.profile').hasData('address'); // Return false
```

#### **Get Data Attribute Value**
> **`$.fn.getData(STR_DATA_ATTR)`** - Get data attribute value. Data value will be automatically converted in the return value. Data value can be `JSON`,`object`, `array`, `boolean`, `number` or `string`. If the value is `string` format, please **note** don't write like this: `a, b, c d e`. It's will be converted as `array`.

***Detail***
- **`{"a": 1, "b": 2}`** - `JSON` format and converted as an `object`.
- **`a: 1, b: 2`** - `object` format and converted as an `object`.
- **`4.500`** - `number` format and converted as an `number`.
- **`a, b, 1, 2`** - `array` format and converted as an `array`.
- **`true`** - `boolean` format and converted as an `boolean`.
- **`My name is John Smith.`** - `string` format and converted as an `string`.

***`Sample`***
```html
<div class="profile" data-profile="name: 'John Smith', age: 48" data-children="Sam Smith, Gabrielle Smith, Ariana Smith"></div>
```
```js
$('.profile').getData('profile');

// Return
Object { name: 'John Smith', age: 48 }

$('.profile').getData('children');

// Return
Array ['Sam Smith', 'Gabrielle Smith', 'Ariana Smith']
```

#### **Set Data Attribute Value**
> **`$.fn.setData(STR_DATA_ATTR, VALUE)`** - Set data attribute value. No matter what data that you set to data attribute, it's will automatically converted with right format (read Get Data Attribute detail).

***`Sample`***
```js
$('.profile')
	.setData('profile', { name: 'Ariana Grande', age: 21 })
	.setData('interests', ['Music', 'Acting', 'Traveling']);
```
***`Result`***
```html
<div class="profile" data-profile="{"name":"Ariana Grande", "age":21}" data-interests="Music, Acting, Traveling"></div>
```

#### **Remove Data Attribute**
> **`$.fn.remData(STR_OR_ARRAY_DATA_ATTR)`** - Remove data attribute from an element. Arguments can be `string` or `array` data-attribute name.

***`Sample`***
```js
$('.profile').remData('profile'); // Remove data-profile form element.
$('.profile').remData(['profile', 'interests']); // Remove data-profile and data-interests from element.
```

#### **Get Element Offsets**
> **`$.fn.offsets()`** - Get element offsets to extend the default `$.fn.offset()` plugin. Returns `object` offsets: `Object { width: ?, height: ?, top: ?, left: ?, center: ? }`.

#### **Set Box Ratio**
> **`$.fn.boxRatio()`** - Get the box ratio of an element. The result will be added to `data-box-ratio` attribute and returned as `array`.

#### **Get Box Orientation**
> **`$.fn.orientation()`** - Get orientation of an element. The result will be added to class and returned as `string`. The result is `landscape` or `portrait`.

## **Automators**
**Automators** help you to build your needs, especially in DOMs with less-write of `Javascript` because **Automators** definition is using DOM data attribute, and of course configurable. Why should you cares about it? Let's get started with some case. 

```html
<!-- The video wrap must have 16:9 aspect ratio -->
<div class="video-wrap"></div>
```

Without **Automator** you have to write javascript to handle aspect ratio in the sample above. Maybe, first count width, count ratio, apply height etc. Yes, you can do it with CSS, but it's static. CSS can't give you height that depends on the width. But with **Automator** you only need to do like this:

```html
<!-- The video wrap must have 16:9 aspect ratio -->
<div class="video-wrap" data-box-ratio="16,9"></div>
```

And boom! When the pages loaded, you'll get the video-wrap aspect ratio automatically added to the style. Example result:

```html
<!-- The video wrap width is 1600px -->
<div class="video-wrap" data-box-ratio="16,9" style="height: 900px;"></div>
```

Hope this help you! ;)

### **Box Automator**
**Box Automator** will help you to maintain the **`box-ratio`**, **`box-height`, and **`box-row-height`**.

#### **Box Ratio Automator**
**Box Ratio Automator** /**`Automator('box-ratio')`** will help you to count the aspect ratio of element with easy way, depends on the element width.

**`data-box-ratio="BOX_RATIO"`**

> Where **`BOX_RATIO`** is a data array format of the box ratio. E.g: **`16,9`** for `16:9`, **`4,3`** for `4:3`, **`4,4`** for `4:4`.

***`Sample`***
```html
<div class="video" data-box-ratio="16,9"></div>
```

#### **Box Height Automator**
**Box Height Automator** / **`Automator('box-height')`** will help you maintain height of elements. For some case, like when you create a list that using grid layout, sometimes you'll get the layout broken because of the item height is different. So, this automator is what you're looking for.

- **`data-box-height="BOX_HEIGHT_CONFIG"`** - for parent node
- **`data-box-child`** - for childrens.

> **`BOX_HEIGHT_CONFIG`** is the configuration of automator to tell the automator about how the height should be applied. We have three options for configuration.
> 
> Use **`capture-children`** if you want to set the height of parent node depend on the highest height of child nodes.
> 
> Use **`fill-children`** if you want to makes all child nodes in the same height depend on the highest height.
> 
> Use **`fill-parent`** if you want to makes node height depend on the parent height. The **`data-box-child`** attribute is unused when you use **`fill-parent`**. Don't worry about using automator inside an automator. ;)

***`Sample`***

```html
<!-- Makes the all child nodes in the same height -->
<ul class="grid" data-box-height="fill-children">
	<li class="col-4" data-box-child></li>
	<li class="col-4" data-box-child></li>
	<li class="col-4" data-box-child></li>
	<li class="col-4" data-box-child></li>
</ul>

<!-- Makes the parent height (.grid) depend on the highest height of child nodes -->
<ul class="grid" data-box-height="capture-children">
	<li class="col-4" data-box-child></li>
	<li class="col-4" data-box-child></li>
	<li class="col-4" data-box-child></li>
	<li class="col-4" data-box-child></li>
</ul>

<!-- Makes the node height (.grid) depend on the parent height (.wrap) -->
<div class="wrap">
	<ul class="grid" data-box-height="fill-parent">
		<li class="col-4"></li>
	</ul>
</div>
```	
