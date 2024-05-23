package uniba.fmph.traceability_tutor.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.domain.Release;
import uniba.fmph.traceability_tutor.model.CreateRelationshipDTO;
import uniba.fmph.traceability_tutor.model.RelationshipDTO;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.repos.ReleaseRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.util.List;


@Service
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final ItemRepository itemRepository;
    private final ReleaseRepository releaseRepository;

    public RelationshipService(final RelationshipRepository relationshipRepository,
                               final ItemRepository itemRepository, final ReleaseRepository releaseRepository) {
        this.relationshipRepository = relationshipRepository;
        this.itemRepository = itemRepository;
        this.releaseRepository = releaseRepository;
    }

    public List<RelationshipDTO> findAll() {
        final List<Relationship> relationships = relationshipRepository.findAll(Sort.by("id"));
        return relationships.stream()
                .map(relationship -> mapToDTO(relationship, new RelationshipDTO()))
                .toList();
    }

    public RelationshipDTO get(final Long id) {
        return relationshipRepository.findById(id)
                .map(relationship -> mapToDTO(relationship, new RelationshipDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final CreateRelationshipDTO relationshipDTO) {
        final Relationship relationship = new Relationship();
        return relationshipRepository.save(mapToEntity(relationshipDTO, relationship)).getId();
    }

    public void update(final Long id, final RelationshipDTO relationshipDTO) {
        final Relationship relationship = relationshipRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        relationshipRepository.save(mapToEntity(relationshipDTO, relationship));
    }

    public void delete(final Long id) {
        relationshipRepository.deleteById(id);
    }

    private RelationshipDTO mapToDTO(final Relationship relationship,
                                     final RelationshipDTO relationshipDTO) {
        relationshipDTO.setId(relationship.getId());
        relationshipDTO.setType(relationship.getType());
        relationshipDTO.setHistoryAction(relationship.getHistoryAction());
        relationshipDTO.setDescription(relationship.getDescription());
        relationshipDTO.setStartItem(relationship.getStartItem() == null ? null : relationship.getStartItem().getId());
        relationshipDTO.setEndItem(relationship.getEndItem() == null ? null : relationship.getEndItem().getId());
        relationshipDTO.setRelease(relationship.getRelease() == null ? null : relationship.getRelease().getId());
        return relationshipDTO;
    }

    private Relationship mapToEntity(final CreateRelationshipDTO relationshipDTO,
                                     final Relationship relationship) {
        relationship.setType(relationshipDTO.getType());
        relationship.setDescription(relationshipDTO.getDescription());
        final Item startItem = relationshipDTO.getStartItem() == null ? null : itemRepository.findById(relationshipDTO.getStartItem())
                .orElseThrow(() -> new NotFoundException("StartItem not found"));
        relationship.setStartItem(startItem);
        final Item endItem = relationshipDTO.getEndItem() == null ? null : itemRepository.findById(relationshipDTO.getEndItem())
                .orElseThrow(() -> new NotFoundException("EndItem not found"));
        relationship.setEndItem(endItem);
        return relationship;
    }

    private Relationship mapToEntity(final RelationshipDTO relationshipDTO,
                                     final Relationship relationship) {
        relationship.setType(relationshipDTO.getType());
        relationship.setHistoryAction(relationshipDTO.getHistoryAction());
        relationship.setDescription(relationshipDTO.getDescription());
        final Item startItem = relationshipDTO.getStartItem() == null ? null : itemRepository.findById(relationshipDTO.getStartItem())
                .orElseThrow(() -> new NotFoundException("StartItem not found"));
        relationship.setStartItem(startItem);
        final Item endItem = relationshipDTO.getEndItem() == null ? null : itemRepository.findById(relationshipDTO.getEndItem())
                .orElseThrow(() -> new NotFoundException("EndItem not found"));
        relationship.setEndItem(endItem);
        final Release release = relationshipDTO.getRelease() == null ? null : releaseRepository.findById(relationshipDTO.getRelease())
                .orElseThrow(() -> new NotFoundException("release not found"));
        relationship.setRelease(release);
        return relationship;
    }

}
