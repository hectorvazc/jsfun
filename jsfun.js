var debFlag = true;
var log = function log(text, active){
	if((active === undefined || active) && debFlag){
		console.log(text);
	}
};

var js = function js(element){
	this.element = element;
};

js.prototype.get = function(){
	var element = this.element;
	js.clean();
	return element;
}

js.prototype.set = function(element){
	this.element = element;
	return this;
}

js.prototype.find = function(selector) {

	var query_result;
	if (this.context === undefined) {
		query_result = find_selector(selector);
	} else {
		query_result = find_selector(selector, this.context);
	}

	if (query_result.length == 0) {
		this.element = undefined;
	} else if (query_result.length == 1) {
		this.element = query_result[0];
	} else {
		this.element = query_result;
	}
	return this;
};

js.prototype.here = function(selector) {
	var query_result = find_selector(selector);
	if (query_result.length == 0) {
		this.context = undefined;
	} else if (query_result.length == 1) {
		this.context = query_result[0];
	} else {
		this.context = query_result;
	}
	return this;
};

js.prototype.html = function(text){
	this.element.innerHTML = text;
	return this;
};

js.prototype.empty = function(){
	this.element.innerHTML = '';
	return this;
};

js.prototype.append = function(text){
	this.element.innerHTML = this.element.innerHTML + " " + text;
	return this;
};

js.prototype.event = function(events, fn, optional_identifier){
	if(this.element === undefined){ 
		return false;
	}
	event_bridge(this.element, events, fn, optional_identifier);
	js.clean();
};

js.prototype.exist = function(selector){
	var element_exist = js.find(selector).element !== undefined;
	js.clean();
	return element_exist;
};

js.prototype.val = function(value){
	if(value === undefined){
		var value = this.element.value;
		js.clean();
		return value;
	}

	this.element.value = value;
	return this;
};

js.prototype.fn = function(fn, identifier){
	(function(){ 
		if(identifier !== undefined){
			log(identifier);
		}
		fn();
	})(this);
}

js.prototype.data = function(data){
	return $data(this.element, data);
}

js.prototype.clean = function(){
	this.element = undefined;
};

js.prototype.addAttr = function(attributeList){
	if(this.element === undefined) return false; // if element its undefined lets return
	if(!isObject(attributeList)) return false; // attributes to add must be an object.
	
	Array.prototype.forEach.call(ensureArray(this.element), function(element){
		for(var attr in attributeList){
			element.setAttribute(attr, attributeList[attr]);
		}
	});
	return this;
};

js.prototype.removeAttr = function(attributeList){
	if(this.element === undefined) return false; // if element its undefined lets return
	Array.prototype.forEach.call(ensureArray(this.element), function(element){
		Array.prototype.forEach.call(ensureArray(attributeList), function(attribute){
			element.removeAttribute(attribute);
		});
	});
	return this;
};

js.prototype.addStyle = function(styleList){
	if(this.element === undefined) return false;
	if(!isObject(styleList)) return false; // styles to add must be an object.
	
	Array.prototype.forEach.call(ensureArray(this.element), function(element){
		for(var style in styleList){
			element.style.setProperty(style, styleList[style]);
		}
	});
	return this;
};


js.prototype.removeStyle = function(styleList){
	if(this.element === undefined) return false;
	Array.prototype.forEach.call(ensureArray(this.element), function(element){
		Array.prototype.forEach.call(ensureArray(styleList), function(style){
			 element.style.removeProperty(style);
		});
	});
	return this;
};

js.prototype.hide = function(){
	if(this.element === undefined) return false;
	Array.prototype.forEach.call(ensureArray(this.element), function(element){
		element.style.setProperty("display", "none");
	});
};

js.prototype.show = function(){
	if(this.element === undefined) return false;
	Array.prototype.forEach.call(ensureArray(this.element), function(element){
		element.style.removeProperty("display");
	});
};

var js = new js(null);	// init the fluent api


var ensureArray = function ensureArray(inside_element){
	var temp_arr;
	if(!isNodeList(inside_element) && !isArray(inside_element)){
		temp_arr = [];
		temp_arr.push(inside_element);
	}else{
		temp_arr = inside_element;
	}
	return temp_arr;
}


//js.prototype.removeAttr = function(attributes){
//	
//};

/* =======================================================
 * 					 _NEW ONES_
 * ====================================================== */

var find_selector = function find_selector(selector, context) {
	if (context === undefined) {
		return document.querySelectorAll(selector);
	} else {
		return context.querySelectorAll(selector);
	}
};

var $data = function $data(element, data){
	var dataset = element.dataset[data] || element.dataset;
	if(dataset !== undefined){
		if(dataset.length === undefined){
			dataset = undefined;
		}
	}
	return dataset;
};

var event_bridge = function event_bridge(element, type, fn, optional_identifier){
	if(isString(type)){
		if(isNodeList(element)){
			Array.prototype.forEach.call(element, function(el){
				bind_event(el, type, fn, optional_identifier);
			});
		}else{
			bind_event(element, type, fn, optional_identifier);
		}
	}else{
		Array.prototype.forEach.call(type, function(typefn){
			if(isNodeList(element)){
				Array.prototype.forEach.call(element, function(el){
					bind_event(el, typefn, fn, optional_identifier);
				});
			}else{
				bind_event(element, typefn, fn, optional_identifier);
			}
		});
	}
};

var bind_event = function bind_event(element, event_type, fn, identifier){
	var identifier = identifier || "events",
		str_data = "",
		at = [];
	
	var element_data = $data(element, identifier);
	
	if(element_data !== undefined){
		str_data = element.dataset[identifier];
	}
	
	if(!empty(str_data)){
		var at = getJSON(str_data);
	}else{
		at = [];
	}
	
	if(at.length > 0){
		if(at.indexOf(event_type) !== -1){
			return;
		}
	}
	at.push(event_type);
	
	element.dataset[identifier] = setJSON(at);
	element.addEventListener(event_type, fn);
};

/* =========================================
 *  	      
 * =========================================
 */
