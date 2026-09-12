package com.liferpg.dto.common;

public class ApiErrorResponse {
    private boolean success = false;
    private ErrorDetail error;

    public ApiErrorResponse() {}

    public ApiErrorResponse(String code, String message) {
        this.success = false;
        this.error = new ErrorDetail(code, message);
    }

    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(code, message);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public ErrorDetail getError() { return error; }
    public void setError(ErrorDetail error) { this.error = error; }

    public static class ErrorDetail {
        private String code;
        private String message;

        public ErrorDetail() {}
        public ErrorDetail(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
