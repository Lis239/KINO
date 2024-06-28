
class ApiError extends Error{
    constructor(status,message) {
        super();
        this.message=status+":"+message;
        this.status=status;
    }
    static badReq(message){
        return new ApiError(404,message)
    }
    static internal(message){
        return new ApiError(500,message)
    }
    static forbidden(message){
        return new ApiError(403,message)
    }
    static badReq401(message){
        return new ApiError(401,message)
    }
}

module.exports=ApiError