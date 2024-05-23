package uniba.fmph.traceability_tutor.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProjectWithNameExistsException extends RuntimeException{
    public ProjectWithNameExistsException(String message) { super(message); }
}
