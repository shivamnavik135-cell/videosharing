class apiResponse{
    constructor(statusCode,success,message='success'){
        this.statusCode=statusCode;
        this.success=statusCode<400;
        this.message=message;
        this.data=data;
}}
export default apiResponse;