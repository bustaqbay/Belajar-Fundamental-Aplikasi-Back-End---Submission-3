const InvariantError = require("../../exceptions/InvariantError");
const ExportPlaylistPayloadSchema = require("./schema");

const ExportValidator = {
    validateExportsPlaylistsValidator: (payload) => {
        const validationsResult = ExportPlaylistPayloadSchema.validate(payload);
        if(validationsResult.error) {
            throw new InvariantError(validationsResult.error.message);
        }
    }
}

module.exports = ExportValidator;