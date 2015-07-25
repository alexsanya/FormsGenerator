var quiz =
[
	{id:1, 'question':'Укажите ваше имя?', type:"text"},
	{id:2, 'question':'Выберите два любимых цветах?', type:"array", answers:['#33333', '#e0e0e0', '#fff', '#000']},
	{id:3, 'question':'Введите свой имейл?', type:"email"},
	{id:4, 'question':'Укажите свою дату рождения?', type:"date"},
	{id:5, 'question':'Приложите свою фотографию?', type:"file"}
];


function FormField(data) {
	this.data = data;
}

FormField.prototype.getDomItem = function () {
	return  this.constructor.templates[this.data.type].template(this.data);
}

FormField.templates = {
	text: {
		pattern: /\w+/,
		template: function (data) {
			return $('<input type="text"></input>');
		}
	},
	array: {
		pattern: /\w+/,
		template: function (data) {
			var template = '<select multiple>';
			data.answers.forEach(function (variant) {
				template += '<option value="'+variant+'">'+variant+'</option>'
			});
			template += '</select>';
			return $(template);
		}
	},
	email: {
		pattern: /\S+@\S+\.\S+/,
		template: function (data) {
			return $('<input type="text"></input>');
		}
	},
	date: {
		pattern: /^\d{4}-\d{2}-\d{2}$/,
		template: function (data) {
			return $('<input type="text"></input>');
		}
	},
	file: {
		pattern: /\w+/,
		template: function (data) {
			return $('<input type="file"></input>');
		}
	}
}

function Form(fields) {
	this.fields = fields;
}

Form.prototype.submit = function () {
	var self = this,
		valid = true,
		result = [],
		InvalidInput = new Error();

	try {
		this.fields.forEach(function (field) {
			if (FormField.templates[field.type].pattern.test(field.domItem.val())) {
				result.push({
					id: field.id,
					value: field.domItem.val()
				});
			} else {
				alert('Value ' + field.question + ' is wrong');
				valid = false;
				throw InvalidInput;
			}
		});
		console.log(result);
	} catch (error) {

	}
	return false;
}

Form.prototype.getCode = function () {
	var formBlock = $('<form>');
	this.fields.forEach(function (fieldData) {
		var field = new FormField(fieldData);
			
		fieldData.domItem = field.getDomItem();
		formBlock.append($('<div>')
			.append($('<label>').html(fieldData.question))
			.append(fieldData.domItem)
		);
	});
	formBlock.append($('<button>').html('Submit'));
	formBlock.submit(this.submit.bind(this));

	return formBlock;
}

$.fn.buildForm = function (filedsList) {
	var form = new Form(filedsList),
		htmlFormCode = form.getCode();
	$(this).append(htmlFormCode);
}

$(document).ready(function () {
	$('#container').buildForm(quiz);
});

