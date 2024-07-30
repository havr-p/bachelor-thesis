package uniba.fmph.traceability_tutor.service;

import uniba.fmph.traceability_tutor.domain.Project;

public class CurrentProjectChangedEvent {
    private final Project project;

    public CurrentProjectChangedEvent(Project project) {
        this.project = project;
    }

    public Project getProject() {
        return project;
    }
}
