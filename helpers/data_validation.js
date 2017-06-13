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
                            if (_.isEmpty(value)) 
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

function getMongooseErrorMessagesList(err) {
    let errorsList = [];

    if (err && err.errors) 
        for (var key in err.errors)
            if (err.errors.hasOwnProperty(key)) {
                var error = err.errors[key];
                errorsList.push(error.message);
            }

    return errorsList.length > 0 ? errorsList : false;
}

module.exports = getMongooseErrorMessagesList;