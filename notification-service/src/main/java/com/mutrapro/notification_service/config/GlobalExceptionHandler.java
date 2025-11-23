package com.mutrapro.notification_service.config;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /* 400 – JSON/body không hợp lệ */
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            org.springframework.http.converter.HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, Object> body =
                baseBody(HttpStatus.BAD_REQUEST, "Malformed JSON request", request);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /* 400 – thiếu/invalid query param */
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, Object> body =
                baseBody(HttpStatus.BAD_REQUEST, "Missing request parameter", request);
        body.put("detail", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /* 400 – @Valid trên @RequestBody thất bại */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        Map<String, Object> body =
                baseBody(HttpStatus.BAD_REQUEST, "Validation failed", request);

        Map<String, String> errors = new HashMap<>();
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        for (FieldError fe : fieldErrors) {
            errors.put(fe.getField(), fe.getDefaultMessage());
        }
        body.put("errors", errors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /* 400 – @Validated trên @RequestParam/@PathVariable thất bại */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException ex,
            WebRequest request) {

        return build(HttpStatus.BAD_REQUEST,
                "Constraint violation",
                ex.getMessage(),
                request);
    }

    /* 404 – không có handler */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNoHandlerFound(
            NoHandlerFoundException ex,
            WebRequest request) {

        return build(HttpStatus.NOT_FOUND,
                "Endpoint not found",
                ex.getRequestURL(),
                request);
    }

    /* 409 – vi phạm ràng buộc DB */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            WebRequest request) {

        return build(HttpStatus.CONFLICT,
                "Data integrity violation",
                ex.getMostSpecificCause().getMessage(),
                request);
    }

    /* 500 – lỗi không xác định */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAll(
            Exception ex,
            WebRequest request) {

        return build(HttpStatus.INTERNAL_SERVER_ERROR,
                "Internal server error",
                ex.getMessage(),
                request);
    }

    /* Helpers */

    private ResponseEntity<Object> build(
            HttpStatus status,
            String message,
            String detail,
            WebRequest request) {

        Map<String, Object> body = baseBody(status, message, request);
        body.put("detail", detail);
        return new ResponseEntity<>(body, status);
    }

    private Map<String, Object> baseBody(
            HttpStatus status,
            String message,
            WebRequest request) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", request.getDescription(false));
        return body;
    }
}
