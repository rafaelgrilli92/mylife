const isEmail = require('validator').isEmail;

function validation(data, validations) {
    let errors = [];

    for (let field in validations) {
        if (validations.hasOwnProperty(field)) {
            const rules = validations[field];
            const value = data[field];
            for (let i in rules) {
                if (rules.hasOwnProperty(i)) {
                    const rule = rules[i];
                    switch (rule) {
                        case 'required':
                            if (!value) 
                                errors.push(`The field '${field}' is required`);
                            break;
                        case 'email':
                            if (!isEmail(value)) 
                                errors.push(`The email '${value}' is not valid`);
                            break;
                    }
                }
            }
        }
    }

    return errors.length > 0 ? errors : false;
};

module.exports = validation;