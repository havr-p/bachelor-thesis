package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Iteration;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.model.Commit;
import uniba.fmph.traceability_tutor.model.IterationDTO;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.repos.IterationRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.*;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;


@Service
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class IterationService {

    private final IterationRepository iterationRepository;
    private final ProjectRepository projectRepository;
    private final ItemRepository itemRepository;
    private final RelationshipRepository relationshipRepository;
    private final ItemService itemService;
    private final ObjectMapper objectMapper;

    public IterationService(final IterationRepository iterationRepository,
                            final ProjectRepository projectRepository, final ItemRepository itemRepository,
                            final RelationshipRepository relationshipRepository, ItemService itemService, ObjectMapper objectMapper) {
        this.iterationRepository = iterationRepository;
        this.projectRepository = projectRepository;
        this.itemRepository = itemRepository;
        this.relationshipRepository = relationshipRepository;
        this.itemService = itemService;
        this.objectMapper = objectMapper;
    }

    public List<IterationDTO> findAll() {
        final List<Iteration> iterations = iterationRepository.findAll(Sort.by("id"));
        return iterations.stream()
                .map(iteration -> mapToDTO(iteration, new IterationDTO()))
                .toList();
    }

    public IterationDTO get(final Long id) {
        return iterationRepository.findById(id)
                .map(iteration -> mapToDTO(iteration, new IterationDTO()))
                .orElseThrow(NotFoundException::new);
    }

    public Iteration create(final IterationDTO iterationDTO) {
        final Iteration iteration = new Iteration();
        mapToEntity(iterationDTO, iteration);
        return iterationRepository.save(iteration);
    }

    public void update(final Long id, final IterationDTO iterationDTO) {
        final Iteration iteration = iterationRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        mapToEntity(iterationDTO, iteration);
        iterationRepository.save(iteration);
    }

    public void delete(final Long id) {
        iterationRepository.deleteById(id);
    }

    public IterationDTO mapToDTO(final Iteration iteration, final IterationDTO iterationDTO) {
        iterationDTO.setId(iteration.getId());
        iterationDTO.setIterationCommitSha(iteration.getIterationCommitSha());
        iterationDTO.setSemanticId(iteration.getSemanticId());
        iterationDTO.setProject(iteration.getProject() == null ? null : iteration.getProject().getId());
        return iterationDTO;
    }

    private Iteration mapToEntity(final IterationDTO iterationDTO, final Iteration iteration) {
        iteration.setIterationCommitSha(iterationDTO.getIterationCommitSha());
        iteration.setSemanticId(iterationDTO.getSemanticId());
        final Project project = iterationDTO.getProject() == null ? null : projectRepository.findById(iterationDTO.getProject())
                .orElseThrow(() -> new NotFoundException("project not found"));
        iteration.setProject(project);
        return iteration;
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Iteration iteration = iterationRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Item iterationItem = itemRepository.findFirstByIteration(iteration);
        if (iterationItem != null) {
            referencedWarning.setKey("iteration.item.iteration.referenced");
            referencedWarning.addParam(iterationItem.getId());
            return referencedWarning;
        }
        final Relationship iterationRelationship = relationshipRepository.findFirstByIteration(iteration);
        if (iterationRelationship != null) {
            referencedWarning.setKey("iteration.relationship.iteration.referenced");
            referencedWarning.addParam(iterationRelationship.getId());
            return referencedWarning;
        }
        return null;
    }

    public Iteration createLastestIteration(Long projectId) {
        Iteration newIteration;
        List<Commit> commits = deserializeCommits(this.itemService.findLastestCodeItem(projectId).getData());
        final Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found when creating the new iteration."));
        Optional<String> latestCommitSha = commits.stream()
                .max(Comparator.comparing(Commit::committedAt))
                .map(Commit::sha);
        if (latestCommitSha.isPresent()) {
            newIteration = Iteration.builder()
                    .iterationCommitSha(latestCommitSha.get())
                    .semanticId(UUID.randomUUID().toString())
                    .project(project).build();
        }
        else {
            newIteration = Iteration.builder()
                    .semanticId(UUID.randomUUID().toString())
                    .project(project).build();
        }
        return iterationRepository.save(newIteration);

    }

    public List<Commit> deserializeCommits(Map<String, String> data) {
        try {
            String commitsJson = data.get("commits");
            return objectMapper.readValue(commitsJson, new TypeReference<List<Commit>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
