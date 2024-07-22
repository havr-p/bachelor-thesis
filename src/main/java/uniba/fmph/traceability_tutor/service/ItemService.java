package uniba.fmph.traceability_tutor.service;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.domain.Release;
import uniba.fmph.traceability_tutor.model.CreateItemDTO;
import uniba.fmph.traceability_tutor.model.ItemDTO;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.repos.ReleaseRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;
import java.util.UUID;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;


@Service
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class ItemService {

    private final ItemRepository itemRepository;
    private final ProjectRepository projectRepository;
    private final ReleaseRepository releaseRepository;
    private final RelationshipRepository relationshipRepository;

    public ItemService(final ItemRepository itemRepository,
                       final ProjectRepository projectRepository, final ReleaseRepository releaseRepository,
                       final RelationshipRepository relationshipRepository) {
        this.itemRepository = itemRepository;
        this.projectRepository = projectRepository;
        this.releaseRepository = releaseRepository;
        this.relationshipRepository = relationshipRepository;
    }

    public List<ItemDTO> findAll() {
        final List<Item> items = itemRepository.findAll(Sort.by("id"));
        return items.stream()
                .map(item -> mapToDTO(item, new ItemDTO()))
                .toList();
    }

    public ItemDTO get(final Long id) {
        return itemRepository.findById(id)
                .map(item -> mapToDTO(item, new ItemDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public ItemDTO create(final CreateItemDTO createItemDTO) {
        ItemDTO dto = new ItemDTO();
        mapToDTO(itemRepository.save(mapToEntity(createItemDTO)), dto);
        return dto;
    }

    public void update(final Long id, final ItemDTO itemDTO) {
        Item item = itemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        updateItem(item, itemDTO);
        itemRepository.save(item);
    }

    public void deleteIfExists(final Long id) {
        if (itemRepository.existsById(id)) itemRepository.deleteById(id);
    }

    private ItemDTO mapToDTO(final Item item, final ItemDTO itemDTO) {
        itemDTO.setId(item.getId());
        itemDTO.setItemType(item.getItemType());
        itemDTO.setData(item.getData());
        itemDTO.setStatus(item.getStatus());
        itemDTO.setInternalProjectUUID(item.getInternalProjectUUID());
        itemDTO.setHistoryAction(item.getHistoryAction());
        itemDTO.setProjectId(item.getProject() == null ? null : item.getProject().getId());
        itemDTO.setReleaseId(item.getRelease() == null ? null : item.getRelease().getId());
        return itemDTO;
    }

    private Item mapToEntity(final ItemDTO itemDTO) {
        Item item = new Item();
        updateItem(item, itemDTO);
        return item;
    }

    public Item mapToEntity(final CreateItemDTO createItemDTO) {
        Item item = new Item();
        var data = createItemDTO.getData();
        item.setItemType(createItemDTO.getItemType());
        item.setData(data);
        item.setStatus(createItemDTO.getStatus());
        // UUID will be the same in all iterations
        item.setInternalProjectUUID(UUID.randomUUID().toString());
        final Project project = createItemDTO.getProjectId() == null ? null : projectRepository.findById(createItemDTO.getProjectId())
                .orElseThrow(() -> new NotFoundException("Project with id " + createItemDTO.getProjectId() + "was not found when creating the new item."));
        item.setProject(project);
        return item;
    }

    private void updateItem(Item item, final ItemDTO itemDTO) {
            item.setItemType(itemDTO.getItemType());
            item.setData(itemDTO.getData());
            item.setStatus(itemDTO.getStatus());
            item.setInternalProjectUUID(itemDTO.getInternalProjectUUID());
            item.setHistoryAction(itemDTO.getHistoryAction());
            final Project project = itemDTO.getProjectId() == null ? null : projectRepository.findById(itemDTO.getProjectId())
                    .orElseThrow(() -> new NotFoundException("project not found"));
            item.setProject(project);
            final Release release = itemDTO.getReleaseId() == null ? null : releaseRepository.findById(itemDTO.getReleaseId())
                    .orElseThrow(() -> new NotFoundException("release not found"));
            item.setRelease(release);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Item item = itemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Relationship parentRelationship = relationshipRepository.findFirstByStartItem(item);
        if (parentRelationship != null) {
            referencedWarning.setKey("item.relationship.startItem.referenced");
            referencedWarning.addParam(parentRelationship.getId());
            return referencedWarning;
        }
        final Relationship childRelationship = relationshipRepository.findFirstByEndItem(item);
        if (childRelationship != null) {
            referencedWarning.setKey("item.relationship.childItem.referenced");
            referencedWarning.addParam(childRelationship.getId());
            return referencedWarning;
        }
        return null;
    }

    public List<ItemDTO> getProjectEditableItems(Long projectId) {
        return itemRepository.findNonReleaseByProjectId(projectId).stream()
                .map(item -> mapToDTO(item, new ItemDTO()))
                .toList();
    }
}
