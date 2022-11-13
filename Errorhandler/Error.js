class ApiError {
    constructor(status, message) {
      this.status = status;
      this.message = message;
    }
   static BadRequest(message) {
    return new ApiError(400,message);
   }
   static UnAuthorized(message) {
    return new ApiError(401,message);
   }
   static InternalServerError(message) { 
    return new ApiError(500,message);
   }

}

module.exports = ApiError;