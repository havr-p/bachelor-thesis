package uniba.fmph.traceability_tutor.service;

import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Iteration;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.mapper.RelationshipMapper;
import uniba.fmph.traceability_tutor.model.CreateRelationshipDTO;
import uniba.fmph.traceability_tutor.model.RelationshipDTO;
import uniba.fmph.traceability_tutor.model.RelationshipType;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.IterationRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.util.List;
import java.util.Set;


@Service
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final ItemRepository itemRepository;
    private final IterationRepository iterationRepository;
    private final RelationshipMapper relationshipMapper;
    private Project currentProject;
    private final ProjectRepository projectRepository;

    public RelationshipService(final RelationshipRepository relationshipRepository,
                               final ItemRepository itemRepository, final IterationRepository iterationRepository, RelationshipMapper relationshipMapper,
                               ProjectRepository projectRepository) {
        this.relationshipRepository = relationshipRepository;
        this.itemRepository = itemRepository;
        this.iterationRepository = iterationRepository;
        this.relationshipMapper = relationshipMapper;
        this.projectRepository = projectRepository;
    }

    public List<RelationshipDTO> findAll() {
        final List<Relationship> relationships = relationshipRepository.findAll(Sort.by("id"));
        return relationships.stream()
                .map(this::mapToDTO)
                .toList();
    }

    public RelationshipDTO get(final Long id) {
        return relationshipRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(NotFoundException::new);
    }

    public RelationshipDTO create(final CreateRelationshipDTO relationshipDTO) {
        Project managedProject = projectRepository.findById(currentProject.getId())
                .orElseThrow(() -> new NotFoundException("Project not found"));
        final Relationship relationship = mapToEntity(relationshipDTO, managedProject);
        return mapToDTO(relationshipRepository.save(relationship));
    }

    public RelationshipDTO update(final Long id, final RelationshipDTO relationshipDTO) {
        final Relationship relationship = relationshipRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        return mapToDTO(relationshipRepository.save(mapToEntity(relationshipDTO, relationship)));
    }

    public void delete(final Long id) {
        if (relationshipRepository.existsById(id)) {
            relationshipRepository.deleteById(id);
        }
    }

    private RelationshipDTO mapToDTO(final Relationship relationship) {
        return relationshipMapper.toDto(relationship);
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
        final Iteration iteration = relationshipDTO.getIterationId() == null ? null : iterationRepository.findById(relationshipDTO.getIterationId())
                .orElseThrow(() -> new NotFoundException("release not found"));
        relationship.setIteration(iteration);
        return relationship;
    }

    public List<RelationshipDTO> getProjectEditableRelationships(Long projectId) {
        return relationshipRepository.findNonIterationByProjectId(projectId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    public RelationshipDTO connectRequirementToCode(Item item, Item codeItem, Long projectId) {
       return this.create(new CreateRelationshipDTO(RelationshipType.SATISFIES, "", item.getInternalId(), codeItem.getInternalId()));
    }

    public boolean existsBetween(Long startItemId, Long endItemId) {
        return relationshipRepository.existsByStartItem_IdAndEndItem_Id(startItemId, endItemId);
    }

    public void deleteAllBetween(Long startItemId, Long endItemId) {
        relationshipRepository.deleteByStartItem_IdAndEndItem_Id(startItemId, endItemId);
    }

    public void deleteAllConnectedWithCodeItems(Set<Long> codeItemIds) {
        for (Long id :
             codeItemIds) {
            relationshipRepository.deleteByIterationNullAndStartItem_IdOrEndItem_Id(id, id);
        }
    }

    public void setIteration(Long relationshipId, Iteration iteration) {
        relationshipRepository.updateIterationById(iteration, relationshipId);
    }

    public List<RelationshipDTO> createMultiple(List<RelationshipDTO> relationships) {
        var mapped = relationships.stream().map(r -> {
            var relationship = new Relationship();
            return mapToEntity(r, relationship);
        }).toList();
        List<Relationship> result = relationshipRepository.saveAllAndFlush(mapped);
        return result.stream().map(this::mapToDTO).toList();
    }

    public void deleteAllEditable(Long projectId) {
        relationshipRepository.deleteByStartItem_Project_IdAndEndItem_Project_IdAndIterationNull(projectId, projectId);
    }

    public Relationship mapToEntity(JsonRelationshipDTO dto) {
        RelationshipDTO normalDTO = relationshipMapper.jsonRelationshipDtoToRelationshipDto(dto);
        return mapToEntity(normalDTO, new Relationship());
    }

    Relationship mapToEntity(final CreateRelationshipDTO dto, Project project) {

        Relationship relationship = new Relationship();
        relationship.setType(dto.getType());
        relationship.setDescription(dto.getDescription());
        var startItem = itemRepository.findNonIterationByProjectInternalId(project, dto.getStartItemInternalId())
                .orElseThrow(() -> new NotFoundException("Start item with internal id = " + dto.getStartItemInternalId() + " was not found"));
        var endItem = itemRepository.findNonIterationByProjectInternalId(project, dto.getEndItemInternalId())
                .orElseThrow(() -> new NotFoundException("End item with internal id = " + dto.getEndItemInternalId() + " was not found"));
        relationship.setStartItem(startItem);
        relationship.setEndItem(endItem);
        Project pr = projectRepository.findById(project.getId()).orElseThrow(NotFoundException::new);
        relationship.setProject(pr);
        return relationship;
    }

@EventListener
public void handleCurrentProjectChanged(CurrentProjectChangedEvent event) {
    this.currentProject = event.getProject();
}
}
