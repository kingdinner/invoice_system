const inMemoryEmailTemplate = {
    template: [
        "Thank you so much for working with us....",
        "It was great to work with "
    ]
};

const emailTemplateModel = {
    get: {
        templates: () => inMemoryEmailTemplate.template,
    },
    update: {
        template: (index, newTemplate) => {
        if (index >= 0 && index < inMemoryEmailTemplate.template.length) {
            inMemoryEmailTemplate.template[index] = newTemplate;
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
