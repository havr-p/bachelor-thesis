package uniba.fmph.traceability_tutor.service;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.domain.Release;
import uniba.fmph.traceability_tutor.model.ReleaseDTO;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.repos.ReleaseRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;


@Service
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final ProjectRepository projectRepository;
    private final ItemRepository itemRepository;
    private final RelationshipRepository relationshipRepository;

    public ReleaseService(final ReleaseRepository releaseRepository,
                          final ProjectRepository projectRepository, final ItemRepository itemRepository,
                          final RelationshipRepository relationshipRepository) {
        this.releaseRepository = releaseRepository;
        this.projectRepository = projectRepository;
        this.itemRepository = itemRepository;
        this.relationshipRepository = relationshipRepository;
    }

    public List<ReleaseDTO> findAll() {
        final List<Release> releases = releaseRepository.findAll(Sort.by("id"));
        return releases.stream()
                .map(release -> mapToDTO(release, new ReleaseDTO()))
                .toList();
    }

    public ReleaseDTO get(final Long id) {
        return releaseRepository.findById(id)
                .map(release -> mapToDTO(release, new ReleaseDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Long create(final ReleaseDTO releaseDTO) {
        final Release release = new Release();
        mapToEntity(releaseDTO, release);
        return releaseRepository.save(release).getId();
    }

    public void update(final Long id, final ReleaseDTO releaseDTO) {
        final Release release = releaseRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(releaseDTO, release);
        releaseRepository.save(release);
    }

    public void delete(final Long id) {
        releaseRepository.deleteById(id);
    }

    private ReleaseDTO mapToDTO(final Release release, final ReleaseDTO releaseDTO) {
        releaseDTO.setId(release.getId());
        releaseDTO.setReleaseCommitId(release.getReleaseCommitId());
        releaseDTO.setSemanticId(release.getSemanticId());
        releaseDTO.setProject(release.getProject() == null ? null : release.getProject().getId());
        return releaseDTO;
    }

    private Release mapToEntity(final ReleaseDTO releaseDTO, final Release release) {
        release.setReleaseCommitId(releaseDTO.getReleaseCommitId());
        release.setSemanticId(releaseDTO.getSemanticId());
        final Project project = releaseDTO.getProject() == null ? null : projectRepository.findById(releaseDTO.getProject())
                .orElseThrow(() -> new NotFoundException("project not found"));
        release.setProject(project);
        return release;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Release release = releaseRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Item releaseItem = itemRepository.findFirstByRelease(release);
        if (releaseItem != null) {
            referencedWarning.setKey("release.item.release.referenced");
            referencedWarning.addParam(releaseItem.getId());
            return referencedWarning;
        }
        final Relationship releaseRelationship = relationshipRepository.findFirstByRelease(release);
        if (releaseRelationship != null) {
            referencedWarning.setKey("release.relationship.release.referenced");
            referencedWarning.addParam(releaseRelationship.getId());
            return referencedWarning;
        }
        return null;
    }

}
