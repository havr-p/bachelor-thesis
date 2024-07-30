package uniba.fmph.traceability_tutor.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uniba.fmph.traceability_tutor.model.HistoryAction;
import uniba.fmph.traceability_tutor.model.RelationshipType;

import java.time.OffsetDateTime;


@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Relationship {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RelationshipType type;

    @Column
    @Enumerated(EnumType.STRING)
    private HistoryAction historyAction;

    @Column
    private String description;


    //todo: changed to EAGER from LAZY because of RelationshipMapper. is it needed?
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "start_item_id", nullable = false)
    private Item startItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "end_item_id", nullable = false)
    private Item endItem;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "iteration_id")
    private Iteration iteration;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime lastUpdated;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

}
