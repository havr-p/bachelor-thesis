package uniba.fmph.traceability_tutor.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ItemMapperQualifier {

    @Named("mapData")
    Map<String, String> mapData(Map<String, Object> data) {
        Map<String, String> stringData = data.entrySet().stream()
                .filter(entry -> entry.getValue() != null)  // Filter out null values
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            Object value = entry.getValue();
                            if (value instanceof List) {
                                // Handle lists (like "links") by converting to JSON string
                                try {
                                    return new ObjectMapper().writeValueAsString(value);
                                } catch (JsonProcessingException e) {
                                    throw new RuntimeException("Error converting list to JSON", e);
                                }
                            }
                            return value.toString();
                        }
                ));
        return stringData;
    }
}
