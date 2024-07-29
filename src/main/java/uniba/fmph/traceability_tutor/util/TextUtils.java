package uniba.fmph.traceability_tutor.util;

public class TextUtils {
    public static String normalizeText(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return Character.toUpperCase(text.charAt(0)) + text.substring(1).toLowerCase();
    }
}
