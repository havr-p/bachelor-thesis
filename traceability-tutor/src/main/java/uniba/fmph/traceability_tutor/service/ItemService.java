package uniba.fmph.traceability_tutor.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.domain.Release;
import uniba.fmph.traceability_tutor.model.ItemDTO;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.repos.ReleaseRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;


@Service
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

    public Long create(final ItemDTO itemDTO) {
        final Item item = new Item();
        mapToEntity(itemDTO, item);
        return itemRepository.save(item).getId();
    }

    public void update(final Long id, final ItemDTO itemDTO) {
        final Item item = itemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(itemDTO, item);
        itemRepository.save(item);
    }

    public void delete(final Long id) {
        itemRepository.deleteById(id);
    }

    private ItemDTO mapToDTO(final Item item, final ItemDTO itemDTO) {
        itemDTO.setId(item.getId());
        itemDTO.setItemType(item.getItemType());
        itemDTO.setData(item.getData());
        itemDTO.setStatus(item.getStatus());
        itemDTO.setName(item.getName());
        itemDTO.setProjectInternalUid(item.getProjectInternalUid());
        itemDTO.setHistoryAction(item.getHistoryAction());
        itemDTO.setProject(item.getProject() == null ? null : item.getProject().getId());
        itemDTO.setRelease(item.getRelease() == null ? null : item.getRelease().getId());
        return itemDTO;
    }

    private Item mapToEntity(final ItemDTO itemDTO, final Item item) {
        item.setItemType(itemDTO.getItemType());
        item.setData(itemDTO.getData());
        item.setStatus(itemDTO.getStatus());
        item.setName(itemDTO.getName());
        item.setProjectInternalUid(itemDTO.getProjectInternalUid());
        item.setHistoryAction(itemDTO.getHistoryAction());
        final Project project = itemDTO.getProject() == null ? null : projectRepository.findById(itemDTO.getProject())
                .orElseThrow(() -> new NotFoundException("project not found"));
        item.setProject(project);
        final Release release = itemDTO.getRelease() == null ? null : releaseRepository.findById(itemDTO.getRelease())
                .orElseThrow(() -> new NotFoundException("release not found"));
        item.setRelease(release);
        return item;
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

}
