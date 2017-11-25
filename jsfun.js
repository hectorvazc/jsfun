var debFlag = true;
var log = function log(toLog, active) {
	if ((active === undefined || active) && debFlag) console.log(toLog);
};

var js = function js(element) {
	if (!(this instanceof js)) return new js(element);
	if (element !== undefined)
		if(!isNode(element))
			element = find_selector(element);
	this.element = element;
	this.context = undefined;
	return this;
};

js.prototype.get = function () { 
	this.context = undefined;
	return this.element; 
}

js.prototype.getNode = function(selector){
	var element = find_selector(selector, this.context);
	this.context = undefined;
	return element;
}

js.prototype.find = function (selector) {
	this.element = find_selector(selector, this.context);
	this.context = undefined;
	return this;
};

js.prototype.here = function (selector) {
	if (isNode(selector)) this.context = selector;
	else {
		var query_result = find_selector(selector);
		if(query_result === undefined){
			this.context = undefined;
		}else{
			if(isNodeList(query_result)){
				this.context = query_result[0];
			}else{
				this.context = query_result;
			}
		}
	}
	return this;
};

js.prototype.html = function (text) {
	if (text === undefined) return this.element.innerHTML;
	this.element.innerHTML = text;
	return this;
};

js.prototype.empty = function () {
	this.element.innerHTML = '';
	return this;
};

js.prototype.append = function (text) {
	this.element.innerHTML = [this.element.innerHTML, text].join(" ");
	return this;
};

js.prototype.exist = function (selector) {
	return this.element !== undefined;
};

js.prototype.val = function (value) {
	if (this.element === undefined) return undefined;
	if (value === undefined) {
		return this.element.value;
	}
	this.element.value = value;
	return this;
};

js.prototype.clean = function () {
	this.element = undefined;
	this.context = undefined;
};

js.prototype.first = function () {
	this.element = $array(this.element)[0];
	return this;
};

js.prototype.setAttribute = function (attributeList) {
	if (typeof (attributeList) !== 'object') return false; // attributes to add must be an object.
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			for (var attr in attributeList) {
				element.setAttribute(attr, attributeList[attr]);
			}
		});
	} else {
		log("this.element is undefined. setAttribute call.");
	}
	return this;
};

js.prototype.removeAttribute = function (attributeList) {
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			foreach(attributeList, function (attribute) {
				element.removeAttribute(attribute);
			});
		});
	} else {
		log("this.element is undefined. removeAttribute call.");
	}
	return this;
};

js.prototype.addStyle = function (styleList) {
	if (typeof (styleList) !== 'object') return false; // styles to add must be an object.
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			for (var style in styleList) {
				element.style.setProperty(style, styleList[style]);
			}
		});
	} else {
		log("this.element is undefined. addStyle call.");
	}
	return this;
};

js.prototype.removeStyle = function (styleList) {
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			foreach(styleList, function (style) {
				element.style.removeProperty(style);
			});
		});
	} else {
		log("this.element is undefined. removeStyle call.");
	}
	return this;
};

js.prototype.addClass = function (classList) {
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			foreach(classList, function (_class) {
				element.classList.add(_class);
			});
		});
	} else {
		log("this.element is undefined. addClass call.");
	}
	return this;
};

js.prototype.removeClass = function (classList) {
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			foreach(classList, function (_class) {
				if (element.classList.contains(_class)) {
					element.classList.remove(_class);
				}
			});
		});
	} else {
		log("this.element is undefined. removeClass call.");
	}
	return this;
};

js.prototype.hide = function () {
	if (this.element !== undefined) {
		foreach(this.element, function (element) { element.style.setProperty("display", "none"); });
	} else {
		log("this.element is undefined. hide call.");
	}
	return this;
};

js.prototype.show = function () {
	if (this.element !== undefined) {
		foreach(this.element, function (element) { element.style.removeProperty("display"); });
	}else {
		log("this.element is undefined. show call.");
	}
	return this;
};

js.prototype.resize = function () {
	if (this.element === undefined) return;
	this.element.style.height = "1px";
	this.element.style.height = (this.element.scrollHeight) + "px";
	return this;
};

js.prototype.text = function () {
	if (this.element === undefined) return '';
	return this.element.innerText || this.element.textContent;
};

js.prototype.insertFirst = function (element_toappend) {
	if (this.element === undefined) return;
	this.element.insertAdjacentElement("afterbegin", element_toappend);
	return this;
};

js.prototype.insertLast = function (element_toappend) {
	if (this.element === undefined) return;
	this.element.insertAdjacentElement("beforeend", element_toappend);
	return this;
};

js.prototype.insertBefore = function (element_toappend) {
	if (this.element === undefined) return;
	this.element.insertAdjacentElement("beforebegin", element_toappend);
	return this;
};

js.prototype.insertAfter = function (element_toappend) {
	if (this.element === undefined) return;
	this.element.insertAdjacentElement("afterend", element_toappend);
	return this;
};

js.prototype.detach = function () {
	if (this.element === undefined) return;
	var elements = [];
	foreach(this.element, function (element) {
		elements.push($detach(element));
	});
	return elements;
};

js.prototype.visible = function () {
	if (this.element === undefined) return;
	return this.element.style.display !== 'none';
};

js.prototype.hidden = function () {
	if (this.element === undefined) return;
	return !this.visible();
};

js.prototype.each = function(fn){
	if(this.element !== undefined){
		foreach(this.element, fn);
		this.clean();
	}
	else
		log("this.element is undefined. show call.");
}

js.prototype.event = function (events, fn, optional_identifier) {
	if (this.element !== undefined) {
		foreach(this.element, function (element) {
			foreach(events, function (event) {
				bind_event(element, event, fn, optional_identifier);
			});
		});
		this.clean();
	} else {
		log("this.element is undefined. event call.");
		return this;
	}
};

//===================================== GENERAL FUNCTIONS
function find_selector(selector, context) {
	var r = (context === undefined) ? document.querySelectorAll(selector) : context.querySelectorAll(selector);
	console.assert(r.length, ["find_selector:", selector, context, "is undefined"].join(' '));

	if (r.length === 0) {
		return undefined;
	} else if (r.length === 1) {
		return r[0];
	} else {
		return r;
	}
};

function isNode(element) {
	return element instanceof Node;
}

function isNodeList(element) {
	return element instanceof NodeList;
}

function fn(fn) {
	if (fn === undefined) return;
	(function () { fn(); })(this);
}

function foreach(source, fn) {
	if (source === undefined) return false;
	$array(source).forEach(function (currentValue, index, array) {
		fn(currentValue, index, array);
	});
}

function $array(arr) {
	if (arr === undefined) return [];
	var a = [];
	var s = /^\[object (string)\]$/gi.test({}.toString.call((arr))) || /^\[object (htmlselectelement)\]$/gi.test({}.toString.call((arr)));

	if (arr.length === undefined || s) {
		a.push(arr);
	} else {
		a = Array.from(arr);
	}
	return a;
}

function $detach(element) {
	var parent = element.parentNode;
	if (!parent) return;
	parent.removeChild(element);
	return element;
}

function bind_event(element, event_type, fn, identifier) {
	var identifier = identifier || "events",
		str_data = "",
		at = [];

	var element_data = $data(element, identifier);

	if (element_data !== undefined)
		str_data = element.dataset[identifier];

	if (!empty(str_data))
		var at = getJSON(str_data);
	else
		at = [];

	if (at.length > 0)
		if (at.indexOf(event_type) !== -1)
			return;

	at.push(event_type);

	element.dataset[identifier] = setJSON(at);
	element.addEventListener(event_type, fn);
};

function newElement(typeOfElement) {
	return document.createElement(typeOfElement);
}

function key_code(event) {
	return parseInt(event.keyCode || event.which);
}

function toJSON(obj) {
	return JSON.stringify(obj);
};

function parseJSON(obj) {
	return JSON.parse(obj);
};

function parent(element, deep) {
	if (deep === undefined) {
		return element.parentNode;
	} else {
		for (var t = 0; t < Number(deep); t++) {
			element = element.parentNode;
		}
		return element;
	}
};

function ajax(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr;
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		}else {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
        xhr.open(method, url);
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.send();
    });
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

Storage.prototype.removeObject = function(key){
	this.removeItem(key);
}