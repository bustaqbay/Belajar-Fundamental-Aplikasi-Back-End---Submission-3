const InvariantError = require("../../exceptions/InvariantError");
const { PictureHeadersSchema } = require("./schema");

const UploadsValidator = {
    validatePictureHeaders: (headers) => {
        const validationsResult = PictureHeadersSchema.validate(headers);
        if(validationsResult.error) {
            throw new InvariantError(validationsResult.error.message);
        }
    },
};

module.exports = UploadsValidator;