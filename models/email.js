const inMemoryEmailTemplate = {
    template: [
        {
            "title": "Welcome Back",
            "body":"Thank you so much for working with us...."
        },
        {
            "title": "Thank You",
            "body":"Thank you so much for working with us...."
        },
    ]
};

const emailTemplateModel = {
    get: {
        templates: () => inMemoryEmailTemplate.template,
    },
    update: {
        template: (index, editedTitle, editedBody) => {
        if (index >= 0 && index < inMemoryEmailTemplate.template.length) {
            inMemoryEmailTemplate.template[index].title = editedTitle;
            inMemoryEmailTemplate.template[index].body = editedBody;
            console.log(inMemoryEmailTemplate.template[index])
            return "Email template updated successfully";
        } else {
            return "Invalid template index";
        }
        },
    },
    insert: {
        template: (newTemplate) => {
            inMemoryEmailTemplate.template.push(newTemplate);
            return "New email template inserted";
        },
    },
};

module.exports = emailTemplateModel;
