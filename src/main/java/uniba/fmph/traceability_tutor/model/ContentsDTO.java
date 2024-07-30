package uniba.fmph.traceability_tutor.model;

import org.springframework.lang.NonNull;

import java.util.List;

public record ContentsDTO(@NonNull List<ItemDTO> items, @NonNull List<RelationshipDTO> relationships) {}
