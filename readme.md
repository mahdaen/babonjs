# **BabonJS**
***
**BabonJS** is just another Javascript Library. It's help you with some useful functions, **`Automators`** and **`Generators`**.

## **Requirements**
**BabonJS** need these library to works.
- **`jQuery`**
- **`Enquire`**

## **Contents**
Let's get started to find out whats the **BabonJS** have.

***
### **Native**
**BabonJS** creates some useful functions to extend native functions.

#### **Object Type**
> Determine the type of objects.

**`isString(OBJECT)`**
> Return `true` if `OBJECT` is string. Otherwise return false.

**`isObject(OBJECT)`**
> Return `true` if `OBJECT` is object and not an array.

**`isArray(OBJECT)`**
> Return `true` if `OBJECT` is array.

**`isFunction(OBJECT)`**
> Return `true` if `OBJECT` is function.

**`isNumber(OBJECT)`**
> Return `true` if `OBJECT` is number.

**`isBoolean(OBJECT)`**
> Return `true` if `OBJECT` is boolean.

**`isJQuery(OBJECT)`**
> Return `true` if `OBJECT` is jQuery object.

**`isHTML(OBJECT)`**
> Return `true` if `OBJECT` is HTML element.

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
var obj = { a: 1, b: 2 };
foreach(obj, function(key, value) {
	console.log(key + ' is ' + value);
});
// Log: a is 1
// Log: b is 2

var obj = ['a', 'b'];
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
foreach(obj, function(current) {
	console.log(current);
});
// Log: 'O'
// Log: 'n'
// Log: 'e'
```

***
### **jQuery Plugin**
**BabonJS** creates some `jQuery` plugin.

#### **Has Attribute**
**`$.fn.hasAttr(STR_ATTR)`**
> Determine whether element has attribute or not.

***`Sample`***
```html
<div class="test" default></div>
```
```js
$('.test').hasAttr('default'); // Return true.
$('.test').hasAttr('required'); // Return false.
```

#### **Has Data Attribute**
**`$.fn.hasData(STR_DATA_ATTR)`**
> Determine whether element has data attribute or not.

***`Sample`***
```html
<div class="profile" data-profile="name: 'John Smith', age: 48"></div>
```
```js
$('.profile').hasData('profile'); // Return true
$('.profile').hasData('address'); // Return false
```

#### **Get Data Attribute Value**
**`$.fn.getData(STR_DATA_ATTR)`**
> Get data attribute value. Data value will be automatically converted in the return value. Data value can be `JSON`,`object`, `array`, `boolean`, `number` or `string`. If the value is `string` format, please **note** don't write like this: `a, b, c d e`. It's will be converted as `array`.

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
**`$.fn.setData(STR_DATA_ATTR, VALUE)`**
> Set data attribute value. No matter what data that you set to data attribute, it's will automatically converted with right format (read Get Data Attribute detail).

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
**`$.fn.remData(STR_OR_ARRAY_DATA_ATTR)`**
> Remove data attribute from an element. Arguments can be `string` or `array` data-attribute name.

***`Sample`***
```js
$('.profile').remData('profile'); // Remove data-profile form element.
$('.profile').remData(['profile', 'interests']); // Remove data-profile and data-interests from element.
```

#### **Get Element Offsets**
**`$.fn.offsets()`**
> Get element offsets to extend the default `$.fn.offset()` plugin. Returns `object` offsets: `Object { width: ?, height: ?, top: ?, left: ?, center: ? }`.

#### **Set Box Ratio**
**`$.fn.boxRatio()`**

> Get the box ratio of an element. The result will be added to `data-box-ratio` attribute and returned as `array`.

#### **Get Box Orientation**
**`$.fn.orientation()`**

> Get orientation of an element. The result will be added to class and returned as `string`. The result is `landscape` or `portrait`.

#### **Data, Name, and Attribute Selector**
- **`$(':hasdata($name, $value)')`**
- **`$(':hasattr($name, $value)')`**
- **`$(':hasname($name, $value)')`**

> Select data attribute, attribute name and attribute from elements. This is just like `$('.foo')`, but for attributes.
> Example:
> `$(':hasdata(box-ratio)')` will returns all elements thats have attribute `data-box-ratio`.
> `$(':hasattr(default)')` will returns all elements thats have attribute `default`.

#### **Data Attribute Finder**
**Data Attribute Finder** is a simplified `:hasdata` selector.

- **`$data($name, $value, $context)`**
- **`$.findData($name, $value, $context)`**

> `$name` is the data-attribute name. It's required.
> `$value` is the value of attribute. It's optional and used if you want to match value in your search. E.g: **`$data('role', 'form')`** - select elements that has `data-role="form"`.
> `$context` is the jquery object for query context. E.g: **`$data('role', 'form', $('.content'))`** - select elements that has `data-role="form"` from `$('.content')`.

***`Sample`***
```js
// Select elements that has data-box-ratio.
var result = $data('box-ratio');
```
```js
// Select elements that has data-box-ratio="16,9"
var result = $data('box-ratio', [16,9]);
```
```js
// Select elements that has data-box-ratio="16,9" from 'ul.list'
var result = $data('box-ratio', [16,9], $('ul.list'));
```
```js
// Select elements that has data-box-child from 'ul.list'.
var result = $data('box-child', $('ul.list'));
```
```js
// Select elements that has attribute data-box-ratio and data-role="cards" from 'ul.list'.
var result = $data({
	'box-ratio': '?',
	'role': 'cards'
}, $('ul.list'));
```
```js
// Select elements that has attribute data-role, data-name, and data-age from 'ul.list'.
var result = $data(['role', 'name', 'age'], $('ul.list'));
```

### **Media Query**
**BabonJS** creates three default media query. Hope it's help!

**`$media($query)`**
> Perform media query. If matched, then functions that added to `.run` will be triggered directly, and the functions added to `.onReady` will be triggered when document ready.

***`Default Media Status`***
- **`window['is-mobile']`** - `true` if currently on mobile.
- **`window['is-tablet']`** - `true` if currently on tablet.
- **`window['is-desktop']`** `true` if currently on desktop.

***`Default Handler`***
- **`$_desktop`** - Handler for desktop.
- **`$_mobile`** - Handler for mobile.
- **`$_tablet`** - Handler for tablet.

***`Handler Methods`***
- **`.run($func)`** - Run functions for matched query.
- **`.onReady($func)`** - Run functions for matched query when document ready.
> `$func` is function that handle the match query.

***`Sample`***
```js
// Default desktop handler.
$_desktop.run(function() {
	console.log('Currently on desktop view.');
});

// Default mobile handler.
$_mobile.onReady(function() {
	console.log('Mobile view is ready!');
});

// Custom.
$media('all and (min-device-width : 720)').onReady(function() {
	console.log('Custom query match!');
});
```

### **Tools**
**BabonJS** creates some tools that can be used in some case.

#### **Variable**
**`vars($name, $value)`**
> Create or read variable in the Tool scope. Variable only can be accessed using `vars` itself.

*`Sample`*
```js
vars('name', 'John Smith');

console.log(vars('name'));
//=> "John Smith"

console.log(name);
//=> undefined
```

#### **Constant**
**`cons($name, $value)`**
> Create or read constant in Tool scope.  `$name` is string constant name, `$value` is value of constant. `$value` can't be function. 

*`Sample`*
```js
cons('name', 'John Smith');

console.log(cons('name'));
//=> "John Smith"

cons('name', 'Tarzan');
//=> Constant "name" already registered!
```

#### **Function**
**`func($name, $func)`**
> Create or run read-only function in Tool scope. Like constant, the registered function name can't be replaced or configured. `$name` is string function name, `$func` is a function that handle the call.

*`Sample`*
```js
func('me', function(name) {
	console.log(name || 'John Smith');
});

func('me')();
//=> "John Smith"

func('me')('Another John');
//=> "Another John"

func('me', function() {});
//=> Function "me" already registered!
```

***
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

All automator is configurable. So, you can configure them with your taste before document ready. To configure the automators, just select the automator `Automator($at_name)` where `$at_name` is automator name, then followed by method. Example:

```js
// Set the automator to cleanup data-attribute after build and rename the default data-attribute name.
Automator('box-ratio')
	.setup('clean', true)
	.config('Kit', 'aspect-ratio');
```

After configuring automator, then you can write the automator data attribute with your own.

```html
<div class="video" data-aspect-ratio="16:9"></div>
```

***
#### **Automator Public Methods**
**`Automator.list`**
> Lists all automators name. This is not function. Providing Array with list of automators name.

**`Automator.enable($name)`**
> Enable automator. `$name` is the automator name.

**`Automator.disable($name)`**
> Disable automator. `$name` is the automator name.

***
#### **Automator Default Methods**
> You must select an automator before running methods below.
> E.g: **`Automator('box-ratio')`**.

**`.setup($name, $value)`**
> Set the automator config. `$name` is string for config name, `$value` is anythings that will be set to `$name`. If you want to set multiple config, you can use `objet` as `$name` and ignore the `$value`.
> Because each automator will have different config, you can get the available config by running `Automator($at_name).setup()` in developer console.

**`.config($name, $value)`**
> Set the data-attribute name. `$name` is the key of config e.g: `Kit`, `$value` is the string data-attribute name. Each automator will have different data-attribute naming. You can get the available config by running `Automator($at_name).config()` in developer console.

**`.list()`**
> Get the lists of Kit that builded by automator. Usually each Kit also can be configured. Some automator doesn't build custom kit. So if no available kit, it's return empty object.

**`.with($id)`**
> Get the Kit that builded by automator by `ID`. `$id` is string for kit `ID`. This method will returning Kit Object.

**`.build($object)`**
> Building Kits or DOM. `$object` is jQuery object that have a data-attribute for it's automator, or string to use it as query context.
> By default, automators will build them when document ready. But if you don't want to run automator automatically or you want to build them after document ready triggered, you can use this.

**`.escape($func)`**
> Adding ignore function. `$func` is function that handle does it should ignored, or array with functions. If one of  `$func` returns `true`, then this automator will be ignored. It's usable when you only need this automator for specific rule. E.g: You only need to apply box-ratio on desktop, then you can escape the automator on mobile or tablet. Example:

```js
// Ignore box-ratio on mobile and tablet.
Automator('box-ratio').escape(function() {
	return window['is-mobile'] || window['is-tablet'] ? true : false;
});
```

**`.autobuild($bool)`**
> Set does the automator should auto build or not. Default is `true`.

**`.enabled()`**
> Get does the automator is enabled or disabled. Returns `boolean`.

**`.bind($name, $func)`**
> Add callback to automator. The callback will be triggered after the build process complete. `$name` is string handler name, `$func` is function to handle callback.

**`.unbind($name)`**
> Remove callback from automator. `$name` is the handler name.

***
### **Box Automator**
**Box Automator** will help you to maintain the **`box-ratio`**, **`box-height`**, and **`box-row-height`**.

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

#### **Box Row Height Automator**
**Box Row Height Automator** / **`Automator('box-row-height')`** will help you to maintain height of element in each row, like when using Grid Layout.

- **`data-box-row-height="COLUMN_COUNT"`** - for parent node.
- **`data-box-row-child`** - for child nodes.

> **`COLUMN_COUNT`** is the number of column where the element will be grouped. For example, if you have 10 `<li>` and want to set the height for every **3** `<li>`, then use **3** as **`COLUMN_COUNT`**.

***`Sample`***
```html
<!-- Makes the every 3 child nodes in the same height -->
<ul class="grid" data-box-row-height="3">
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
	<li class="col-4" data-box-row-child></li>
</ul>
```

### **Background Automator**
**Background Automator** will help you to dynamically set the background-image of an element, auto-find retina and responsive image. You can set the background by url or get from image from this childrens. We're prefer to get from child image for search engine support, and hide child img in css. We know that using background-image will makes images appear more fine rather than `img` element. It's because the variety of images dimension. So we could use `cover` and `center` for background. ;)

**`data-background="BGD"`**
> `BGD` is string image-url for custom image url, or `get-img-child` to get from child image.

***`Configs`***
- **`responsive`** - `true` or `false`. Default is `true`. Tell automator should the responsive image used or not.
- **`retina`** - `true` or `false`. Default is `true`. Tell automator should the retina image used or not.
- **`clean`** - `true` or `false`. Default is `false`. Tell automator should the `data-background` attribute removed or not.

***`File Naming`***
- **`img-name.jpg`** - Default or desktop usage.
- **`img-name.tab.jpg`** - Image for tablet view.
- **`img-name@2x.jpg`** - Image for retina display.
- **`img-name.tab@2x.jpg`** - Both tablet and retina display.

***`Sample`***
```html
<!-- Using custom image url -->
<div class="img-box" data-background="images/img-1.jpg"></div>

<!-- Get from child image -->
<div clas="img-box" data-background="get-child-img">
	<img src="images/img-2.jpg" />
</div>
```

### **Accordion Automator**
**Accordion Automator** will help you to create smart accordion and accordion group. So, what actually **Accordion Automator** do? What the difference between accordion and accordion group?

#### **Accordion**
**Accordion** / `Automator('accordion')` will help you to toggle expand/collapse content inside this. So, when you click the button, the content will be expanded. And when you click again, the content will be collapsed. But in the fact, this automator can be used to build something other than accordion since it will accept `hover` and `mouseenter` event, and of course it's configurable. So you can add your own effect handler. Then you can use it to create like tooltip, popup, etc. ;)

**`data-accordion="$CONFIG"`**
> `$CONFIG` is the accordion config. Available config:
> 
> - **`effect`** - string effect name that handle expand/collapse event.
> - **`click`** - `true` or `false` - To enable/disable click event.
> - **`hover`** - `true` or `false` - To enable/disable hover event. If you enable the `hover` event, then you can't enable `enter` event. Also you may define `delay` time before each expand/collapse triggered.
> - **`enter`** - `true` or `false` - To enable/disable mouseenter event. If you enable `enter` event, then you can't enable `hover` event. You may also define `delay` time before event fired.
> - **`delay`** - `number` - To define millisecond time before `hover` or `enter` event fired. It's to prevent hovering mistakes. Default is `200` ms.