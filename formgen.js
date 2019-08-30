var Handler = {};
Handler.string = function(name) {
	return "<input type='text' name='" +name+"'></input><br />";
}
Handler.url = function(name) {
	return "<input type='url' name='" +name+"'></input><br />";
}
Handler.int = function(name) {
	return "<input type='number' name='" +name+"'></input><br />";
}
Handler.bool = function(name) {
	return "<input type='radio' name='" +name+"' value='true'>Yes</input><input type='radio' name='" +name+"' value='false'>No</input><br />";
}
Handler.select = function(options) {
	var html = '';
	html += "<select>";
	for (o of options)
		html += "<option value='" + o + "'>" + o +"</option>";
	html +="</select>";
	return html;
}
Handler.repeater = function(html) {
	
	return html;
}
module.exports = class FormApp {
	
	constructor(file) {
		this.file = file;
		this.form = '';
		this.fields = '';
		this.getFile = "<form method='post' action='http://localhost:8081'><label>File: </label><input type='file' name='file'></input><br><input type='submit'>Submit</input></form>";
		
	}

	getFields() {
		//Reads data structure in JSON template and returns object of fields
		try { 
			return JSON.parse(this.file);
		}
		catch(e) {
			return e + this.getFile;
		}
	}
/*
	fieldToHTML() {
		//Reads field parameters and returns html
	}

	fieldJSValidation() {
		//Reads field parameters and returns javascript validation
	}

	appendHTML() {
		//Appends field html to form
	}

	appendJS() {
		//Appends validation script to js
	}
	*/
	
	
	
	//Recursively loop through an object
	loopThroughObject(obj) {
		var fs = Object.entries(obj);
		var html = this.form;
		
		if (typeof obj.type !== 'undefined') {
			switch (obj.type) {
					case 'repeater':
						return Handler[obj.type](this.loopThroughObject(obj.fields));
					case 'select':
						return Handler[obj.type](obj.options);
					default:
						return "no handler";
			}
		}
		
		for(var [k,v] of fs) {
			if (typeof v == 'object') {
				html += "<div style='margin-left: 15px;'>" + k + ": " + this.loopThroughObject(v) + "</div>";
			}
			else {
				
					html += "<label>" + k + ": </label>" + Handler[v](k);
				
				
			}
		}
		
		
		return html;
	}
	
	generateForm() {
		//returns HTML form
		this.fields = this.getFields();

		this.form = this.loopThroughObject(this.fields.Dungeon);

	}	
	
	
	
	generateApp() {
		//returns zipped node application containing:
		//node server file
		//html form
		this.generateForm();
		//javascript form validation
		return this.form + this.getFile;
	}
};








