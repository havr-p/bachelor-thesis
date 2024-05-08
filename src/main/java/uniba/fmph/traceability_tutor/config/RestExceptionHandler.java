package uniba.fmph.traceability_tutor.config;


import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import uniba.fmph.traceability_tutor.model.ErrorDTO;
import uniba.fmph.traceability_tutor.util.AppException;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = { AppException.class })
    @ResponseBody
    public ResponseEntity<ErrorDTO> handleException(AppException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(new ErrorDTO(ex.getMessage()));
    }

    @ExceptionHandler(value = { JWTVerificationException.class })
    @ResponseBody
    public ResponseEntity<ErrorDTO> handleException(JWTVerificationException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorDTO(ex.getMessage()));
    }
}
